import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Users, BookOpen, MessageSquare, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "ADMIN"

  let stats = {
    totalLearners: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    averageProgress: 0,
  }

  if (isAdmin) {
    const [totalLearners, totalCourses, totalEnrollments, enrollments] = await Promise.all([
      prisma.user.count({ where: { role: "LEARNER" } }),
      prisma.course.count({ where: { published: true } }),
      prisma.enrollment.count(),
      prisma.enrollment.findMany({ select: { progress: true } }),
    ])

    const averageProgress = enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
      : 0

    stats = {
      totalLearners,
      totalCourses,
      totalEnrollments,
      averageProgress,
    }
  } else {
    const [enrollments, unreadMessages] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: session?.user?.id },
        include: { course: true },
      }),
      prisma.message.count({
        where: {
          recipientId: session?.user?.id,
          read: false,
        },
      }),
    ])

    stats = {
      totalLearners: 0,
      totalCourses: enrollments.length,
      totalEnrollments: unreadMessages,
      averageProgress: enrollments.length > 0
        ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
        : 0,
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isAdmin ? "Tableau de bord administrateur" : "Mon tableau de bord"}
        </h1>
        <p className="mt-2 text-gray-600">
          {isAdmin
            ? "Vue d'ensemble de votre plateforme de formation"
            : "Suivez votre progression et accédez à vos formations"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isAdmin ? (
          <>
            <StatCard
              title="Apprenants"
              value={stats.totalLearners}
              icon={Users}
              color="bg-blue-500"
            />
            <StatCard
              title="Formations publiées"
              value={stats.totalCourses}
              icon={BookOpen}
              color="bg-green-500"
            />
            <StatCard
              title="Inscriptions totales"
              value={stats.totalEnrollments}
              icon={TrendingUp}
              color="bg-purple-500"
            />
            <StatCard
              title="Progression moyenne"
              value={`${stats.averageProgress.toFixed(0)}%`}
              icon={TrendingUp}
              color="bg-orange-500"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Mes formations"
              value={stats.totalCourses}
              icon={BookOpen}
              color="bg-blue-500"
            />
            <StatCard
              title="Messages non lus"
              value={stats.totalEnrollments}
              icon={MessageSquare}
              color="bg-green-500"
            />
            <StatCard
              title="Progression moyenne"
              value={`${stats.averageProgress.toFixed(0)}%`}
              icon={TrendingUp}
              color="bg-purple-500"
            />
          </>
        )}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Bienvenue sur Growth Hiring
        </h2>
        <p className="text-gray-600">
          {isAdmin
            ? "Utilisez le menu de navigation pour gérer vos apprenants, créer des formations et communiquer avec vos utilisateurs."
            : "Accédez à vos formations via le menu 'Mes Formations' et consultez vos messages pour recevoir vos accès."}
        </p>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: number | string
  icon: any
  color: string
}) {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
