import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

const learners = [
  { entreprise: 'Manageria', prenom: 'Cécile', nom: 'Boulaire-Assouline', email: 'cecile.boulaire-assouline@techcorp.io' },
  { entreprise: 'Manageria', prenom: 'Elena', nom: 'Bodrunova-Le Pape', email: 'elenab@innovate.fr' },
  { entreprise: 'Manageria', prenom: 'Vicky', nom: 'Tocny', email: 'vtocny@digitalgroup.com' },
  { entreprise: 'Manageria', prenom: 'Guälord', nom: 'Guilbert', email: 'g.guilbert@nextgen.tech' },
  { entreprise: 'Wake It Up', prenom: 'Daniela', nom: 'Yankova', email: 'yankova@bluesky.fr' },
  { entreprise: 'Aneo', prenom: 'Mariatou', nom: 'TRAORE', email: 'mariatou@smartsolutions.io' },
  { entreprise: 'Aneo', prenom: 'Aziz', nom: 'GBAYA', email: 'aziz.gbaya@horizon.digital' },
  { entreprise: 'KatchMe', prenom: 'Marion', nom: 'SANZ', email: 'marions@catalyst.group' },
  { entreprise: 'KatchMe', prenom: 'Léo', nom: 'GUYON', email: 'lguyon@momentum.fr' },
  { entreprise: 'KatchMe', prenom: 'Cyndie', nom: 'MANIN', email: 'c.manin@vertex.tech' },
  { entreprise: 'Ekva', prenom: 'Dilusha', nom: 'ARUKATTI', email: 'arukatti@elevate.io' },
  { entreprise: 'CTS - Consulting & Technical Support', prenom: 'Benoit', nom: 'PORTE RIVERA', email: 'benoit@synergy.digital' },
  { entreprise: 'CTS - Consulting & Technical Support', prenom: 'Alexandre', nom: 'SARTHE', email: 'alexandre.sarthe@pulse.tech' },
  { entreprise: 'Ekinox', prenom: 'Marie', nom: 'MIGNOT', email: 'mariem@nexus.fr' },
  { entreprise: 'Bamboo', prenom: 'Antoine', nom: 'BARRÉ', email: 'abarre@zenith.io' },
  { entreprise: 'CTS AIRFRAME', prenom: 'Benoit', nom: 'FRICARD', email: 'b.fricard@quantum.digital' },
  { entreprise: 'CTS AIRFRAME', prenom: 'Dina', nom: 'MRABET', email: 'mrabet@stellar.tech' },
  { entreprise: 'CTS AIRFRAME', prenom: 'Maria', nom: 'OUARSSASS', email: 'maria@alpine.fr' },
  { entreprise: 'CTS AIRSYS', prenom: 'Clément', nom: 'LACARRERE', email: 'clement.lacarrere@beacon.io' },
  { entreprise: 'CTS AIRSYS', prenom: 'Margo', nom: 'MALLARD-GIORDANO', email: 'margom@clarity.tech' },
  { entreprise: 'CONSULTING TECHNICAL & SUPPORT NORD', prenom: 'Sandra', nom: 'GUEFFIER', email: 'sgueffier@techcorp.io' },
  { entreprise: 'CONSULTING TECHNICAL & SUPPORT NORD', prenom: 'Elouan', nom: 'LE GALL', email: 'e.legall@innovate.fr' },
  { entreprise: 'CTS GLOBAL SERVICES', prenom: 'Guillaume', nom: 'BELIN', email: 'belin@digitalgroup.com' },
]

async function main() {
  console.log('🚀 Importation des apprenants...')

  // Mot de passe par défaut pour tous les apprenants
  const defaultPassword = await bcrypt.hash('growth2025', 10)

  // Créer tous les apprenants
  for (const learner of learners) {
    const existing = await prisma.user.findUnique({
      where: { email: learner.email }
    })

    if (existing) {
      console.log(`⏭️  ${learner.prenom} ${learner.nom} existe déjà`)
      continue
    }

    await prisma.user.create({
      data: {
        email: learner.email,
        name: `${learner.prenom} ${learner.nom}`,
        password: defaultPassword,
        role: 'LEARNER',
      },
    })

    console.log(`✅ ${learner.prenom} ${learner.nom} créé`)
  }

  console.log('\n🎓 Création de la formation Growth Hiring Academy 2025...')

  // Créer ou récupérer la formation
  let course = await prisma.course.findFirst({
    where: { title: 'Growth Hiring Academy 2025' }
  })

  if (!course) {
    course = await prisma.course.create({
      data: {
        title: 'Growth Hiring Academy 2025',
        description: 'Formation complète sur le sourcing et les meilleures pratiques Growth Hiring',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 3600,
        published: true,
      },
    })
    console.log('✅ Formation créée')
  } else {
    console.log('⏭️  Formation existe déjà')
  }

  // Créer les 3 modules/leçons
  const modules = [
    {
      title: 'Leçon 1 : Les fondamentaux du Growth Hiring',
      description: 'Découvrez les bases du recrutement growth et comment attirer les meilleurs talents',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 1200,
      order: 1,
    },
    {
      title: 'Leçon 2 : Stratégies de sourcing avancées',
      description: 'Maîtrisez les techniques de sourcing les plus efficaces pour dénicher vos pépites',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 1200,
      order: 2,
    },
    {
      title: 'Leçon 3 : Marketing & Sales appliqués au recrutement',
      description: 'Appliquez les meilleures pratiques marketing et sales à votre processus de recrutement',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 1200,
      order: 3,
    },
  ]

  for (const moduleData of modules) {
    const existing = await prisma.module.findFirst({
      where: {
        courseId: course.id,
        title: moduleData.title,
      }
    })

    if (!existing) {
      await prisma.module.create({
        data: {
          ...moduleData,
          courseId: course.id,
        },
      })
      console.log(`✅ ${moduleData.title} créée`)
    } else {
      console.log(`⏭️  ${moduleData.title} existe déjà`)
    }
  }

  // Récupérer tous les modules créés
  const courseModules = await prisma.module.findMany({
    where: { courseId: course.id },
  })

  console.log('\n📊 Inscription de tous les apprenants à 100%...')

  // Inscrire tous les utilisateurs LEARNER et mettre à 100%
  const allLearners = await prisma.user.findMany({
    where: { role: 'LEARNER' }
  })

  for (const learner of allLearners) {
    // Créer ou mettre à jour l'inscription
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: learner.id,
          courseId: course.id,
        },
      },
      update: {
        progress: 100,
        completedAt: new Date(),
      },
      create: {
        userId: learner.id,
        courseId: course.id,
        progress: 100,
        completedAt: new Date(),
      },
    })

    // Marquer tous les modules comme complétés
    for (const module of courseModules) {
      await prisma.moduleProgress.upsert({
        where: {
          userId_moduleId: {
            userId: learner.id,
            moduleId: module.id,
          },
        },
        update: {
          watchedDuration: module.duration,
          completed: true,
          completedAt: new Date(),
        },
        create: {
          userId: learner.id,
          moduleId: module.id,
          watchedDuration: module.duration,
          completed: true,
          completedAt: new Date(),
        },
      })
    }

    console.log(`✅ ${learner.name} inscrit à 100%`)
  }

  console.log('\n🎉 Importation terminée!')
  console.log(`📈 ${allLearners.length} apprenants inscrits à Growth Hiring Academy 2025`)
  console.log('🔑 Mot de passe pour tous les apprenants : growth2025')
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
