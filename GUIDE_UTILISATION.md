# Guide d'utilisation - Growth Hiring

## Démarrage rapide

### 1. Lancer la plateforme

```bash
cd growth-hiring
npm run dev
```

Ouvrez votre navigateur sur [http://localhost:3000](http://localhost:3000)

### 2. Première connexion (Admin)

**Identifiants par défaut :**
- Email : `admin@growthhiring.com`
- Mot de passe : `admin123`

## Scénario complet d'utilisation

### Étape 1 : Créer un apprenant

1. Connectez-vous en tant qu'admin
2. Allez dans **CRM Apprenants**
3. Cliquez sur **Ajouter un apprenant**
4. Remplissez le formulaire :
   - Nom : Jean Dupont
   - Email : jean.dupont@example.com
   - Mot de passe : password123
5. Cliquez sur **Créer l'apprenant**

### Étape 2 : Créer une formation

1. Allez dans **Formations**
2. Cliquez sur **Nouvelle formation**
3. Remplissez le formulaire :
   - Titre : Introduction au Marketing Digital
   - Description : Apprenez les bases du marketing digital
   - URL de la vidéo : `https://www.youtube.com/watch?v=dQw4w9WgXcQ` (exemple)
   - Durée : 3600 (1 heure en secondes)
4. Cliquez sur **Créer la formation**

### Étape 3 : Publier la formation

1. Dans la liste des formations
2. Cliquez sur l'icône **œil** (EyeOff → Eye)
3. La formation passe en statut "Publié"

### Étape 4 : Donner accès à un apprenant

1. Allez dans **Messages**
2. Remplissez le formulaire :
   - Type : **Accès à une formation**
   - Destinataire : Jean Dupont
   - Formation : Introduction au Marketing Digital
   - Message : "Bonjour Jean, vous avez maintenant accès à cette formation !"
3. Cliquez sur **Envoyer le message**

### Étape 5 : Test en tant qu'apprenant

1. Déconnectez-vous
2. Connectez-vous avec :
   - Email : `jean.dupont@example.com`
   - Mot de passe : `password123`
3. Consultez **Messages** pour voir le message d'accès
4. Allez dans **Mes Formations**
5. Cliquez sur la formation
6. Regardez la vidéo (la progression sera trackée automatiquement)

## Fonctionnalités détaillées

### Pour les administrateurs

#### Tableau de bord
- Vue d'ensemble avec statistiques
- Nombre d'apprenants
- Nombre de formations
- Progression moyenne

#### CRM Apprenants
- **Liste des apprenants** : Vue complète avec progression
- **Créer un apprenant** : Bouton en haut à droite
- **Voir les détails** : Cliquez sur "Voir détails"
- **Supprimer** : Icône poubelle (confirmation demandée)

#### Gestion des formations
- **Créer une formation** : Bouton "Nouvelle formation"
- **Publier/Dépublier** : Icône œil
- **Modifier** : Bouton "Modifier"
- **Supprimer** : Icône poubelle

#### Messagerie
- **Message simple** : Type "Message texte"
- **Donner accès** : Type "Accès à une formation"
- **Broadcast** : Cochez "Envoyer à tous les apprenants"

### Pour les apprenants

#### Tableau de bord
- Nombre de formations inscrites
- Messages non lus
- Progression moyenne

#### Mes Formations
- Liste des formations accessibles
- Barre de progression pour chaque formation
- Statut "Terminé" à 100%

#### Lecture d'une formation
- Lecteur vidéo intégré
- Barre de progression en temps réel
- Liste des modules (si disponibles)
- Progression trackée automatiquement

#### Messages
- Consultation des messages
- Notifications de nouveaux accès
- Messages de l'administration

## Astuces et conseils

### Pour les vidéos

**Formats supportés :**
- YouTube : `https://www.youtube.com/watch?v=VIDEO_ID`
- Vimeo : `https://vimeo.com/VIDEO_ID`
- Vidéo directe : URL complète vers le fichier vidéo

**Suivi de progression :**
- YouTube/Vimeo : Pas de tracking automatique (limitation API)
- Vidéo directe : Tracking complet en temps réel

### Gestion des accès

**Méthodes d'attribution :**
1. **Message individuel** : Sélectionnez un apprenant spécifique
2. **Broadcast** : Cochez "Envoyer à tous" pour donner l'accès à tous

**Vérification :**
- L'apprenant reçoit un message avec badge "Accès"
- La formation apparaît dans "Mes Formations"
- La progression commence à 0%

### Suivi de progression

**Calcul de la progression :**
- Basé sur le temps de visionnage
- Mise à jour toutes les 2 secondes
- Considéré comme "Terminé" à 95%+

**Visualisation :**
- Barre bleue : En cours
- Barre verte : Terminé (100%)
- Pourcentage affiché en temps réel

## Dépannage

### Problème : L'apprenant ne voit pas sa formation

**Solutions :**
1. Vérifier que la formation est **publiée** (icône œil vert)
2. Vérifier qu'un **message d'accès** a été envoyé
3. L'apprenant doit se **déconnecter/reconnecter**

### Problème : La progression ne se met pas à jour

**Solutions :**
1. Vérifier que c'est une **vidéo directe** (pas YouTube/Vimeo)
2. Vérifier que la durée est correctement renseignée
3. Rafraîchir la page

### Problème : Impossible de se connecter

**Solutions :**
1. Vérifier l'email et le mot de passe
2. Mot de passe minimum 6 caractères
3. Compte admin par défaut : `admin@growthhiring.com` / `admin123`

## Raccourcis utiles

### Navigation rapide (Admin)
- Dashboard : `/dashboard`
- CRM : `/dashboard/learners`
- Formations : `/dashboard/courses`
- Messages : `/dashboard/messages`

### Navigation rapide (Apprenant)
- Dashboard : `/dashboard`
- Mes Formations : `/dashboard/my-courses`
- Messages : `/dashboard/messages`

## Bonnes pratiques

### Pour les formations
1. ✅ Utilisez des titres descriptifs
2. ✅ Rédigez des descriptions complètes
3. ✅ Ajoutez des miniatures personnalisées
4. ✅ Indiquez la durée correctement
5. ✅ Testez la vidéo avant publication

### Pour la communication
1. ✅ Envoyez un message avec chaque accès
2. ✅ Expliquez le contenu de la formation
3. ✅ Donnez des instructions claires
4. ✅ Utilisez le broadcast pour les annonces générales

### Pour le suivi
1. ✅ Consultez régulièrement le CRM
2. ✅ Vérifiez la progression moyenne
3. ✅ Relancez les apprenants en retard
4. ✅ Célébrez les formations complétées

## Support

Pour toute question ou problème :
1. Consultez ce guide
2. Vérifiez le README.md principal
3. Consultez les logs dans la console du navigateur

---

**Bonne formation avec Growth Hiring !** 🎓
