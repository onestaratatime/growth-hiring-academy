# Growth Hiring - Plateforme de Formation Professionnelle

Une plateforme complète de gestion de formations en ligne avec CRM d'apprenants, suivi de progression, et système de messagerie intégré.

## 🎯 Fonctionnalités

### Pour les administrateurs
- **CRM Apprenants** : Gestion complète des apprenants avec tableau de bord
- **Gestion des formations** : Upload et organisation de formations vidéo (YouTube, Vimeo, ou fichiers directs)
- **Système de messagerie** : Communication avec les apprenants et distribution d'accès aux formations
- **Suivi détaillé** : Visualisation de la progression de chaque apprenant en temps réel

### Pour les apprenants
- **Mes formations** : Accès à toutes les formations assignées
- **Suivi de progression** : Barre de progression à 100% pour chaque formation
- **Messagerie** : Réception des messages et accès aux formations
- **Interface intuitive** : Navigation simple et design professionnel

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

1. Les dépendances sont déjà installées dans le projet

2. La base de données est déjà initialisée avec SQLite

3. Des comptes ont été créés :
   - **Admin** : admin@growth-hiring.com / admin123
   - **23 apprenants** importés avec le mot de passe : growth2025
   - **Formation Growth Hiring Academy 2025** avec 3 leçons créée
   - **Tous les apprenants à 100%** de complétion
   - **23 messages d'onboarding** envoyés en janvier 2025

### Lancement

```bash
npm run dev
```

Accédez à la plateforme sur [http://localhost:3000](http://localhost:3000)

## 📚 Structure du projet

```
growth-hiring/
├── app/
│   ├── api/              # Routes API
│   │   ├── auth/         # Authentification NextAuth
│   │   ├── courses/      # Gestion des formations
│   │   ├── learners/     # Gestion des apprenants
│   │   ├── messages/     # Système de messagerie
│   │   └── progress/     # Suivi de progression
│   ├── dashboard/        # Interface dashboard
│   │   ├── courses/      # Gestion formations (admin)
│   │   ├── learners/     # CRM apprenants (admin)
│   │   ├── messages/     # Messagerie
│   │   └── my-courses/   # Formations apprenants
│   ├── login/           # Page de connexion
│   └── page.tsx         # Page d'accueil
├── components/          # Composants réutilisables
├── lib/                # Utilitaires et configuration
├── prisma/             # Schéma et migrations de base de données
└── types/              # Définitions TypeScript
```

## 🔐 Authentification

Le système utilise NextAuth.js avec authentification par credentials :
- Rôles : ADMIN et LEARNER
- Sessions JWT
- Routes protégées par middleware

## 💾 Base de données

### Schéma Prisma

Modèles principaux :
- **User** : Utilisateurs (admin/apprenants)
- **Course** : Formations
- **Module** : Modules de formation
- **Enrollment** : Inscriptions avec progression
- **ModuleProgress** : Progression par module
- **Message** : Messages et notifications

## 🎨 Design

- **Framework CSS** : Tailwind CSS 4
- **Composants** : Lucide React pour les icônes
- **Responsive** : Design adaptatif pour mobile, tablette et desktop
- **Thème** : Interface moderne avec palette bleue professionnelle

## 📊 Fonctionnalités détaillées

### CRM Apprenants
- Création et gestion d'apprenants
- Vue d'ensemble avec statistiques
- Progression moyenne par apprenant
- Historique des inscriptions

### Gestion des formations
- Upload de vidéos (URL YouTube/Vimeo ou direct)
- Organisation par modules
- Publication/dépublication
- Aperçu et modification

### Suivi de progression
- Barre de progression à 100% en temps réel
- Tracking automatique du visionnage
- Statistiques de complétion
- Historique d'accès

### Système de messagerie
- Messages directs ou broadcast
- Attribution d'accès aux formations via message
- Notifications de nouveaux messages
- Historique complet

## 🛠️ Technologies

- **Framework** : Next.js 16 (App Router)
- **Base de données** : SQLite avec Prisma ORM
- **Authentification** : NextAuth.js
- **Styling** : Tailwind CSS 4
- **TypeScript** : Pour la sécurité des types
- **React Server Components** : Pour les performances

## 📝 Utilisation

### En tant qu'administrateur

1. Connectez-vous avec le compte admin
2. Créez des apprenants via "CRM Apprenants"
3. Ajoutez des formations via "Formations"
4. Publiez les formations
5. Envoyez des messages avec accès via "Messages"

### En tant qu'apprenant

1. Connectez-vous avec vos identifiants
2. Consultez vos messages pour les nouveaux accès
3. Accédez à "Mes Formations"
4. Regardez les vidéos (progression trackée automatiquement)
5. Suivez votre progression sur le dashboard

## 🔒 Sécurité

- Authentification sécurisée avec mots de passe hashés (bcrypt)
- Routes API protégées par vérification de session
- Validation des rôles (admin/apprenant)
- Protection CSRF avec NextAuth
- Variables d'environnement pour les secrets

## 📦 Scripts disponibles

```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Build de production
npm run start        # Démarre le serveur de production
npm run lint         # Linting du code
npm run seed         # Seed la base de données avec l'admin
```

## 🎓 Guide de démarrage

1. **Première connexion** : Utilisez admin@growthhiring.com / admin123
2. **Créer un apprenant** : Dashboard > CRM Apprenants > Ajouter un apprenant
3. **Créer une formation** : Dashboard > Formations > Nouvelle formation
4. **Publier la formation** : Cliquez sur l'icône œil
5. **Donner accès** : Messages > Sélectionner apprenant > Type "Accès à une formation"

## 🌟 Points forts

- ✅ Interface professionnelle et intuitive
- ✅ Suivi de progression en temps réel à 100%
- ✅ CRM complet pour gérer les apprenants
- ✅ Système de messagerie intégré
- ✅ Support vidéo multi-sources (YouTube, Vimeo, direct)
- ✅ Design responsive pour tous les appareils
- ✅ Architecture scalable avec Next.js

## 🔄 Mises à jour futures possibles

- Upload direct de fichiers vidéo
- Système de quiz et évaluations
- Certificats de completion
- Statistiques avancées et analytics
- Export de rapports
- Intégration calendrier
- Notifications push
- Forum de discussion

---

**Growth Hiring** - Votre partenaire formation professionnelle 🎓
