"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, Reply, Archive, Trash2, MoreVertical } from "lucide-react"

interface Message {
  id: string
  content: string
  createdAt: Date
  read: boolean
  type: string
  metadata?: string | null
  senderId: string
  recipientId?: string | null
  sender: {
    name: string | null
    email: string
  }
  recipient?: {
    id: string
    name: string | null
    email: string
  } | null
}

interface MessageDetailViewProps {
  message: Message
  onBack: () => void
  onReply?: (content: string) => Promise<void>
  currentUserId: string
  isAdmin: boolean
}

export default function MessageDetailView({
  message,
  onBack,
  onReply,
  currentUserId,
  isAdmin,
}: MessageDetailViewProps) {
  const [replyContent, setReplyContent] = useState("")
  const [showReply, setShowReply] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSendReply = async () => {
    if (!replyContent.trim() || !onReply) return

    setSending(true)
    try {
      await onReply(replyContent)
      setReplyContent("")
      setShowReply(false)
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse:", error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-slate-900">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-slate-400 hover:text-slate-200 transition"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </button>

          <div className="flex items-center space-x-2">
            {onReply && !showReply && (
              <button
                onClick={() => setShowReply(true)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition"
                title="Répondre"
              >
                <Reply className="h-5 w-5" />
              </button>
            )}
            <button
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition"
              title="Archiver"
            >
              <Archive className="h-5 w-5" />
            </button>
            <button
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition"
              title="Supprimer"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition"
              title="Plus d'options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Message content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Message header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">
              {message.type === "ACCESS_GRANT" && "🎓 "}
              {message.type === "SYSTEM" && "📢 "}
              Message de {message.sender.name || message.sender.email}
            </h2>

            <div className="space-y-3">
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {message.sender.name?.charAt(0).toUpperCase() || message.sender.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-300 font-medium">{message.sender.name || "Sans nom"}</p>
                    <p className="text-slate-500 text-xs">{message.sender.email}</p>
                  </div>
                </div>
                <span>•</span>
                <span>{format(new Date(message.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</span>
              </div>

              {/* Show recipient if this is a sent message */}
              {message.recipient && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-slate-500">À :</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {message.recipient.name?.charAt(0).toUpperCase() || message.recipient.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-300 font-medium">{message.recipient.name || "Sans nom"}</p>
                      <p className="text-slate-500 text-xs">{message.recipient.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Show "Tous les apprenants" for broadcast messages */}
              {message.recipientId === null && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-slate-500">À :</span>
                  <p className="text-blue-400 font-medium">Tous les apprenants</p>
                </div>
              )}
            </div>

            {message.type === "ACCESS_GRANT" && (
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-green-900/50 text-green-400 border border-green-800">
                  ✅ Accès formation accordé
                </span>
              </div>
            )}
          </div>

          {/* Message body */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>

          {/* Reply form */}
          {showReply && onReply && (
            <div className="mt-6 bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-medium text-slate-100 mb-4">Répondre</h3>

              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Écrivez votre réponse..."
                className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />

              <div className="mt-4 flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowReply(false)
                    setReplyContent("")
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition"
                  disabled={sending}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyContent.trim() || sending}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
