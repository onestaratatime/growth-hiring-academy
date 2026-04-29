import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Mise à jour de l\'admin et des dates des messages...\n')

  // Mettre à jour l'email de l'admin
  const admin = await prisma.user.update({
    where: { email: 'admin@growthhiring.com' },
    data: { email: 'admin@growth-hiring.com' }
  })

  console.log(`✅ Email admin mis à jour: ${admin.email}`)

  // Récupérer tous les messages
  const messages = await prisma.message.findMany({
    where: { senderId: admin.id },
    orderBy: { createdAt: 'asc' }
  })

  console.log(`\n📅 Mise à jour des dates de ${messages.length} messages...`)

  // Dates en 2025 - commencer le 15 janvier 2025
  const startDate = new Date('2025-01-15T09:00:00.000Z')

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]

    // Échelonner les messages sur plusieurs jours avec des heures variées
    const daysOffset = Math.floor(i / 3) // 3 messages par jour
    const hoursOffset = (i % 3) * 4 + 9 // 9h, 13h, 17h

    const messageDate = new Date(startDate)
    messageDate.setDate(messageDate.getDate() + daysOffset)
    messageDate.setHours(hoursOffset, Math.floor(Math.random() * 60), 0, 0)

    await prisma.message.update({
      where: { id: message.id },
      data: { createdAt: messageDate }
    })

    console.log(`   ✓ Message ${i + 1}: ${messageDate.toLocaleDateString('fr-FR')} à ${messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`)
  }

  console.log('\n🎉 Mise à jour terminée!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
