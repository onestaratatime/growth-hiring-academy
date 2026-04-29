"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Send, Users, User } from "lucide-react"

interface Message {
  id: string
  content: string
  createdAt: Date
  recipientId: string | null
  type: string
  metadata?: string | null
}

interface MessageSentViewProps {
  messages: Message[]
}

export default function MessageSentView({ messages }: MessageSentViewProps) {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">
            Messages envoyés
            <span className="ml-2 text-sm font-normal text-slate-400">
              ({messages.length} {messages.length > 1 ? "messages" : "message"})
            </span>
          </h3>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Send className="h-16 w-16 mb-4 text-slate-600" />
            <p className="text-lg">Aucun message envoyé</p>
            <p className="text-sm">Vous n'avez pas encore envoyé de messages</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {messages.map((message) => (
              <div
                key={message.id}
                className="px-6 py-4 bg-slate-900 hover:bg-slate-800 cursor-pointer transition"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {message.recipientId === null ? (
                          <>
                            <Users className="h-4 w-4 text-blue-400" />
                            <p className="text-sm font-medium text-slate-100">
                              Tous les apprenants
                            </p>
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4 text-slate-400" />
                            <p className="text-sm font-medium text-slate-300">
                              Destinataire individuel
                            </p>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 ml-2 flex-shrink-0">
                        {format(new Date(message.createdAt), "d MMM yyyy", { locale: fr })}
                      </p>
                    </div>

                    <p className="text-sm text-slate-400 line-clamp-2">
                      {message.content}
                    </p>

                    <div className="mt-2 flex items-center space-x-2">
                      {message.recipientId === null && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-900/50 text-blue-400 border border-blue-800">
                          Broadcast
                        </span>
                      )}
                      {message.type === "ACCESS_GRANT" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-900/50 text-green-400 border border-green-800">
                          Accès accordé
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
