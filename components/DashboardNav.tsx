"use client"

import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  LogOut,
  GraduationCap
} from "lucide-react"

interface DashboardNavProps {
  user: {
    name?: string | null
    email?: string
    role?: string
  }
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()
  const isAdmin = user.role === "ADMIN"

  const navItems = [
    {
      name: "Tableau de bord",
      href: "/dashboard",
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      name: "CRM Apprenants",
      href: "/dashboard/learners",
      icon: Users,
      adminOnly: true,
    },
    {
      name: "Formations",
      href: "/dashboard/courses",
      icon: BookOpen,
      adminOnly: true,
    },
    {
      name: "Mes Formations",
      href: "/dashboard/my-courses",
      icon: GraduationCap,
      adminOnly: false,
    },
    {
      name: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
      adminOnly: false,
    },
  ]

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  )

  return (
    <nav className="bg-slate-800 shadow-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <img src="/logo-dark.svg" alt="Growth Hiring" className="h-10" />
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition ${
                      isActive
                        ? "border-blue-500 text-slate-100"
                        : "border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-300"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-300">
              <span className="font-medium">{user.name || user.email}</span>
              {isAdmin && (
                <span className="ml-2 px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 transition"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden border-t border-slate-700">
        <div className="pt-2 pb-3 space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? "border-blue-500 text-blue-400 bg-slate-700"
                    : "border-transparent text-slate-400 hover:bg-slate-700 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
