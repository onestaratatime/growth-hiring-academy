"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Mail, Users, Key } from "lucide-react"

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

interface MessageListProps {
  messages: Message[]
  currentUserId: string
  isAdmin: boolean
}

export default function MessageList({
  messages,
  currentUserId,
  isAdmin,
}: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Aucun message pour le moment</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {messages.map((message) => {
        const isBroadcast = message.recipientId === null
        const metadata = message.metadata ? JSON.parse(message.metadata) : null

        return (
          <div
            key={message.id}
            className={`p-6 hover:bg-gray-50 transition ${
              !message.read && !isAdmin ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {(message.sender.name || message.sender.email).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {message.sender.name || message.sender.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(message.createdAt), "d MMM yyyy à HH:mm", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {isBroadcast && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Users className="h-3 w-3 mr-1" />
                    Tous
                  </span>
                )}
                {message.type === "ACCESS_GRANT" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Key className="h-3 w-3 mr-1" />
                    Accès
                  </span>
                )}
                {!message.read && !isAdmin && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                    Nouveau
                  </span>
                )}
              </div>
            </div>

            <div className="ml-12">
              <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>

              {metadata?.courseId && message.type === "ACCESS_GRANT" && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ Accès à une formation accordé
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Consultez l'onglet "Mes Formations" pour commencer
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
