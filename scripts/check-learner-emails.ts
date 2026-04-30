import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const learners = await prisma.user.findMany({
    where: { role: 'LEARNER' },
    select: {
      id: true,
      name: true,
      email: true
    }
  })

  console.log('📧 Emails actuels des apprenants:\n')
  learners.forEach(learner => {
    console.log(`${learner.name}: ${learner.email}`)
  })
  console.log(`\nTotal: ${learners.length} apprenants`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
