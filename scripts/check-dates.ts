import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const learner = await prisma.user.findFirst({
    where: { email: { contains: 'cecile' } },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      enrollments: true
    }
  })

  console.log('📅 Date d\'inscription:', learner?.createdAt.toLocaleDateString('fr-FR'))
  console.log('\n📧 Messages:')
  learner?.messages.forEach(msg => {
    const dateStr = msg.createdAt.toLocaleDateString('fr-FR')
    const preview = msg.content.substring(0, 50)
    console.log(`  - ${dateStr}: ${msg.type} - ${preview}...`)
  })

  await prisma.$disconnect()
}

check()
