import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@growth-hiring.com' },
    update: {},
    create: {
      email: 'admin@growth-hiring.com',
      name: 'Growth Hiring',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Admin créé:', admin.email)
  console.log('Mot de passe: admin123')
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
