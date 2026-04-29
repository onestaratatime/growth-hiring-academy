"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

interface VideoPlayerProps {
  videoUrl: string
  enrollmentId: string
  courseId: string
  userId: string
}

export default function VideoPlayer({
  videoUrl,
  enrollmentId,
  courseId,
  userId,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const progressUpdateInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = async () => {
      if (!video.currentTime || !video.duration) return

      const watchedPercent = (video.currentTime / video.duration) * 100

      setProgress(watchedPercent)

      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            enrollmentId,
            courseId,
            watchedDuration: Math.floor(video.currentTime),
            totalDuration: Math.floor(video.duration),
          }),
        })

        if (watchedPercent >= 95) {
          router.refresh()
        }
      } catch (error) {
        console.error("Error updating progress:", error)
      }
    }

    const handleTimeUpdate = () => {
      if (progressUpdateInterval.current) {
        clearTimeout(progressUpdateInterval.current)
      }
      progressUpdateInterval.current = setTimeout(updateProgress, 2000)
    }

    const handleEnded = async () => {
      await updateProgress()
      router.refresh()
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleEnded)
      if (progressUpdateInterval.current) {
        clearTimeout(progressUpdateInterval.current)
      }
    }
  }, [enrollmentId, courseId, router])

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]
        : new URL(url).searchParams.get("v")
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes("vimeo.com")) {
      const videoId = url.split("vimeo.com/")[1]
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  const embedUrl = getEmbedUrl(videoUrl)
  const isYouTubeOrVimeo =
    videoUrl.includes("youtube.com") ||
    videoUrl.includes("youtu.be") ||
    videoUrl.includes("vimeo.com")

  return (
    <div className="relative">
      <div className="aspect-video bg-black">
        {isYouTubeOrVimeo ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            src={embedUrl}
          >
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        )}
      </div>

      {!isYouTubeOrVimeo && progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white text-sm font-medium">
              {progress.toFixed(0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
