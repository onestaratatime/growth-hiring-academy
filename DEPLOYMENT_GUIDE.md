# Guide de déploiement sur Vercel

## Pourquoi Vercel au lieu de Netlify ?

❌ **Netlify ne supporte pas:**
- SQLite (fichiers non persistants en serverless)
- Next.js Server Components complet
- API routes complexes avec Prisma

✅ **Vercel supporte:**
- Next.js nativement (créé par la même équipe)
- Prisma avec PostgreSQL
- NextAuth.js optimisé
- Déploiements automatiques depuis GitHub

## Étapes de déploiement

### 1. Créer une base de données PostgreSQL gratuite sur Neon

1. Aller sur https://neon.tech
2. Se connecter avec GitHub
3. Créer un nouveau projet "growth-hiring"
4. Copier la "Connection String" qui ressemble à :
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Mettre à jour le schema Prisma pour PostgreSQL

Déjà fait ! Le fichier `prisma/schema.prisma` est configuré pour PostgreSQL.

### 3. Déployer sur Vercel

#### Via le dashboard Vercel (recommandé - plus simple)

1. Aller sur https://vercel.com
2. Se connecter avec GitHub
3. Cliquer sur "Add New" → "Project"
4. Importer le repository `growth-hiring-academy`
5. Configurer les variables d'environnement :

```
DATABASE_URL=postgresql://votre-connection-string-neon
NEXTAUTH_SECRET=votre-secret-genere
NEXTAUTH_URL=https://votre-app.vercel.app
```

Pour générer NEXTAUTH_SECRET :
```bash
openssl rand -base64 32
```

6. Cliquer sur "Deploy"

#### Via CLI (alternatif)

```bash
# Se connecter à Vercel
npx vercel login

# Déployer
npx vercel

# Suivre les instructions et ajouter les variables d'environnement
```

### 4. Migrer la base de données

Une fois la DATABASE_URL configurée :

```bash
# Pointer vers la base de production
export DATABASE_URL="postgresql://votre-connection-string-neon"

# Créer les tables
npx prisma migrate deploy

# Seed les données (admin + 23 apprenants)
npm run seed
```

### 5. Vérification

1. Aller sur votre URL Vercel (ex: https://growth-hiring-academy.vercel.app)
2. Se connecter avec : admin@growth-hiring.com / admin123
3. Vérifier que les 23 apprenants sont présents

## Troubleshooting

### Erreur "PrismaClient is unable to run in this browser environment"
- Assurez-vous que DATABASE_URL est bien configuré dans Vercel
- Redéployer après avoir ajouté les variables

### Erreur de connexion à la base
- Vérifier que la connection string Neon est correcte
- S'assurer que `?sslmode=require` est à la fin de l'URL

### Build qui échoue
- Vérifier les logs dans Vercel Dashboard
- S'assurer que toutes les dépendances sont installées

## Variables d'environnement complètes

```env
# Database
DATABASE_URL="postgresql://user:password@host.neon.tech/db?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="votre-secret-aleatoire-32-caracteres"
NEXTAUTH_URL="https://votre-app.vercel.app"
```

## Support

Si vous rencontrez des problèmes :
- Vérifier les logs Vercel
- Documentation Vercel : https://vercel.com/docs
- Documentation Neon : https://neon.tech/docs
