import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BookOpen, Users, MessageSquare, TrendingUp } from "lucide-react"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <img src="/logo-dark.svg" alt="Growth Hiring" className="h-10" />
            </div>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-100 mb-6">
            Recrutez différemment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            3 ans après la création du mouvement Growth Hiring et avec +4500 recruteurs ayant rejoint l'aventure, il était temps de faire peau neuve. Retrouvez toutes les meilleures pratiques growth, marketing & sales appliquées au recrutement sur notre nouveau site.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg"
          >
            Découvrir
          </Link>
        </div>

        <div className="mb-16 text-center">
          <p className="text-2xl font-semibold text-slate-100">
            +100 entreprises ont adopté nos méthodes pour trouver leurs pépites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            icon={<Users className="h-10 w-10 text-blue-600" />}
            title="Sourcing innovant"
            description="Découvrez les techniques de sourcing les plus efficaces du marché"
          />
          <FeatureCard
            icon={<BookOpen className="h-10 w-10 text-green-600" />}
            title="Growth Recruiting"
            description="Appliquez les méthodes growth au recrutement pour de meilleurs résultats"
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10 text-purple-600" />}
            title="Marketing RH"
            description="Attirez les meilleurs talents avec des stratégies marketing éprouvées"
          />
          <FeatureCard
            icon={<MessageSquare className="h-10 w-10 text-orange-600" />}
            title="Sales & Recrutement"
            description="Intégrez les techniques de vente dans votre processus de recrutement"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-slate-100 mb-6 text-center">
              Ce que vous allez apprendre
            </h3>
            <ul className="space-y-4 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span>Les fondamentaux du Growth Hiring pour transformer votre approche du recrutement</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span>Stratégies de sourcing avancées pour dénicher les talents cachés</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span>
                  Techniques marketing appliquées au recrutement pour attirer les meilleurs profils
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span>Méthodes sales pour convaincre et engager vos candidats</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span>Cas pratiques et retours d'expérience de +100 entreprises</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span>Outils et templates prêts à l'emploi pour recruter différemment</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-blue-600 text-white rounded-2xl p-12 shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Prêt à transformer votre recrutement ?</h3>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez +4500 recruteurs qui ont adopté nos méthodes
            </p>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
            >
              Accéder à la formation
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Growth Hiring - Plateforme de formation professionnelle
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
