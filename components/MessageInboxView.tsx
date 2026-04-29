"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Mail, Star, Paperclip, Circle } from "lucide-react"

interface Message {
  id: string
  content: string
  createdAt: Date
  read: boolean
  type: string
  metadata?: string | null
  sender: {
    name: string | null
    email: string
  }
}

interface MessageInboxViewProps {
  messages: Message[]
  onMessageClick?: (messageId: string) => void
}

export default function MessageInboxView({
  messages,
  onMessageClick,
}: MessageInboxViewProps) {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">
            Boîte de réception
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
            <Mail className="h-16 w-16 mb-4 text-slate-600" />
            <p className="text-lg">Aucun message</p>
            <p className="text-sm">Votre boîte de réception est vide</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => onMessageClick?.(message.id)}
                className={`px-6 py-4 cursor-pointer transition ${
                  message.read
                    ? "bg-slate-900 hover:bg-slate-800"
                    : "bg-slate-800 hover:bg-slate-750"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 pt-1">
                    {!message.read && (
                      <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium truncate ${
                        message.read ? "text-slate-300" : "text-slate-100"
                      }`}>
                        {message.sender.name || message.sender.email}
                      </p>
                      <p className="text-xs text-slate-500 ml-2 flex-shrink-0">
                        {format(new Date(message.createdAt), "d MMM", { locale: fr })}
                      </p>
                    </div>

                    <p className={`text-sm line-clamp-2 ${
                      message.read ? "text-slate-500" : "text-slate-400"
                    }`}>
                      {message.content}
                    </p>

                    {message.type === "ACCESS_GRANT" && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-900/50 text-green-400 border border-green-800">
                          Accès formation accordé
                        </span>
                      </div>
                    )}

                    {message.metadata && (
                      <div className="mt-2 flex items-center text-xs text-slate-500">
                        <Paperclip className="h-3 w-3 mr-1" />
                        Pièce jointe
                      </div>
                    )}
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
