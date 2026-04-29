import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function getRandomDate(start: Date, end: Date): Date {
  const startTime = start.getTime()
  const endTime = end.getTime()
  const randomTime = startTime + Math.random() * (endTime - startTime)

  const date = new Date(randomTime)

  // Heures de bureau: entre 9h et 18h
  const hour = 9 + Math.floor(Math.random() * 9)
  const minute = Math.floor(Math.random() * 60)

  date.setHours(hour, minute, 0, 0)

  return date
}

async function main() {
  console.log('🔄 Répartition aléatoire des messages dans l\'année 2025...\n')

  const admin = await prisma.user.findFirst({
    where: { email: 'admin@growth-hiring.com' }
  })

  if (!admin) {
    console.error('❌ Admin non trouvé')
    return
  }

  const messages = await prisma.message.findMany({
    where: { senderId: admin.id },
    orderBy: { createdAt: 'asc' }
  })

  console.log(`📅 Mise à jour de ${messages.length} messages...\n`)

  // Dates de début et fin pour 2025
  const startDate = new Date('2025-01-01T00:00:00.000Z')
  const endDate = new Date('2025-12-31T23:59:59.999Z')

  // Créer un tableau de dates aléatoires et les trier
  const randomDates = []
  for (let i = 0; i < messages.length; i++) {
    randomDates.push(getRandomDate(startDate, endDate))
  }
  randomDates.sort((a, b) => a.getTime() - b.getTime())

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    const newDate = randomDates[i]

    await prisma.message.update({
      where: { id: message.id },
      data: { createdAt: newDate }
    })

    console.log(`✓ Message ${i + 1}: ${newDate.toLocaleDateString('fr-FR')} à ${newDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`)
  }

  console.log('\n🎉 Répartition terminée!')
  console.log(`📊 Messages répartis du ${randomDates[0].toLocaleDateString('fr-FR')} au ${randomDates[randomDates.length - 1].toLocaleDateString('fr-FR')}`)
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
