# Guide de déploiement - Growth Hiring Academy

## 🚀 Déploiement sur Vercel (Recommandé)

Vercel est la meilleure option pour déployer cette application Next.js.

### Étape 1: Préparer le compte Vercel

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Connectez votre compte GitHub

### Étape 2: Créer une base de données PostgreSQL

**Option A - Vercel Postgres (Gratuit):**

1. Dans le dashboard Vercel, allez dans "Storage"
2. Cliquez sur "Create Database"
3. Sélectionnez "Postgres"
4. Choisissez le plan gratuit "Hobby"
5. Notez l'URL de connexion fournie

**Option B - Neon (Gratuit):**

1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez un nouveau projet
3. Copiez l'URL de connexion PostgreSQL

### Étape 3: Mettre à jour le schema Prisma

Modifiez `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changé de "sqlite" à "postgresql"
  url      = env("DATABASE_URL")
}
```

### Étape 4: Déployer sur Vercel

**Via l'interface Vercel:**

1. Allez sur [vercel.com/new](https://vercel.com/new)
2. Importez votre repository GitHub `growth-hiring-academy`
3. Configurez les variables d'environnement:
   - `DATABASE_URL` = URL de votre base PostgreSQL
   - `NEXTAUTH_SECRET` = Générez une clé secrète (ou utilisez: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = URL de votre site (sera fournie par Vercel)
4. Cliquez sur "Deploy"

**Via la ligne de commande:**

```bash
# Connectez-vous à Vercel
npx vercel login

# Déployez
npx vercel

# Pour déployer en production
npx vercel --prod
```

### Étape 5: Initialiser la base de données

Une fois déployé, vous devez initialiser la base de données:

```bash
# Définir l'URL de la base de données
export DATABASE_URL="votre_url_postgresql"

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate deploy

# Créer l'admin
npm run seed

# Importer les apprenants
npx tsx scripts/import-learners.ts

# Créer les messages d'onboarding
npx tsx scripts/update-emails-and-messages.ts

# Randomiser les dates
npx tsx scripts/randomize-message-dates.ts
```

Ou exécutez directement dans Vercel:

1. Allez dans votre projet Vercel
2. Onglet "Settings" > "Functions"
3. Ajoutez ces commandes dans le build

## 🔧 Configuration des variables d'environnement

Dans Vercel, ajoutez ces variables:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://votre-site.vercel.app"
NEXTAUTH_SECRET="votre-secret-genere"
```

## 📊 Migration de SQLite vers PostgreSQL

Si vous voulez migrer les données existantes:

### 1. Exporter les données de SQLite

```bash
# Installer pgloader (sur Mac)
brew install pgloader

# Ou utiliser un script custom
npx tsx scripts/export-to-postgres.ts
```

### 2. Importer dans PostgreSQL

```bash
# Avec pgloader
pgloader sqlite://dev.db postgresql://user:password@host:5432/database

# Ou manuellement via les scripts
npx tsx scripts/import-learners.ts
npx tsx scripts/update-emails-and-messages.ts
npx tsx scripts/randomize-message-dates.ts
```

## 🌐 Alternative: Déploiement sur Railway

Railway est une autre excellente option:

1. Créez un compte sur [railway.app](https://railway.app)
2. Créez un nouveau projet à partir de GitHub
3. Ajoutez une base de données PostgreSQL
4. Configurez les variables d'environnement
5. Déployez automatiquement

## 🔒 Sécurité en production

**Important:**

1. ✅ Changez `NEXTAUTH_SECRET` pour une valeur unique
2. ✅ Utilisez PostgreSQL en production (pas SQLite)
3. ✅ Activez HTTPS (automatique sur Vercel)
4. ✅ Limitez les connexions à la base de données
5. ✅ Mettez à jour les CORS si nécessaire

## 📝 Post-déploiement

Après le déploiement:

1. Testez la connexion admin: `admin@growth-hiring.com` / `admin123`
2. Vérifiez que les 23 apprenants sont présents
3. Confirmez que la formation "Growth Hiring Academy 2025" existe
4. Testez la messagerie et les messages d'onboarding

## 🆘 Dépannage

### Erreur de migration Prisma

```bash
# Réinitialiser les migrations
npx prisma migrate reset

# Puis relancer
npx prisma migrate deploy
```

### Erreur de connexion PostgreSQL

Vérifiez:
- L'URL de connexion est correcte
- Les whitelist IPs sont configurées
- Le certificat SSL est valide

### Build échoue

```bash
# Nettoyer et rebuilder
rm -rf .next node_modules
npm install
npm run build
```

## 🎉 Félicitations!

Votre plateforme Growth Hiring Academy est maintenant en ligne!

Partagez l'URL avec vos apprenants et commencez à former! 🎓
