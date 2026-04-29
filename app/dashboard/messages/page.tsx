import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import MessageForm from "@/components/MessageForm"
import MessagesInbox from "@/components/MessagesInbox"

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "ADMIN"

  let receivedMessages = []
  let sentMessages = []
  let users: any[] = []
  let courses: any[] = []

  if (isAdmin) {
    // Messages reçus par l'admin (s'il y en a)
    receivedMessages = await prisma.message.findMany({
      where: {
        recipientId: session?.user?.id,
      },
      include: {
        sender: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Messages envoyés par l'admin
    sentMessages = await prisma.message.findMany({
      where: {
        senderId: session?.user?.id,
      },
      include: {
        sender: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    users = await prisma.user.findMany({
      where: { role: "LEARNER" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    courses = await prisma.course.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
      },
    })
  } else {
    // Messages reçus par l'apprenant
    receivedMessages = await prisma.message.findMany({
      where: {
        OR: [
          { recipientId: session?.user?.id },
          { recipientId: null }, // Messages broadcast
        ],
      },
      include: {
        sender: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Marquer les messages non lus comme lus
    await prisma.message.updateMany({
      where: {
        recipientId: session?.user?.id,
        read: false,
      },
      data: { read: true },
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messagerie</h1>
        <p className="mt-2 text-gray-600">
          {isAdmin
            ? "Gérez vos messages et communiquez avec les apprenants"
            : "Consultez vos messages et notifications"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isAdmin && (
          <div className="lg:col-span-1">
            <MessageForm
              users={users}
              courses={courses}
              senderId={session?.user?.id || ""}
            />
          </div>
        )}

        <div className={isAdmin ? "lg:col-span-2" : "lg:col-span-3"}>
          <MessagesInbox
            receivedMessages={receivedMessages}
            sentMessages={sentMessages}
            currentUserId={session?.user?.id || ""}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  )
}
