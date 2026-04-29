import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Play, CheckCircle, Clock } from "lucide-react"

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions)

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session?.user?.id },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Mes formations</h1>
        <p className="mt-2 text-gray-600">
          Accédez à vos formations et suivez votre progression
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Aucune formation pour le moment
            </h3>
            <p className="text-gray-600">
              Vous n'êtes inscrit à aucune formation. Contactez votre administrateur pour obtenir l'accès aux formations.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {enrollments.map((enrollment) => {
            const course = enrollment.course
            const isCompleted = enrollment.progress === 100

            return (
              <div
                key={enrollment.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <Link href={`/dashboard/my-courses/${enrollment.id}`}>
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
                </Link>

                <div className="p-6">
                  <Link href={`/dashboard/my-courses/${enrollment.id}`}>
                    <h3 className="text-xl font-semibold text-slate-100 mb-2 hover:text-blue-600 transition">
                      {course.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">Progression</span>
                      <span className="font-semibold">{enrollment.progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          isCompleted ? "bg-green-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.modules.length} module(s)
                    </div>
                    {isCompleted ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Terminé
                      </span>
                    ) : (
                      <Link
                        href={`/dashboard/my-courses/${enrollment.id}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Continuer
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
