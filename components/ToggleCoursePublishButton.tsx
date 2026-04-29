"use client"

import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ToggleCoursePublishButton({
  courseId,
  published,
}: {
  courseId: string
  published: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/courses/${courseId}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Erreur lors de la mise à jour")
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-md transition disabled:opacity-50 ${
        published
          ? "text-green-600 hover:bg-green-50"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      title={published ? "Dépublier" : "Publier"}
    >
      {published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    </button>
  )
}
