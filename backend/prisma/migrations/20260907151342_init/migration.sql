-- CreateEnum
CREATE TYPE "StatutEntreprise" AS ENUM ('ACTIF', 'SUSPENDU');

-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('CREEE', 'EN_PREPARATION', 'EN_TRANSIT', 'EN_LIVRAISON', 'LIVREE', 'PROBLEME', 'ANNULEE');

-- CreateEnum
CREATE TYPE "CreateurCommande" AS ENUM ('ADMIN', 'ENTREPRISE');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entreprise" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT,
    "telephone" TEXT,
    "statut" "StatutEntreprise" NOT NULL DEFAULT 'ACTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creeParAdminId" TEXT NOT NULL,

    CONSTRAINT "Entreprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "creePar" "CreateurCommande" NOT NULL,
    "clientNom" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientTelephone" TEXT,
    "pointDepart" TEXT NOT NULL,
    "pointDepartLat" DOUBLE PRECISION,
    "pointDepartLng" DOUBLE PRECISION,
    "pointLivraison" TEXT NOT NULL,
    "pointLivraisonLat" DOUBLE PRECISION,
    "pointLivraisonLng" DOUBLE PRECISION,
    "description" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "delaiEstime" TEXT NOT NULL,
    "statutActuel" "StatutCommande" NOT NULL DEFAULT 'CREEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingEvent" (
    "id" TEXT NOT NULL,
    "commandeId" TEXT NOT NULL,
    "statut" "StatutCommande" NOT NULL,
    "message" TEXT NOT NULL,
    "localisation" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "notifie" BOOLEAN NOT NULL DEFAULT false,
    "notifieAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Entreprise_email_key" ON "Entreprise"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Commande_trackingCode_key" ON "Commande"("trackingCode");

-- CreateIndex
CREATE INDEX "Commande_entrepriseId_idx" ON "Commande"("entrepriseId");

-- CreateIndex
CREATE INDEX "Commande_clientEmail_idx" ON "Commande"("clientEmail");

-- CreateIndex
CREATE INDEX "TrackingEvent_commandeId_idx" ON "TrackingEvent"("commandeId");

-- AddForeignKey
ALTER TABLE "Entreprise" ADD CONSTRAINT "Entreprise_creeParAdminId_fkey" FOREIGN KEY ("creeParAdminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingEvent" ADD CONSTRAINT "TrackingEvent_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE CASCADE ON UPDATE CASCADE;
