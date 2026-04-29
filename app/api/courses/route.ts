import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, videoUrl, thumbnail, duration } = body

    const course = await prisma.course.create({
      data: {
        title,
        description,
        videoUrl,
        thumbnail,
        duration: parseInt(duration) || 0,
        published: false,
      },
    })

    return NextResponse.json({ course })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
