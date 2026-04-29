"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteLearnerButton({ learnerId }: { learnerId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet apprenant ?")) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/learners/${learnerId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Erreur lors de la suppression")
      }
    } catch (error) {
      alert("Erreur lors de la suppression")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
