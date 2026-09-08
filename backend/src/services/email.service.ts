import { Resend } from "resend";
import { env } from "../config/env";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

interface CommandeCreeeParams {
  clientEmail: string;
  clientNom: string;
  entrepriseNom: string;
  trackingCode: string;
  pointDepart: string;
  pointLivraison: string;
  delaiEstime: string;
  magicToken: string;
}

interface StatutMisAJourParams {
  clientEmail: string;
  clientNom: string;
  entrepriseNom: string;
  trackingCode: string;
  statut: string;
  message: string;
  magicToken: string;
}

const STATUT_LABELS: Record<string, string> = {
  CREEE: "Créée",
  EN_PREPARATION: "En préparation",
  EN_TRANSIT: "En transit",
  EN_LIVRAISON: "En livraison",
  LIVREE: "Livrée",
  PROBLEME: "Problème",
  ANNULEE: "Annulée",
};

// Le token magique permet d'accéder directement au suivi en cliquant depuis
// l'email, sans redemander l'email au client (voir GET /suivi/:code côté backend).
function trackingUrl(trackingCode: string, magicToken: string) {
  return `${env.frontendUrl}/suivi/${trackingCode}?token=${magicToken}`;
}

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY manquant — email non envoyé à ${to}: ${subject}`);
    return;
  }
  // Un échec d'envoi (domaine pas encore vérifié, quota, etc.) ne doit jamais faire
  // échouer la création/mise à jour de la commande qui a déclenché l'email.
  try {
    const result = await resend.emails.send({ from: env.emailFrom, to, subject, html });
    if (result.error) {
      console.error(`[email] échec d'envoi à ${to}:`, result.error);
    }
  } catch (err) {
    console.error(`[email] échec d'envoi à ${to}:`, err);
  }
}

// Styles inline partout : les clients mail (Outlook, Gmail...) ignorent ou
// suppriment les <style> externes, seul l'inline est fiable partout.
function emailLayout(opts: { preheader: string; entrepriseNom: string; bodyHtml: string }) {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background-color:#f7f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <span style="display:none;font-size:1px;color:#f7f7f5;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${opts.preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e7e3;">
            <tr>
              <td style="padding:28px 32px;border-bottom:1px solid #e8e7e3;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#ff6b2b;border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;">
                      <span style="color:#ffffff;font-weight:800;font-size:14px;line-height:32px;">GP</span>
                    </td>
                    <td style="padding-left:10px;font-weight:800;font-size:16px;color:#17171a;">
                      ${opts.entrepriseNom}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${opts.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#f7f7f5;border-top:1px solid #e8e7e3;">
                <p style="margin:0;font-size:12px;color:#9a9a9a;line-height:1.6;">
                  Cet email a été envoyé automatiquement suite à une action sur votre commande de transport.<br />
                  Golden Pet Transport — Strasbourg, France
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function trackingCodePill(trackingCode: string) {
  return `<span style="display:inline-block;font-family:monospace;font-weight:700;font-size:14px;letter-spacing:0.04em;background-color:#f7f7f5;border:1px solid #e8e7e3;border-radius:999px;padding:6px 16px;color:#17171a;">${trackingCode}</span>`;
}

function ctaButton(url: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
    <tr>
      <td style="background-color:#ff6b2b;border-radius:8px;">
        <a href="${url}" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">${label}</a>
      </td>
    </tr>
  </table>`;
}

export async function sendCommandeCreeeEmail(params: CommandeCreeeParams) {
  const body = `
    <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ff6b2b;text-transform:uppercase;letter-spacing:0.03em;">Nouvelle commande</p>
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#17171a;">Bonjour ${params.clientNom}, votre colis est en préparation</h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#6b6b6b;">
      ${params.entrepriseNom} a créé une commande de transport pour vous. Voici votre code de suivi :
    </p>
    ${trackingCodePill(params.trackingCode)}
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 0;width:100%;background-color:#f7f7f5;border-radius:12px;">
      <tr>
        <td style="padding:16px 20px;font-size:14px;color:#17171a;">
          <strong>${params.pointDepart}</strong> → <strong>${params.pointLivraison}</strong><br />
          <span style="color:#6b6b6b;">Délai estimé : ${params.delaiEstime}</span>
        </td>
      </tr>
    </table>
    ${ctaButton(trackingUrl(params.trackingCode, params.magicToken), "Suivre mon colis")}
    <p style="margin:16px 0 0;font-size:13px;color:#9a9a9a;line-height:1.6;">
      Gardez cet email : ce lien vous donne un accès direct au suivi.
    </p>`;

  await send(
    params.clientEmail,
    `${params.entrepriseNom} — Votre colis est en préparation`,
    emailLayout({
      preheader: `Votre code de suivi : ${params.trackingCode}`,
      entrepriseNom: params.entrepriseNom,
      bodyHtml: body,
    })
  );
}

export async function sendStatutMisAJourEmail(params: StatutMisAJourParams) {
  const statutLabel = STATUT_LABELS[params.statut] ?? params.statut;
  const body = `
    <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#ff6b2b;text-transform:uppercase;letter-spacing:0.03em;">Mise à jour de livraison</p>
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#17171a;">Bonjour ${params.clientNom}, votre colis a bougé</h1>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
      <tr>
        <td style="background-color:#fff1ea;border-radius:999px;padding:5px 14px;">
          <span style="font-size:12px;font-weight:700;color:#e85a1c;text-transform:uppercase;letter-spacing:0.02em;">${statutLabel}</span>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#17171a;">${params.message}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6b6b6b;">Code de suivi</p>
    ${trackingCodePill(params.trackingCode)}
    ${ctaButton(trackingUrl(params.trackingCode, params.magicToken), "Voir le suivi complet")}`;

  await send(
    params.clientEmail,
    `${params.entrepriseNom} — Mise à jour de votre colis (${params.trackingCode})`,
    emailLayout({
      preheader: `Nouveau statut : ${statutLabel}`,
      entrepriseNom: params.entrepriseNom,
      bodyHtml: body,
    })
  );
}
