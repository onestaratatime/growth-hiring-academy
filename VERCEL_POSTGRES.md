# 🚀 Option Alternative : Utiliser Vercel Postgres

## Si Neon ne fonctionne pas, utilisez Vercel Postgres

### Avantages :
- ✅ Intégration automatique (pas besoin d'ajouter DATABASE_URL manuellement)
- ✅ Pas de problème avec les caractères spéciaux
- ✅ Configuration en 2 clics
- ✅ Gratuit jusqu'à 256 MB (largement suffisant pour cette app)

---

## 📋 Étapes (5 minutes)

### 1. Créer la base de données Vercel

1. Allez sur votre projet Vercel
2. Cliquez sur **Storage** (dans le menu de gauche)
3. Cliquez **Create Database**
4. Sélectionnez **Postgres**
5. Donnez un nom : `growth-hiring-db`
6. Cliquez **Create**

⏳ Attendez 30 secondes que la base soit créée

### 2. Connecter au projet

1. Vercel va vous demander de **connecter** la base au projet
2. Sélectionnez votre projet `growth-hiring-academy`
3. Cochez **Production**, **Preview**, **Development**
4. Cliquez **Connect**

✅ Vercel ajoutera automatiquement toutes les variables d'environnement :
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← C'est celle qu'on va utiliser
- `POSTGRES_URL_NON_POOLING`
- etc.

### 3. Utiliser POSTGRES_PRISMA_URL

Dans votre projet, ajoutez une variable qui pointe vers Vercel Postgres :

**Option A : Renommer (recommandé)**

Dans Vercel Settings → Environment Variables :
1. Trouvez `POSTGRES_PRISMA_URL`
2. Cliquez sur les 3 points (...)
3. **Edit**
4. Changez le nom en `DATABASE_URL`
5. Save

**Option B : Créer un alias**

Ajoutez une nouvelle variable :
- Key: `DATABASE_URL`
- Value: `${POSTGRES_PRISMA_URL}` (copier la valeur de POSTGRES_PRISMA_URL)

### 4. Redéployer

1. **Deployments** → Cliquez sur les 3 points (...) du dernier déploiement
2. **Redeploy**
3. Attendez 1-2 minutes

### 5. Migrer les données

Une fois le déploiement terminé, il faut peupler la base Vercel.

**Option A : Via l'interface Vercel (le plus simple)**

Dans Storage → Votre base Postgres → **Query** :

```sql
-- Pas besoin, Vercel a déjà exécuté les migrations
```

**Option B : Via votre terminal**

Vous devrez récupérer la POSTGRES_PRISMA_URL de Vercel et l'utiliser :

1. Allez dans Settings → Environment Variables
2. Copiez la valeur de `POSTGRES_PRISMA_URL`
3. Dans votre terminal :

```bash
export DATABASE_URL="la-valeur-de-POSTGRES_PRISMA_URL"
npm run seed
npx tsx scripts/import-learners.ts
```

---

## ✅ Vérification

Une fois fait :

1. Allez sur `https://votre-projet.vercel.app/api/debug`
2. Vous devriez voir :
```json
{
  "status": "connected",
  "database": "configured",
  "userCount": 24,
  "admin": "found"
}
```

3. Connectez-vous avec `admin@growth-hiring.com` / `admin123`

---

## 💰 Coût

**Gratuit** jusqu'à :
- 256 MB de stockage
- 60 heures de compute par mois

Pour votre application avec 24 utilisateurs, c'est **largement suffisant** !

---

## 🔄 Migration depuis Neon

Si vous voulez garder Neon à la place, on peut :
1. Exporter les données de Neon
2. Les importer dans Vercel Postgres

Mais honnêtement, **re-seeder** est plus rapide (2 minutes).
