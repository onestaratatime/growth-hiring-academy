import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Noms d'entreprises fictives variées
const companies = [
  'techcorp.io', 'innovate.fr', 'digitalgroup.com', 'nextgen.tech',
  'bluesky.fr', 'smartsolutions.io', 'horizon.digital', 'catalyst.group',
  'momentum.fr', 'vertex.tech', 'elevate.io', 'synergy.digital',
  'pulse.tech', 'nexus.fr', 'zenith.io', 'quantum.digital',
  'stellar.tech', 'alpine.fr', 'beacon.io', 'clarity.tech'
]

// Fonction pour générer un email professionnel aléatoire
function generateEmail(prenom: string, nom: string, index: number): string {
  const company = companies[index % companies.length]
  const formats = [
    `${prenom.toLowerCase()}.${nom.toLowerCase()}@${company}`,
    `${prenom.toLowerCase()}${nom.charAt(0).toLowerCase()}@${company}`,
    `${prenom.charAt(0).toLowerCase()}${nom.toLowerCase()}@${company}`,
    `${prenom.charAt(0).toLowerCase()}.${nom.toLowerCase()}@${company}`,
    `${nom.toLowerCase()}@${company}`,
    `${prenom.toLowerCase()}@${company}`,
  ]

  // Sélectionner un format aléatoire basé sur l'index
  const formatIndex = (index * 7) % formats.length
  return formats[formatIndex]
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/\s+/g, '')
}

const learners = [
  { id: '', prenom: 'Cécile', nom: 'Boulaire-Assouline', entreprise: 'Manageria' },
  { id: '', prenom: 'Elena', nom: 'Bodrunova-Le Pape', entreprise: 'Manageria' },
  { id: '', prenom: 'Vicky', nom: 'Tocny', entreprise: 'Manageria' },
  { id: '', prenom: 'Guälord', nom: 'Guilbert', entreprise: 'Manageria' },
  { id: '', prenom: 'Daniela', nom: 'Yankova', entreprise: 'Wake It Up' },
  { id: '', prenom: 'Mariatou', nom: 'Traore', entreprise: 'Aneo' },
  { id: '', prenom: 'Aziz', nom: 'Gbaya', entreprise: 'Aneo' },
  { id: '', prenom: 'Marion', nom: 'Sanz', entreprise: 'KatchMe' },
  { id: '', prenom: 'Léo', nom: 'Guyon', entreprise: 'KatchMe' },
  { id: '', prenom: 'Cyndie', nom: 'Manin', entreprise: 'KatchMe' },
  { id: '', prenom: 'Dilusha', nom: 'Arukatti', entreprise: 'Ekva' },
  { id: '', prenom: 'Benoit', nom: 'Porte Rivera', entreprise: 'CTS' },
  { id: '', prenom: 'Alexandre', nom: 'Sarthe', entreprise: 'CTS' },
  { id: '', prenom: 'Marie', nom: 'Mignot', entreprise: 'Ekinox' },
  { id: '', prenom: 'Antoine', nom: 'Barré', entreprise: 'Bamboo' },
  { id: '', prenom: 'Benoit', nom: 'Fricard', entreprise: 'CTS AIRFRAME' },
  { id: '', prenom: 'Dina', nom: 'Mrabet', entreprise: 'CTS AIRFRAME' },
  { id: '', prenom: 'Maria', nom: 'Ouarssass', entreprise: 'CTS AIRFRAME' },
  { id: '', prenom: 'Clément', nom: 'Lacarrere', entreprise: 'CTS AIRSYS' },
  { id: '', prenom: 'Margo', nom: 'Mallard-Giordano', entreprise: 'CTS AIRSYS' },
  { id: '', prenom: 'Sandra', nom: 'Gueffier', entreprise: 'CTS NORD' },
  { id: '', prenom: 'Elouan', nom: 'Le Gall', entreprise: 'CTS NORD' },
  { id: '', prenom: 'Guillaume', nom: 'Belin', entreprise: 'CTS GLOBAL' },
]

const onboardingMessages = [
  {
    template: (prenom: string, entreprise: string) => `Bonjour ${prenom},

Bienvenue dans la Growth Hiring Academy 2025 ! 🎉

Nous sommes ravis de vous accueillir parmi les +4500 recruteurs qui ont déjà rejoint le mouvement Growth Hiring.

Votre formation "Growth Hiring Academy 2025" est maintenant accessible. Elle comprend 3 modules essentiels pour transformer votre approche du recrutement :

✓ Module 1 : Les fondamentaux du Growth Hiring
✓ Module 2 : Stratégies de sourcing avancées
✓ Module 3 : Marketing & Sales appliqués au recrutement

🎯 Prochaines étapes :
1. Connectez-vous à votre espace formation
2. Commencez par le Module 1
3. Appliquez les techniques directement dans vos recrutements chez ${entreprise}

N'hésitez pas à nous contacter si vous avez la moindre question.

Bon apprentissage !

L'équipe Growth Hiring`
  },
  {
    template: (prenom: string, entreprise: string) => `Hello ${prenom} 👋

C'est le grand jour ! Votre accès à la Growth Hiring Academy 2025 est activé.

📚 Ce qui vous attend :
• Des stratégies de sourcing qui ont fait leurs preuves auprès de +100 entreprises
• Des techniques marketing & sales appliquées au recrutement
• Des cas pratiques concrets et immédiatement applicables chez ${entreprise}

💡 Un conseil pour démarrer :
Prenez le temps de suivre les modules dans l'ordre. Chaque leçon construit sur la précédente pour vous donner une vision complète du Growth Recruiting.

Votre progression sera suivie automatiquement, vous pourrez reprendre où vous en étiez à tout moment.

Prêt(e) à recruter différemment ?

À très vite dans la formation !
Growth Hiring Team`
  },
  {
    template: (prenom: string, entreprise: string) => `Bonjour ${prenom},

Félicitations ! Vous faites maintenant partie de la communauté Growth Hiring 🚀

Votre formation est prête et n'attend plus que vous. En tant que professionnel(le) du recrutement chez ${entreprise}, vous allez découvrir comment :

→ Sourcer des talents que vos concurrents ne trouvent pas
→ Appliquer les méthodes growth au recrutement
→ Utiliser le marketing pour attirer les meilleurs profils
→ Closer vos candidats comme un pro de la vente

La formation est structurée en 3 modules progressifs que vous pouvez suivre à votre rythme.

📍 Pour commencer :
Rendez-vous dans "Mes Formations" et lancez le Module 1.

Nous sommes impatients de voir vos résultats !

Excellente formation,
L'équipe Growth Hiring`
  }
]

async function main() {
  console.log('🔄 Mise à jour des emails et création des messages...\n')

  // Récupérer l'admin
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@growthhiring.com' }
  })

  if (!admin) {
    console.error('❌ Admin non trouvé')
    return
  }

  // Récupérer tous les apprenants
  const allLearners = await prisma.user.findMany({
    where: { role: 'LEARNER' },
    orderBy: { createdAt: 'asc' }
  })

  for (let i = 0; i < allLearners.length && i < learners.length; i++) {
    const learner = allLearners[i]
    const learnerData = learners[i]

    // Générer un email professionnel
    const newEmail = generateEmail(learnerData.prenom, learnerData.nom, i)

    // Mettre à jour l'email
    await prisma.user.update({
      where: { id: learner.id },
      data: { email: newEmail }
    })

    console.log(`✅ ${learnerData.prenom} ${learnerData.nom}: ${newEmail}`)

    // Sélectionner un template de message aléatoire
    const messageTemplate = onboardingMessages[i % onboardingMessages.length]
    const messageContent = messageTemplate.template(learnerData.prenom, learnerData.entreprise)

    // Créer le message d'onboarding
    await prisma.message.create({
      data: {
        senderId: admin.id,
        recipientId: learner.id,
        content: messageContent,
        type: 'TEXT',
        read: true,
        createdAt: new Date(Date.now() - (23 - i) * 24 * 60 * 60 * 1000) // Échelonner sur 23 jours
      }
    })

    console.log(`   📧 Message d'onboarding envoyé`)
  }

  console.log('\n🎉 Mise à jour terminée!')
  console.log(`📧 ${allLearners.length} emails mis à jour`)
  console.log(`💬 ${allLearners.length} messages d'onboarding créés`)
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
