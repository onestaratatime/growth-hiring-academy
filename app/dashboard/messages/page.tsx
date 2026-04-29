import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import MessagingClient from "@/components/MessagingClient"

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "ADMIN"

  let receivedMessages: any[] = []
  let sentMessages: any[] = []
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
    <MessagingClient
      receivedMessages={receivedMessages}
      sentMessages={sentMessages}
      users={users}
      courses={courses}
      senderId={session?.user?.id || ""}
      isAdmin={isAdmin}
    />
  )
}
