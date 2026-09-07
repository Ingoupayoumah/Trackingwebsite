# Plateforme de tracking logistique

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
