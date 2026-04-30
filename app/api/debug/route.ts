import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const userCount = await prisma.user.count()
    const admin = await prisma.user.findUnique({
      where: { email: "admin@growth-hiring.com" },
      select: { email: true, role: true, id: true }
    })

    return NextResponse.json({
      status: "connected",
      database: process.env.DATABASE_URL ? "configured" : "MISSING",
      userCount,
      admin: admin ? "found" : "NOT FOUND",
      adminEmail: admin?.email,
      adminRole: admin?.role,
    })
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      database: process.env.DATABASE_URL ? "configured but error" : "MISSING",
      error: error.message,
    }, { status: 500 })
  }
}
