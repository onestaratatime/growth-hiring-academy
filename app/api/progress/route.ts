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
    const { enrollmentId, courseId, watchedDuration, totalDuration } = body

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: true,
      },
    })

    if (!enrollment || enrollment.userId !== session.user.id) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    const progressPercent = totalDuration > 0
      ? Math.min((watchedDuration / totalDuration) * 100, 100)
      : 0

    const isCompleted = progressPercent >= 95

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress: progressPercent,
        completedAt: isCompleted && !enrollment.completedAt ? new Date() : enrollment.completedAt,
        lastAccessedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, progress: progressPercent })
  } catch (error) {
    console.error("Progress update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
