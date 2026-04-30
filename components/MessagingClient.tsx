"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MessagingLayout from "./MessagingLayout"
import MessageForm from "./MessageForm"
import MessageInboxView from "./MessageInboxView"
import MessageSentView from "./MessageSentView"
import MessageDetailView from "./MessageDetailView"
import { FileText, Archive } from "lucide-react"

interface MessagingClientProps {
  receivedMessages: any[]
  sentMessages: any[]
  users: any[]
  courses: any[]
  senderId: string
  isAdmin: boolean
}

export default function MessagingClient({
  receivedMessages,
  sentMessages,
  users,
  courses,
  senderId,
  isAdmin,
}: MessagingClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(isAdmin ? "compose" : "inbox")
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)

  const selectedMessage = selectedMessageId
    ? [...receivedMessages, ...sentMessages].find(m => m.id === selectedMessageId)
    : null

  const handleReply = async (content: string) => {
    if (!selectedMessage) return

    const response = await fetch("/api/messages/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientId: selectedMessage.senderId,
        content,
      }),
    })

    if (response.ok) {
      router.refresh()
      setSelectedMessageId(null)
      setActiveTab("inbox")
    } else {
      throw new Error("Échec de l'envoi de la réponse")
    }
  }

  const renderContent = () => {
    if (selectedMessage) {
      return (
        <MessageDetailView
          message={selectedMessage}
          onBack={() => setSelectedMessageId(null)}
          onReply={handleReply}
          currentUserId={senderId}
          isAdmin={isAdmin}
        />
      )
    }

    switch (activeTab) {
      case "compose":
        return isAdmin ? (
          <MessageForm users={users} courses={courses} senderId={senderId} />
        ) : null

      case "inbox":
        return (
          <MessageInboxView
            messages={receivedMessages}
            onMessageClick={(id) => setSelectedMessageId(id)}
          />
        )

      case "sent":
        return (
          <MessageSentView
            messages={sentMessages}
            onMessageClick={(id) => setSelectedMessageId(id)}
          />
        )

      case "drafts":
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <FileText className="h-16 w-16 mb-4 text-slate-600" />
            <p className="text-lg">Aucun brouillon</p>
            <p className="text-sm">Vous n'avez pas de messages en brouillon</p>
          </div>
        )

      case "archived":
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <Archive className="h-16 w-16 mb-4 text-slate-600" />
            <p className="text-lg">Aucune archive</p>
            <p className="text-sm">Vous n'avez pas encore archivé de messages</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <MessagingLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isAdmin={isAdmin}
      inboxCount={receivedMessages.length}
      sentCount={sentMessages.length}
      draftsCount={0}
      archivedCount={0}
    >
      {renderContent()}
    </MessagingLayout>
  )
}
