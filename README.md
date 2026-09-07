# Plateforme de tracking logistique

## État du projet
_Dernière mise à jour : 2026-09-07_

### ✅ Architecture & Backend
- API Express + TypeScript + Prisma + PostgreSQL, structure complète (auth, contrôleurs, routes, middlewares)
- 3 profils fonctionnels : **Admin** (crée les entreprises), **Entreprise** (crée/gère les commandes), **Client** (suivi via tracking code + email, sans compte)
- Tracking code généré automatiquement, historique complet des événements (`TrackingEvent`)
- Géocodage automatique des adresses (Nominatim/OpenStreetMap) pour la carte
- Sécurité : rate limiting sur le suivi public, sessions séparées, échecs d'email non-bloquants

### ✅ Frontend
- Login, Dashboard (commandes), page admin (gestion des entreprises), page de suivi client avec carte Leaflet
- Landing page premium à la racine (`/`) : hero 2 colonnes avec photo réaliste, services, étapes, stats, CTA
- Page dédiée `/suivre` pour la recherche de tracking code
- Design system complet inspiré d'AfterShip (Poppins, orange `#FF6B2B`, cartes, badges de statut, timeline)
- SEO de base en place (meta title/description, Open Graph, `lang="fr"`)

### ✅ Base de données
- PostgreSQL installé et configuré localement (`localhost:5432`, base `tracking`)
- Migrations appliquées, compte admin seedé

### ✅ Git / GitHub
- Dépôt : [github.com/Ingoupayoumah/Trackingwebsite](https://github.com/Ingoupayoumah/Trackingwebsite)
- Tout le travail est commité et poussé au fil des mises à jour

### 🟡 En cours — Domaine email (Resend)
- Domaine `goldenpettransport.org` acheté via Vercel
- Les 4 enregistrements DNS (DKIM, MX, SPF, DMARC) sont correctement configurés dans Vercel
- Vérification Resend toujours en attente (`pending`) — surveillance automatique en cours
- Backend déjà configuré avec la clé API Resend — dès que le domaine passe "verified", les emails partiront automatiquement sans rien reconfigurer

### 📋 Pistes pour la suite
- Une fois le domaine vérifié : tester l'envoi réel d'emails de bout en bout
- Contenu de la landing page à affiner si besoin (chiffres, textes actuellement des exemples)
- Fonctionnalités possibles : statistiques pour les entreprises, gestion multi-utilisateurs par entreprise, etc.

## Architecture

- `backend/` — API Express + TypeScript + Prisma + PostgreSQL
- `frontend/` — React + Vite + TypeScript, carte via Leaflet

3 profils :
- **Admin** — crée les comptes Entreprise, peut aussi créer des commandes
- **Entreprise** — un seul login par entreprise, crée/gère ses commandes et leur suivi
- **Client** — pas de compte : accès au suivi via tracking code (URL) + confirmation de son email

## Démarrage

### Base de données

Créer une base PostgreSQL, puis dans `backend/` :

```bash
cp .env.example .env
# renseigner DATABASE_URL, JWT_SECRET, CLIENT_SESSION_SECRET, RESEND_API_KEY
npm install
npm run prisma:migrate
npm run seed   # crée le premier compte admin (admin@example.com / changeme123 par défaut)
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Notes techniques

- Le tracking code est généré automatiquement à la création de la commande (format `LOG-XXXXXXXX`).
- Chaque changement de statut crée un `TrackingEvent` (historique complet, pas juste un statut figé).
- L'entreprise choisit, à chaque mise à jour, si le client doit être notifié par email (`notifierClient`).
- Les adresses saisies (point de départ, point de livraison, localisation d'un événement) sont géocodées automatiquement via Nominatim/OpenStreetMap pour être affichées sur la carte.
- L'accès public au suivi (`/suivi/:trackingCode`) est protégé par rate limiting pour empêcher le brute-force de l'email associé à un code intercepté.
