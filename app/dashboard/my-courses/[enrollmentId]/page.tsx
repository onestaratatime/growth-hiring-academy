import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import VideoPlayer from "@/components/VideoPlayer"

export default async function CourseViewPage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>
}) {
  const session = await getServerSession(authOptions)
  const { enrollmentId } = await params

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { order: "asc" },
          },
        },
      },
      user: true,
    },
  })

  if (!enrollment || enrollment.userId !== session?.user?.id) {
    redirect("/dashboard/my-courses")
  }

  const moduleProgress = await prisma.moduleProgress.findMany({
    where: {
      userId: session?.user?.id,
      moduleId: {
        in: enrollment.course.modules.map((m) => m.id),
      },
    },
  })

  const progressMap = Object.fromEntries(
    moduleProgress.map((p) => [p.moduleId, p])
  )

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/my-courses"
          className="inline-flex items-center text-sm text-gray-600 hover:text-slate-100 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à mes formations
        </Link>
        <h1 className="text-3xl font-bold text-slate-100">
          {enrollment.course.title}
        </h1>
        <p className="mt-2 text-gray-600">{enrollment.course.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <VideoPlayer
              videoUrl={enrollment.course.videoUrl}
              enrollmentId={enrollment.id}
              courseId={enrollment.course.id}
              userId={session?.user?.id || ""}
            />
          </div>

          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">
              À propos de cette formation
            </h2>
            <p className="text-gray-600">{enrollment.course.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">
                Votre progression
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progression totale</span>
                <span className="font-semibold text-lg">
                  {enrollment.progress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    enrollment.progress === 100 ? "bg-green-500" : "bg-blue-600"
                  }`}
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
            </div>

            {enrollment.course.modules.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-slate-100 mb-3">
                  Modules ({enrollment.course.modules.length})
                </h3>
                <div className="space-y-2">
                  {enrollment.course.modules.map((module, index) => {
                    const progress = progressMap[module.id]
                    const isCompleted = progress?.completed || false
                    const watchedPercent = progress
                      ? (progress.watchedDuration / module.duration) * 100
                      : 0

                    return (
                      <div
                        key={module.id}
                        className={`p-3 rounded-lg border ${
                          isCompleted
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-slate-100">
                                {index + 1}. {module.title}
                              </span>
                            </div>
                            {module.description && (
                              <p className="text-xs text-gray-600 mt-1">
                                {module.description}
                              </p>
                            )}
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    isCompleted ? "bg-green-500" : "bg-blue-600"
                                  }`}
                                  style={{ width: `${watchedPercent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          {isCompleted && (
                            <span className="ml-2 text-green-600">
                              <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
