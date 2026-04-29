#!/bin/bash

# Script pour configurer la base de données de production

echo "🗄️  Configuration de la base de données PostgreSQL..."
echo ""

# Vérifier que DATABASE_URL est défini
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Erreur: DATABASE_URL n'est pas défini"
    echo ""
    echo "💡 Utilisez cette commande d'abord:"
    echo "   export DATABASE_URL=\"postgresql://user:password@host.neon.tech/db?sslmode=require\""
    echo ""
    exit 1
fi

echo "✅ DATABASE_URL détecté"
echo ""

# Étape 1: Générer le client Prisma
echo "📦 Génération du client Prisma pour PostgreSQL..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la génération du client Prisma"
    exit 1
fi
echo "✅ Client Prisma généré"
echo ""

# Étape 2: Créer la migration initiale
echo "🔧 Création de la migration initiale..."
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
    echo "⚠️  La migration a échoué. Tentative avec migrate deploy..."
    npx prisma migrate deploy
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de la migration"
        exit 1
    fi
fi
echo "✅ Tables créées avec succès"
echo ""

# Étape 3: Peupler la base de données
echo "🌱 Peuplement de la base de données..."
echo "   - Création du compte admin"
echo "   - Import des 23 apprenants"
echo "   - Création de la formation Growth Hiring Academy 2025"
echo "   - Envoi des messages d'onboarding"
echo ""
npm run seed
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du seed"
    exit 1
fi
echo ""
echo "✅ Base de données peuplée avec succès!"
echo ""

# Étape 4: Vérification
echo "🔍 Vérification de la base de données..."
echo ""
echo "Voulez-vous ouvrir Prisma Studio pour vérifier les données? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    npx prisma studio
fi

echo ""
echo "🎉 Configuration terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Aller sur votre URL Vercel"
echo "   2. Se connecter avec admin@growth-hiring.com / admin123"
echo "   3. Vérifier que tout fonctionne"
echo ""
