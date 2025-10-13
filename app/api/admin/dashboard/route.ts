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
      recentOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      })
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
    const usersGrowth = lastMonthUsers > 0 ? ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0
    const ordersGrowth = lastMonthOrders > 0 ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0
    const revenueGrowth = lastMonthRevenue._sum.total ? ((totalRevenue._sum.total! - lastMonthRevenue._sum.total!) / lastMonthRevenue._sum.total!) * 100 : 0

    // Get sales data for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const salesData = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _sum: {
        total: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Format sales data for chart
    const formattedSalesData = salesData.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      sales: item._sum.total || 0
    }))

    // Get user growth data
    const userGrowthData = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const formattedUserGrowthData = userGrowthData.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      users: item._count.id
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

    return NextResponse.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      usersGrowth: Math.round(usersGrowth * 100) / 100,
      ordersGrowth: Math.round(ordersGrowth * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      recentOrders,
      topProducts: topProductsWithNames,
      salesData: formattedSalesData,
      userGrowthData: formattedUserGrowthData,
    })

  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}
