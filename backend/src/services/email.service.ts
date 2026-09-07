import { Resend } from "resend";
import { env } from "../config/env";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

interface CommandeCreeeParams {
  clientEmail: string;
  clientNom: string;
  entrepriseNom: string;
  trackingCode: string;
}

interface StatutMisAJourParams {
  clientEmail: string;
  clientNom: string;
  entrepriseNom: string;
  trackingCode: string;
  statut: string;
  message: string;
}

function trackingUrl(trackingCode: string) {
  return `${env.frontendUrl}/suivi/${trackingCode}`;
}

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY manquant — email non envoyé à ${to}: ${subject}`);
    return;
  }
  await resend.emails.send({ from: env.emailFrom, to, subject, html });
}

export async function sendCommandeCreeeEmail(params: CommandeCreeeParams) {
  await send(
    params.clientEmail,
    `${params.entrepriseNom} — Votre colis est en préparation`,
    `<p>Bonjour ${params.clientNom},</p>
     <p>${params.entrepriseNom} a créé une commande pour vous. Suivez-la avec le code
     <strong>${params.trackingCode}</strong> :</p>
     <p><a href="${trackingUrl(params.trackingCode)}">${trackingUrl(params.trackingCode)}</a></p>
     <p>Il vous sera demandé de confirmer votre email pour accéder au suivi.</p>`
  );
}

export async function sendStatutMisAJourEmail(params: StatutMisAJourParams) {
  await send(
    params.clientEmail,
    `${params.entrepriseNom} — Mise à jour de votre colis (${params.trackingCode})`,
    `<p>Bonjour ${params.clientNom},</p>
     <p>Nouveau statut : <strong>${params.statut}</strong></p>
     <p>${params.message}</p>
     <p><a href="${trackingUrl(params.trackingCode)}">Suivre mon colis</a></p>`
  );
}
