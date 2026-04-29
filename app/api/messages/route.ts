import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { senderId, recipientId, content, type, metadata } = body

    if (session.user.id !== senderId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const metadataObj = metadata ? JSON.parse(metadata) : null

    const message = await prisma.message.create({
      data: {
        senderId,
        recipientId: recipientId || null,
        content,
        type: type || "TEXT",
        metadata,
      },
    })

    if (type === "ACCESS_GRANT" && metadataObj?.courseId) {
      const userIds = recipientId
        ? [recipientId]
        : await prisma.user
            .findMany({
              where: { role: "LEARNER" },
              select: { id: true },
            })
            .then((users) => users.map((u) => u.id))

      for (const userId of userIds) {
        const existingEnrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId: metadataObj.courseId,
            },
          },
        })

        if (!existingEnrollment) {
          await prisma.enrollment.create({
            data: {
              userId,
              courseId: metadataObj.courseId,
              progress: 0,
            },
          })
        }
      }
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Message creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
