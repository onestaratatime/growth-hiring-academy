# Déploiement sur Vercel (RECOMMANDÉ)

## Pourquoi Vercel au lieu de Netlify ?

Vercel est la plateforme créée par l'équipe Next.js et supporte nativement:
- Server-side rendering (SSR)
- API routes dynamiques
- NextAuth.js
- Prisma avec base de données externe

## Étapes de déploiement

### 1. Créer un compte Vercel
- Aller sur https://vercel.com
- Se connecter avec GitHub

### 2. Configurer une base de données PostgreSQL

**Option A: Vercel Postgres (le plus simple)**
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Créer le projet
vercel

# Ajouter Vercel Postgres
vercel postgres create
```

**Option B: Supabase (gratuit, recommandé)**
1. Créer un compte sur https://supabase.com
2. Créer un nouveau projet
3. Copier la "Connection string" (DATABASE_URL)

**Option C: Neon.tech (gratuit)**
1. Créer un compte sur https://neon.tech
2. Créer un nouveau projet PostgreSQL
3. Copier la connection string

### 3. Mettre à jour Prisma pour PostgreSQL

```bash
# Dans votre terminal local
# Mettre à jour le schema.prisma (déjà fait ci-dessous)
npm run migrate:deploy
```

### 4. Déployer sur Vercel

```bash
# Via CLI
vercel --prod

# OU via le dashboard Vercel:
# 1. Import project from GitHub
# 2. Sélectionner growth-hiring-academy
# 3. Ajouter les variables d'environnement
```

### 5. Variables d'environnement sur Vercel

Dans Settings > Environment Variables:

```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=votre-secret-genere
NEXTAUTH_URL=https://votre-app.vercel.app
```

Générer NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 6. Migration de la base de données

```bash
# Localement, pointer vers la base PostgreSQL de production
DATABASE_URL="votre-postgres-url" npx prisma migrate deploy
DATABASE_URL="votre-postgres-url" npm run seed
```

## Avantages Vercel vs Netlify pour ce projet

✅ Support natif Next.js SSR
✅ API routes dynamiques
✅ NextAuth.js optimisé
✅ Edge functions incluses
✅ Déploiement automatique depuis GitHub
✅ Preview deployments pour chaque PR

## Support

Si vous rencontrez des problèmes:
1. Vérifier les logs: `vercel logs`
2. Documentation: https://vercel.com/docs
