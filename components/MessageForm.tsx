"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send } from "lucide-react"

interface MessageFormProps {
  users: Array<{ id: string; name: string | null; email: string }>
  courses: Array<{ id: string; title: string }>
  senderId: string
}

export default function MessageForm({ users, courses, senderId }: MessageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [messageType, setMessageType] = useState<"TEXT" | "ACCESS_GRANT">("TEXT")
  const [formData, setFormData] = useState({
    recipientId: "",
    content: "",
    courseId: "",
    broadcast: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const metadata = messageType === "ACCESS_GRANT" && formData.courseId
        ? JSON.stringify({ courseId: formData.courseId })
        : null

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId,
          recipientId: formData.broadcast ? null : formData.recipientId || null,
          content: formData.content,
          type: messageType,
          metadata,
        }),
      })

      if (res.ok) {
        setFormData({
          recipientId: "",
          content: "",
          courseId: "",
          broadcast: false,
        })
        router.refresh()
      } else {
        alert("Erreur lors de l'envoi du message")
      }
    } catch (error) {
      alert("Erreur lors de l'envoi du message")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Send className="h-5 w-5 mr-2 text-blue-600" />
        Nouveau message
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de message
          </label>
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value as "TEXT" | "ACCESS_GRANT")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="TEXT">Message texte</option>
            <option value="ACCESS_GRANT">Accès à une formation</option>
          </select>
        </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.broadcast}
            onChange={(e) =>
              setFormData({ ...formData, broadcast: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Envoyer à tous les apprenants
          </span>
        </label>
      </div>

      {!formData.broadcast && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destinataire
          </label>
          <select
            value={formData.recipientId}
            onChange={(e) =>
              setFormData({ ...formData, recipientId: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={!formData.broadcast}
          >
            <option value="">Sélectionner un apprenant</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>
      )}

      {messageType === "ACCESS_GRANT" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formation à attribuer
          </label>
          <select
            value={formData.courseId}
            onChange={(e) =>
              setFormData({ ...formData, courseId: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={messageType === "ACCESS_GRANT"}
          >
            <option value="">Sélectionner une formation</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={
            messageType === "ACCESS_GRANT"
              ? "Vous avez maintenant accès à cette formation..."
              : "Votre message..."
          }
          required
        />
      </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Envoi..." : "Envoyer le message"}
        </button>
      </form>
    </div>
  )
}
