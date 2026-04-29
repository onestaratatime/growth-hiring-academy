"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Inbox, Send, Mail, Users, Key } from "lucide-react"

interface Message {
  id: string
  content: string
  type: string
  metadata: string | null
  recipientId: string | null
  read: boolean
  createdAt: Date
  sender: {
    id: string
    name: string | null
    email: string
  }
}

interface MessagesInboxProps {
  receivedMessages: Message[]
  sentMessages: Message[]
  currentUserId: string
  isAdmin: boolean
}

export default function MessagesInbox({
  receivedMessages,
  sentMessages,
  currentUserId,
  isAdmin,
}: MessagesInboxProps) {
  const [activeTab, setActiveTab] = useState<"received" | "sent">(
    isAdmin ? "sent" : "received"
  )

  const displayMessages = activeTab === "received" ? receivedMessages : sentMessages
  const unreadCount = receivedMessages.filter((m) => !m.read).length

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("received")}
            className={`group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === "received"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Inbox className="h-5 w-5 mr-2" />
            Boîte de réception
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {unreadCount}
              </span>
            )}
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab("sent")}
              className={`group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "sent"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Send className="h-5 w-5 mr-2" />
              Messages envoyés
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {sentMessages.length}
              </span>
            </button>
          )}
        </nav>
      </div>

      {/* Liste des messages */}
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {displayMessages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-1">Aucun message</p>
            <p className="text-sm">
              {activeTab === "received"
                ? "Vous n'avez pas encore reçu de messages"
                : "Vous n'avez pas encore envoyé de messages"}
            </p>
          </div>
        ) : (
          displayMessages.map((message) => {
            const isBroadcast = message.recipientId === null
            const metadata = message.metadata ? JSON.parse(message.metadata) : null
            const isUnread = !message.read && activeTab === "received" && !isAdmin

            return (
              <div
                key={message.id}
                className={`p-6 hover:bg-gray-50 transition ${
                  isUnread ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">
                        {message.sender.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold text-slate-100">
                          {message.sender.name || message.sender.email}
                        </p>
                        {activeTab === "sent" && isBroadcast && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            <Users className="h-3 w-3 mr-1" />
                            Tous
                          </span>
                        )}
                        {message.type === "ACCESS_GRANT" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <Key className="h-3 w-3 mr-1" />
                            Accès formation
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activeTab === "sent" ? "Envoyé" : "Reçu"} le{" "}
                        {format(new Date(message.createdAt), "d MMMM yyyy 'à' HH:mm", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>

                  {isUnread && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                      Nouveau
                    </span>
                  )}
                </div>

                <div className="ml-13">
                  <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100">
                    {message.content}
                  </div>

                  {metadata?.courseId && message.type === "ACCESS_GRANT" && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium flex items-center">
                        <Key className="h-4 w-4 mr-2" />
                        Accès à une formation accordé
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        L'apprenant peut maintenant accéder à cette formation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer avec stats */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {activeTab === "received"
            ? `${receivedMessages.length} message${receivedMessages.length > 1 ? "s" : ""} reçu${
                receivedMessages.length > 1 ? "s" : ""
              }`
            : `${sentMessages.length} message${sentMessages.length > 1 ? "s" : ""} envoyé${
                sentMessages.length > 1 ? "s" : ""
              }`}
        </p>
      </div>
    </div>
  )
}
