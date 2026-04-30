import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Fonction pour générer une date aléatoire en 2025
function randomDate2025() {
  const start = new Date('2025-01-01')
  const end = new Date('2025-12-31')
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Fonction pour ajouter 3 mois à une date
function addMonths(date: Date, months: number) {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

async function main() {
  console.log('🔄 Mise à jour des dates d\'inscription et ajout des messages de rappel...\n')

  // Récupérer tous les apprenants avec leurs inscriptions
  const learners = await prisma.user.findMany({
    where: { role: 'LEARNER' },
    include: {
      enrollments: {
        include: {
          course: true
        }
      },
      messages: true
    }
  })

  for (const learner of learners) {
    if (learner.enrollments.length === 0) continue

    // Générer une date d'inscription aléatoire en 2025
    const enrollmentDate = randomDate2025()

    console.log(`\n📅 ${learner.name} - Nouvelle date d'inscription : ${enrollmentDate.toLocaleDateString('fr-FR')}`)

    // Mettre à jour la date d'inscription
    for (const enrollment of learner.enrollments) {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          enrolledAt: enrollmentDate,
          lastAccessedAt: enrollmentDate
        }
      })
    }

    // Mettre à jour la date de création de l'utilisateur
    await prisma.user.update({
      where: { id: learner.id },
      data: {
        createdAt: enrollmentDate
      }
    })

    // Chercher le message d'onboarding existant
    const onboardingMessage = learner.messages.find(msg =>
      msg.type === 'ACCESS_GRANT' && msg.content.includes('bienvenue')
    )

    if (onboardingMessage) {
      // Mettre à jour la date du message d'onboarding
      await prisma.message.update({
        where: { id: onboardingMessage.id },
        data: {
          createdAt: enrollmentDate
        }
      })
      console.log(`✅ Message d'onboarding mis à jour`)
    }

    // Calculer la date du rappel (+3 mois)
    const reminderDate = addMonths(enrollmentDate, 3)

    // Vérifier si un message de rappel existe déjà
    const existingReminder = learner.messages.find(msg =>
      msg.type === 'SYSTEM' && msg.content.includes('certification')
    )

    if (!existingReminder) {
      // Trouver l'admin pour envoyer le message
      const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      })

      if (admin) {
        // Créer le message de rappel
        await prisma.message.create({
          data: {
            content: `Bonjour ${learner.name?.split(' ')[0] || 'cher apprenant'} ! 👋\n\nCela fait maintenant 3 mois que vous avez rejoint Growth Hiring Academy. Nous espérons que vous progressez bien dans votre formation !\n\n🎓 Pour obtenir votre certification, n'oubliez pas de compléter 100% de votre formation.\n\nVous êtes actuellement à ${learner.enrollments[0]?.progress.toFixed(0)}% de progression. Continuez comme ça ! 💪\n\nSi vous avez des questions, n'hésitez pas à nous contacter.\n\nL'équipe Growth Hiring`,
            senderId: admin.id,
            recipientId: learner.id,
            type: 'SYSTEM',
            read: false,
            createdAt: reminderDate
          }
        })
        console.log(`✉️  Message de rappel ajouté (+3 mois : ${reminderDate.toLocaleDateString('fr-FR')})`)
      }
    } else {
      // Mettre à jour la date du rappel existant
      await prisma.message.update({
        where: { id: existingReminder.id },
        data: {
          createdAt: reminderDate
        }
      })
      console.log(`✉️  Message de rappel mis à jour (+3 mois : ${reminderDate.toLocaleDateString('fr-FR')})`)
    }
  }

  console.log('\n\n🎉 Mise à jour terminée !')
  console.log(`📊 ${learners.length} apprenants mis à jour`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
