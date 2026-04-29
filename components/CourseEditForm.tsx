"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Video } from "lucide-react"

interface Module {
  id: string
  title: string
  description: string | null
  videoUrl: string
  duration: number
  order: number
}

interface Course {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnail: string | null
  duration: number
  modules: Module[]
}

export default function CourseEditForm({ course }: { course: Course }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    videoUrl: course.videoUrl,
    thumbnail: course.thumbnail || "",
    duration: course.duration.toString(),
  })

  const [modules, setModules] = useState(course.modules)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        setError("Erreur lors de la mise à jour")
        return
      }

      router.push("/dashboard/courses")
      router.refresh()
    } catch (error) {
      setError("Une erreur s'est produite")
    } finally {
      setLoading(false)
    }
  }

  const handleModuleUpdate = async (moduleId: string, field: string, value: string) => {
    try {
      const res = await fetch(`/api/modules/${moduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      })

      if (res.ok) {
        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId ? { ...m, [field]: value } : m
          )
        )
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating module:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Informations générales
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la formation
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de la vidéo principale
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image miniature (URL)
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée (en secondes)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Mise à jour..." : "Mettre à jour la formation"}
          </button>
        </form>
      </div>

      {modules.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Video className="h-5 w-5 mr-2 text-blue-600" />
            Modules de formation ({modules.length})
          </h2>
          <div className="space-y-6">
            {modules.map((module, index) => (
              <div
                key={module.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
                    Leçon {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {module.title}
                  </h3>
                  {module.description && (
                    <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de la vidéo
                    </label>
                    <input
                      type="url"
                      value={module.videoUrl}
                      onChange={(e) =>
                        handleModuleUpdate(module.id, "videoUrl", e.target.value)
                      }
                      onBlur={(e) =>
                        handleModuleUpdate(module.id, "videoUrl", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Changez l'URL et le champ se sauvegarde automatiquement
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre de la leçon
                      </label>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) =>
                          handleModuleUpdate(module.id, "title", e.target.value)
                        }
                        onBlur={(e) =>
                          handleModuleUpdate(module.id, "title", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durée (secondes)
                      </label>
                      <input
                        type="number"
                        value={module.duration}
                        onChange={(e) =>
                          handleModuleUpdate(module.id, "duration", e.target.value)
                        }
                        onBlur={(e) =>
                          handleModuleUpdate(module.id, "duration", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={module.description || ""}
                      onChange={(e) =>
                        handleModuleUpdate(module.id, "description", e.target.value)
                      }
                      onBlur={(e) =>
                        handleModuleUpdate(module.id, "description", e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description de la leçon..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
