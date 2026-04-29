"use client"

import { useState } from "react"
import {
  Mail,
  Send,
  Inbox,
  FileText,
  Archive,
  Plus,
  Search,
  Star
} from "lucide-react"

interface MessagingLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
  isAdmin: boolean
  inboxCount?: number
  sentCount?: number
  draftsCount?: number
  archivedCount?: number
}

export default function MessagingLayout({
  children,
  activeTab,
  onTabChange,
  isAdmin,
  inboxCount = 0,
  sentCount = 0,
  draftsCount = 0,
  archivedCount = 0,
}: MessagingLayoutProps) {
  const tabs = [
    {
      id: "compose",
      name: "Nouveau message",
      icon: Plus,
      color: "text-blue-400",
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-slate-700",
      adminOnly: true,
      count: 0,
    },
    {
      id: "inbox",
      name: "Boîte de réception",
      icon: Inbox,
      color: "text-slate-400",
      bgColor: "",
      hoverColor: "hover:bg-slate-700",
      adminOnly: false,
      count: inboxCount,
    },
    {
      id: "sent",
      name: "Messages envoyés",
      icon: Send,
      color: "text-slate-400",
      bgColor: "",
      hoverColor: "hover:bg-slate-700",
      adminOnly: true,
      count: sentCount,
    },
    {
      id: "drafts",
      name: "Brouillons",
      icon: FileText,
      color: "text-slate-400",
      bgColor: "",
      hoverColor: "hover:bg-slate-700",
      adminOnly: true,
      count: draftsCount,
    },
    {
      id: "archived",
      name: "Archives",
      icon: Archive,
      color: "text-slate-400",
      bgColor: "",
      hoverColor: "hover:bg-slate-700",
      adminOnly: false,
      count: archivedCount,
    },
  ]

  const filteredTabs = tabs.filter(tab => !tab.adminOnly || isAdmin)

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-400" />
            Messagerie
          </h2>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {filteredTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : `text-slate-300 ${tab.hoverColor}`
                } ${tab.id === "compose" ? "mb-4 bg-blue-600 hover:bg-blue-700 text-white font-medium" : ""}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${isActive || tab.id === "compose" ? "text-white" : tab.color}`} />
                  <span className="text-sm font-medium">{tab.name}</span>
                </div>
                {tab.count > 0 && tab.id !== "compose" && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    isActive
                      ? "bg-white text-blue-600"
                      : "bg-slate-700 text-slate-300"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-500">
            <div className="flex justify-between mb-1">
              <span>Stockage utilisé</span>
              <span>2.4 MB / 15 GB</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "16%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-slate-900">
        {children}
      </div>
    </div>
  )
}
