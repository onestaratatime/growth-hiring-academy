import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import CourseEditForm from "@/components/CourseEditForm"

export default async function CourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!course) {
    redirect("/dashboard/courses")
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux formations
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Modifier la formation</h1>
        <p className="mt-2 text-gray-600">
          Mettez à jour les informations et les modules de votre formation
        </p>
      </div>

      <CourseEditForm course={course} />
    </div>
  )
}
