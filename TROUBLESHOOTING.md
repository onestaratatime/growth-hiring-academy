# 🔧 Troubleshooting - Connexion impossible

## Problème : "Email ou mot de passe incorrect"

Cela signifie que Vercel ne se connecte pas à votre base de données Neon.

## ✅ Checklist de vérification

### 1. Variables d'environnement Vercel

Allez sur **Vercel Dashboard → Votre projet → Settings → Environment Variables**

Vous DEVEZ avoir ces 3 variables :

#### DATABASE_URL
```
postgresql://neondb_owner:npg_tLV1szanFf3S@ep-long-sunset-an712g2e-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require
```
✅ Cocher : Production, Preview, Development

#### NEXTAUTH_SECRET
```
FFcQWk8Ce7MK5ej3VOdIJQ31y0oLa4EZS6cAUsDIzO0=
```
✅ Cocher : Production, Preview, Development

#### NEXTAUTH_URL
```
https://votre-projet.vercel.app
```
(Remplacez par votre vraie URL Vercel)
✅ Cocher : Production, Preview, Development

---

### 2. Vérifier que Vercel a redéployé

Après avoir ajouté les variables :

1. Allez dans **Deployments**
2. Vérifiez que le dernier déploiement est **Ready** (pas Building)
3. Si pas de nouveau déploiement depuis l'ajout des variables :
   - Cliquez sur les 3 points (...)
   - Cliquez **Redeploy**
   - Attendez que Status = Ready

---

### 3. Vérifier les logs Vercel

Si ça ne marche toujours pas :

1. Allez dans **Deployments**
2. Cliquez sur le déploiement actuel
3. Allez dans **Functions**
4. Cherchez des erreurs liées à Prisma ou Database

Erreurs courantes :
- `PrismaClient is unable to run` → DATABASE_URL manquante
- `Can't reach database` → DATABASE_URL incorrecte
- `P1001` → Problème de connexion réseau

---

### 4. Tester la connexion à Neon

Vérifiez que votre base Neon est accessible :

```bash
# Dans votre terminal local
DATABASE_URL="postgresql://neondb_owner:npg_tLV1szanFf3S@ep-long-sunset-an712g2e-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require" npx prisma studio
```

Si Prisma Studio s'ouvre et vous voyez vos 24 utilisateurs → la base fonctionne ✅

---

### 5. Vérifier que les données sont bien dans Neon

```bash
DATABASE_URL="postgresql://neondb_owner:npg_tLV1szanFf3S@ep-long-sunset-an712g2e-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require" node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.findUnique({where: {email: 'admin@growth-hiring.com'}}).then(user => console.log('Admin trouvé:', user ? 'OUI ✅' : 'NON ❌')).finally(() => prisma.\$disconnect())"
```

Résultat attendu : `Admin trouvé: OUI ✅`

---

### 6. Si l'admin n'existe pas dans Neon

Re-seed la base :

```bash
export DATABASE_URL="postgresql://neondb_owner:npg_tLV1szanFf3S@ep-long-sunset-an712g2e-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"
npm run seed
npx tsx scripts/import-learners.ts
```

---

## 🎯 Solution rapide

**La cause la plus fréquente :**

Vercel n'a pas la variable `DATABASE_URL` configurée.

**Solution en 3 étapes :**

1. **Settings → Environment Variables**
2. **Ajouter DATABASE_URL** avec la connection string Neon
3. **Redeploy** le projet

---

## 📞 Besoin d'aide ?

Si après tout ça ça ne marche toujours pas, vérifiez :

1. Que vous utilisez le bon email : `admin@growth-hiring.com` (PAS admin@growthhiring.com)
2. Que vous utilisez le bon mot de passe : `admin123`
3. Que vous testez sur l'URL de production Vercel (pas localhost)

---

## ✅ Une fois que ça marche

Vous devriez voir :
- 23 apprenants dans le CRM
- 1 formation publiée
- Tous les textes visibles (dark mode)
- Interface messagerie professionnelle
