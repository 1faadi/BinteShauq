import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get basic stats
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
    ])

    // Get growth data (comparing with last month)
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const [
      lastMonthUsers,
      lastMonthOrders,
      lastMonthRevenue,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            lt: lastMonth
          }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            lt: lastMonth
          }
        }
      }),
      prisma.order.aggregate({
        where: {
          createdAt: {
            lt: lastMonth
          }
        },
        _sum: { total: true }
      })
    ])

    // Calculate growth percentages
    const currentRevenueSum = Number(totalRevenue._sum.total ?? 0)
    const lastRevenueSum = Number(lastMonthRevenue._sum.total ?? 0)
    const usersGrowth = lastMonthUsers > 0 ? ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0
    const ordersGrowth = lastMonthOrders > 0 ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0
    const revenueGrowth = lastRevenueSum > 0 ? ((currentRevenueSum - lastRevenueSum) / lastRevenueSum) * 100 : 0

    // Get sales data for the last 12 months
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const salesByMonthRaw = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM(total) as revenue
      FROM "Order"
      WHERE "createdAt" >= ${twelveMonthsAgo}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `
    const salesByMonth = (salesByMonthRaw as any[]).map((row) => ({
      month: row.month,
      revenue: Number(row.revenue ?? 0),
    }))

    // Get top products by sales
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })

    const topProductsWithNames = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true }
        })
        return {
          name: product?.name || "Unknown Product",
          sales: item._sum.quantity || 0
        }
      })
    )

    // Get user registration data for the last 12 months
    const userRegistrationsRaw = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as users
      FROM "User"
      WHERE "createdAt" >= ${twelveMonthsAgo}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `
    const userRegistrations = (userRegistrationsRaw as any[]).map((row) => ({
      month: row.month,
      users: Number(row.users ?? 0),
    }))

    // Get order status distribution
    const orderStatusDistribution = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    const formattedOrderStatusDistribution = orderStatusDistribution.map(item => ({
      name: item.status,
      count: item._count.id
    }))

    return NextResponse.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: currentRevenueSum,
      usersGrowth: Math.round(usersGrowth * 100) / 100,
      ordersGrowth: Math.round(ordersGrowth * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      topProducts: topProductsWithNames,
      salesByMonth: salesByMonth,
      userRegistrations: userRegistrations,
      orderStatusDistribution: formattedOrderStatusDistribution,
    })

  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    )
  }
}
