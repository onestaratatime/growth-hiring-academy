import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Eye, EyeOff } from "lucide-react"
import DeleteCourseButton from "@/components/DeleteCourseButton"
import ToggleCoursePublishButton from "@/components/ToggleCoursePublishButton"

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: {
          enrollments: true,
          modules: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des formations</h1>
          <p className="mt-2 text-gray-600">
            Créez et gérez vos formations
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/courses/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle formation
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 mb-4">Aucune formation pour le moment.</p>
            <Link
              href="/dashboard/courses/new"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-5 w-5 mr-2" />
              Créer votre première formation
            </Link>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {course.title.charAt(0)}
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {course.title}
                  </h3>
                  <div className="ml-2">
                    {course.published ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Eye className="h-3 w-3 mr-1" />
                        Publié
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Brouillon
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{course._count.modules} module(s)</span>
                  <span>{course._count.enrollments} inscrit(s)</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="flex-1 text-center px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition text-sm font-medium"
                  >
                    Modifier
                  </Link>
                  <ToggleCoursePublishButton
                    courseId={course.id}
                    published={course.published}
                  />
                  <DeleteCourseButton courseId={course.id} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
