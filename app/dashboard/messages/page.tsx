import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { Send, Mail, MessageSquare } from "lucide-react"
import MessageForm from "@/components/MessageForm"
import MessageList from "@/components/MessageList"

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "ADMIN"

  let messages
  let users: any[] = []

  if (isAdmin) {
    messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session?.user?.id },
          { recipientId: null },
        ],
      },
      include: {
        sender: true,
      },
      orderBy: { createdAt: "desc" },
    })

    users = await prisma.user.findMany({
      where: { role: "LEARNER" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
  } else {
    messages = await prisma.message.findMany({
      where: {
        OR: [
          { recipientId: session?.user?.id },
          { senderId: session?.user?.id },
          { recipientId: null },
        ],
      },
      include: {
        sender: true,
      },
      orderBy: { createdAt: "desc" },
    })

    await prisma.message.updateMany({
      where: {
        recipientId: session?.user?.id,
        read: false,
      },
      data: { read: true },
    })
  }

  const courses = await prisma.course.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
    },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="mt-2 text-gray-600">
          {isAdmin
            ? "Envoyez des messages et gérez les accès aux formations"
            : "Consultez vos messages et accès aux formations"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isAdmin && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Send className="h-5 w-5 mr-2 text-blue-600" />
                Envoyer un message
              </h2>
              <MessageForm
                users={users}
                courses={courses}
                senderId={session?.user?.id || ""}
              />
            </div>
          </div>
        )}

        <div className={isAdmin ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                {isAdmin ? "Messages envoyés" : "Vos messages"}
              </h2>
            </div>

            <MessageList
              messages={messages}
              currentUserId={session?.user?.id || ""}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
