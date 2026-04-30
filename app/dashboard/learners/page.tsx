import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { UserPlus, Mail, Trash2 } from "lucide-react"
import DeleteLearnerButton from "@/components/DeleteLearnerButton"

export default async function LearnersPage() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const learners = await prisma.user.findMany({
    where: { role: "LEARNER" },
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">CRM Apprenants</h1>
          <p className="mt-2 text-slate-400">
            Gérez vos apprenants et suivez leur progression
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/learners/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Ajouter un apprenant
          </Link>
        </div>
      </div>

      <div className="bg-slate-800 shadow-sm rounded-lg overflow-hidden border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Apprenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Formations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Progression moyenne
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Inscrit le
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {learners.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  Aucun apprenant pour le moment.
                  <Link
                    href="/dashboard/learners/new"
                    className="block mt-2 text-blue-400 hover:text-blue-300"
                  >
                    Créer votre premier apprenant
                  </Link>
                </td>
              </tr>
            ) : (
              learners.map((learner) => {
                const avgProgress =
                  learner.enrollments.length > 0
                    ? learner.enrollments.reduce((sum, e) => sum + e.progress, 0) /
                      learner.enrollments.length
                    : 0

                return (
                  <tr key={learner.id} className="hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {learner.name?.charAt(0).toUpperCase() || learner.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-100">
                            {learner.name || "Sans nom"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{learner.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {learner._count.enrollments} formation(s)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-slate-700 rounded-full h-2 mr-2" style={{ width: "100px" }}>
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${avgProgress}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-200 font-medium">{avgProgress.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {format(new Date(learner.createdAt), "d MMM yyyy", { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/dashboard/learners/${learner.id}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Voir détails
                        </Link>
                        <DeleteLearnerButton learnerId={learner.id} />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
