# ✅ Configuration Vercel - Étape par étape

## Statut : Vous êtes sur Vercel ✅

## 📝 Étape 1: Créer la base de données PostgreSQL (Neon.tech)

### Option A: Neon.tech (Recommandé - Gratuit, Simple)

1. Aller sur **https://neon.tech**
2. Cliquer "Sign up" et se connecter avec GitHub
3. Créer un nouveau projet :
   - Project name: `growth-hiring`
   - Region: `US East (Ohio)` (ou le plus proche de vous)
4. Une fois créé, cliquer sur "Connection string"
5. **Copier la connection string complète** (ressemble à) :
   ```
   postgresql://username:password@ep-xxx-yyy.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

⚠️ **GARDEZ CETTE URL PRÉCIEUSEMENT** - Vous en aurez besoin pour Vercel !

### Option B: Vercel Postgres (Plus simple mais payant après 256MB)

Si vous préférez tout garder sur Vercel :
1. Dans votre projet Vercel, aller dans "Storage"
2. Cliquer "Create Database" → "Postgres"
3. Suivre les instructions
4. Vercel ajoutera automatiquement les variables d'environnement

## 🔧 Étape 2: Configurer les variables d'environnement sur Vercel

1. Aller sur **https://vercel.com/dashboard**
2. Cliquer sur votre projet `growth-hiring-academy`
3. Aller dans **Settings** → **Environment Variables**
4. Ajouter ces 3 variables :

### Variable 1: DATABASE_URL
```
DATABASE_URL
```
**Value** (coller votre connection string Neon) :
```
postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require
```

### Variable 2: NEXTAUTH_SECRET
```
NEXTAUTH_SECRET
```
**Value** (généré pour vous) :
```
FFcQWk8Ce7MK5ej3VOdIJQ31y0oLa4EZS6cAUsDIzO0=
```

### Variable 3: NEXTAUTH_URL
```
NEXTAUTH_URL
```
**Value** (votre URL Vercel) :
```
https://votre-projet.vercel.app
```
(Remplacez par votre vraie URL Vercel - vous pouvez la trouver dans l'onglet "Deployments")

5. **Important** : Pour chaque variable, sélectionner les 3 environnements :
   - ✅ Production
   - ✅ Preview
   - ✅ Development

6. Cliquer **Save** pour chaque variable

## 🚀 Étape 3: Redéployer

1. Aller dans **Deployments**
2. Cliquer sur les trois points (...) du dernier déploiement
3. Cliquer **Redeploy**

Ou plus simple : Git push déclenchera automatiquement un redéploiement maintenant que les variables sont configurées.

## 🗄️ Étape 4: Migrer et peupler la base de données

Une fois le déploiement réussi, dans votre terminal local :

```bash
# 1. Configurer la DATABASE_URL localement (temporaire)
export DATABASE_URL="postgresql://votre-connection-string-neon"

# 2. Générer le client Prisma pour PostgreSQL
npx prisma generate

# 3. Créer toutes les tables
npx prisma migrate dev --name init

# 4. Peupler avec les données (admin + 23 apprenants + cours)
npm run seed
```

## ✅ Étape 5: Vérifier que tout fonctionne

1. Aller sur votre URL Vercel : **https://votre-projet.vercel.app**
2. Se connecter avec :
   - Email: `admin@growth-hiring.com`
   - Mot de passe: `admin123`
3. Vérifier :
   - ✅ Connexion réussie
   - ✅ 23 apprenants dans le CRM
   - ✅ Formation "Growth Hiring Academy 2025" présente
   - ✅ Messages d'onboarding visibles
   - ✅ Dark mode actif partout

## 🔍 Troubleshooting

### Erreur "PrismaClient is unable to run in this browser environment"
- ✅ Vérifier que `DATABASE_URL` est bien configuré dans Vercel
- ✅ Redéployer le projet

### Erreur de connexion à la base
- ✅ Vérifier que la connection string est correcte
- ✅ S'assurer que `?sslmode=require` est à la fin
- ✅ Tester la connexion depuis votre terminal avec `npx prisma studio`

### Build qui échoue
- ✅ Vérifier les logs dans Vercel Dashboard → Deployments
- ✅ S'assurer que toutes les variables d'environnement sont définies

### Page blanche ou erreur 500
- ✅ Vérifier que la migration a été exécutée (`npx prisma migrate deploy`)
- ✅ Vérifier les logs Vercel Functions

## 📊 Récapitulatif

Voici vos credentials :

**NEXTAUTH_SECRET** (à copier dans Vercel) :
```
FFcQWk8Ce7MK5ej3VOdIJQ31y0oLa4EZS6cAUsDIzO0=
```

**Compte admin** (pour se connecter) :
- Email: `admin@growth-hiring.com`
- Password: `admin123`

## 🎉 Prochaines étapes

Une fois tout fonctionnel :
1. ✅ Changer le mot de passe admin
2. ✅ Personnaliser les formations
3. ✅ Inviter vos apprenants
4. ✅ Profiter de votre plateforme !

---

**Besoin d'aide ?**
- Documentation Vercel : https://vercel.com/docs
- Documentation Neon : https://neon.tech/docs
- Documentation Prisma : https://www.prisma.io/docs
