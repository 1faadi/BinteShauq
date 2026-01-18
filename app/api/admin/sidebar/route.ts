import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch all sidebar sections with items (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sections = await prisma.sidebarSection.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error("Error fetching sidebar sections:", error)
    return NextResponse.json(
      { error: "Failed to fetch sidebar sections" },
      { status: 500 }
    )
  }
}

// POST - Create a new sidebar section
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, order } = body

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    const section = await prisma.sidebarSection.create({
      data: {
        title,
        order: order ?? 0,
      },
      include: {
        items: true
      }
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error("Error creating sidebar section:", error)
    return NextResponse.json(
      { error: "Failed to create sidebar section" },
      { status: 500 }
    )
  }
}

// PUT - Update a sidebar section
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, order, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: "Section ID is required" },
        { status: 400 }
      )
    }

    const section = await prisma.sidebarSection.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error("Error updating sidebar section:", error)
    return NextResponse.json(
      { error: "Failed to update sidebar section" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a sidebar section
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Section ID is required" },
        { status: 400 }
      )
    }

    await prisma.sidebarSection.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting sidebar section:", error)
    return NextResponse.json(
      { error: "Failed to delete sidebar section" },
      { status: 500 }
    )
  }
}

