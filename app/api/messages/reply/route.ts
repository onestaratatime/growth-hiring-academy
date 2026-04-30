import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { recipientId, content } = body

    if (!recipientId || !content) {
      return NextResponse.json(
        { error: "Destinataire et contenu requis" },
        { status: 400 }
      )
    }

    // Créer le message de réponse
    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        recipientId,
        type: "TEXT",
        read: false,
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Erreur lors de l'envoi de la réponse:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la réponse" },
      { status: 500 }
    )
  }
}
