# Plateforme de tracking logistique

## État du projet
_Dernière mise à jour : 2026-09-08_

### 🚀 En ligne et fonctionnel
- **Site (domaine personnalisé)** : https://www.goldenpettransport.org (apex `goldenpettransport.org` redirige vers `www`)
- **Frontend (URL Vercel)** : https://trackingwebsite-8aju.vercel.app
- **Backend (production)** : https://trackingwebsite-seven.vercel.app
- Testé de bout en bout en production, y compris sur le domaine personnalisé : connexion admin, création d'entreprise, création de commande (avec géocodage), suivi public avec carte — tout fonctionne

### ✅ Architecture & Backend
- API Express + TypeScript + Prisma + PostgreSQL, déployée en fonction serverless sur Vercel (`backend/api/index.ts`)
- 3 profils fonctionnels : **Admin** (crée les entreprises), **Entreprise** (crée/gère les commandes), **Client** (suivi via tracking code + email, sans compte)
- Tracking code généré automatiquement, historique complet des événements (`TrackingEvent`)
- Géocodage automatique des adresses (Nominatim/OpenStreetMap) pour la carte
- Sécurité : rate limiting sur le suivi public, sessions séparées (cookie cross-site `SameSite=None` en prod), échecs d'email non-bloquants
- Client Prisma mis en cache sur `globalThis` pour les invocations serverless "chaudes"

### ✅ Frontend
- Login, Dashboard (commandes), page admin (gestion des entreprises), page de suivi client avec carte Leaflet
- Landing page premium à la racine (`/`) : hero 2 colonnes avec photo réaliste, services, étapes, stats, CTA
- Pages dédiées : `/services`, `/comment-ca-marche`, `/contact`, `/suivre`
- Pages légales RGPD : `/politique-de-confidentialite`, `/mentions-legales` (infos d'immatriculation à compléter avant mise en ligne officielle)
- Design system complet inspiré d'AfterShip (Poppins, orange `#FF6B2B`, cartes, badges de statut, timeline)
- SEO de base en place (meta title/description, Open Graph, `lang="fr"`)
- Rewrite SPA (`vercel.json`) pour que les routes React Router fonctionnent en accès direct sur Vercel

### ✅ Base de données
- **Production** : Neon (PostgreSQL serverless), projet `sparkling-sun-50982106`, connexion pooled + directe configurée pour les migrations
- **Local (dev)** : PostgreSQL installé localement (`localhost:5432`, base `tracking`)
- Migrations appliquées sur les deux, comptes admin seedés (prod : `admin@goldenpettransport.org`)

### ✅ Git / GitHub
- Dépôt : [github.com/Ingoupayoumah/Trackingwebsite](https://github.com/Ingoupayoumah/Trackingwebsite)
- Déploiement automatique sur Vercel à chaque push sur `main` (frontend + backend, projets séparés)

### ✅ Email (Resend)
- Domaine `goldenpettransport.org` vérifié sur Resend — envoi d'emails réels opérationnel
- Backend configuré avec la clé API Resend en production

### 📋 Pistes pour la suite
- Compléter les informations d'immatriculation réelles sur la page Mentions légales (SIRET, forme juridique, RCS, directeur de publication)
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
