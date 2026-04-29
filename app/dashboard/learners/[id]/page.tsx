import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Mail, Calendar, CheckCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function LearnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const learner = await prisma.user.findUnique({
    where: { id },
    include: {
      enrollments: {
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
      },
    },
  })

  if (!learner || learner.role !== "LEARNER") {
    redirect("/dashboard/learners")
  }

  // Calculer les stats
  const totalEnrollments = learner.enrollments.length
  const completedEnrollments = learner.enrollments.filter((e) => e.progress === 100).length
  const averageProgress =
    totalEnrollments > 0
      ? learner.enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments
      : 0

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/learners"
          className="inline-flex items-center text-sm text-gray-600 hover:text-slate-100 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux apprenants
        </Link>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-2xl">
                  {learner.name?.charAt(0).toUpperCase() || learner.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-slate-100">{learner.name || "Sans nom"}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {learner.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Inscrit le {format(new Date(learner.createdAt), "d MMMM yyyy", { locale: fr })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-blue-500">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Formations inscrites
                  </dt>
                  <dd className="text-3xl font-semibold text-slate-100">{totalEnrollments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-green-500">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Formations complétées
                  </dt>
                  <dd className="text-3xl font-semibold text-slate-100">{completedEnrollments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-purple-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Progression moyenne
                  </dt>
                  <dd className="text-3xl font-semibold text-slate-100">
                    {averageProgress.toFixed(0)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-slate-100">Formations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {learner.enrollments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Aucune formation assignée pour le moment
            </div>
          ) : (
            learner.enrollments.map((enrollment) => {
              const isCompleted = enrollment.progress === 100
              const course = enrollment.course

              return (
                <div key={enrollment.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-100 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">{course.description}</p>

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

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Inscrit le {format(new Date(enrollment.enrolledAt), "d MMM yyyy", { locale: fr })}
                        </div>
                        {enrollment.completedAt && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complété le {format(new Date(enrollment.completedAt), "d MMM yyyy", { locale: fr })}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Dernière visite {format(new Date(enrollment.lastAccessedAt), "d MMM yyyy", { locale: fr })}
                        </div>
                      </div>

                      {course.modules.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Modules ({course.modules.length})
                          </h4>
                          <div className="space-y-2">
                            {course.modules.map((module, index) => (
                              <div
                                key={module.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <span className="text-sm text-gray-700">
                                  {index + 1}. {module.title}
                                </span>
                                {isCompleted && (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {isCompleted && (
                      <div className="ml-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Terminé
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
