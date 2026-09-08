import { Link } from "react-router-dom";
import { LandingLayout } from "../components/LandingLayout";
import { useSeo } from "../hooks/useSeo";

const STEPS = [
  {
    title: "Réservez votre envoi",
    text: "Contactez Golden Pet Transport avec les informations essentielles de votre envoi : adresse d'enlèvement, adresse de livraison, description du colis (dimensions, poids, nature du contenu) et le délai souhaité. Nous vous répondons avec un devis et une fenêtre de prise en charge.",
  },
  {
    title: "Prise en charge et création de la commande",
    text: "Le jour convenu, notre équipe récupère le colis à l'adresse indiquée. La commande est enregistrée dans notre système et un code de suivi unique est généré automatiquement (format LOG-XXXXXXXX) — c'est votre référence pour tout le trajet.",
  },
  {
    title: "Suivi en direct, à chaque étape",
    text: "Vous recevez le code de suivi par email, avec un lien direct vers la page de suivi. Chaque changement de statut (préparation, transit, livraison) déclenche une mise à jour de l'historique et, si vous le souhaitez, une notification par email — visible sur une carte interactive en temps réel.",
  },
  {
    title: "Livraison et confirmation",
    text: "Votre colis arrive à l'adresse de livraison. Le statut passe à \"Livrée\" et le destinataire peut consulter l'historique complet du trajet à tout moment, sans limite de durée, simplement en ressaisissant le code de suivi et son email.",
  },
];

const FAQ = [
  {
    q: "Ai-je besoin de créer un compte pour suivre mon colis ?",
    a: "Non. Le suivi est accessible uniquement avec le code de suivi reçu par email et l'adresse email associée à la commande — aucune inscription n'est nécessaire.",
  },
  {
    q: "Combien de temps faut-il pour recevoir mon code de suivi ?",
    a: "Le code de suivi est généré immédiatement à la création de la commande et l'email de confirmation part dans la foulée. En cas de non-réception, vérifiez vos spams ou contactez-nous.",
  },
  {
    q: "Le suivi fonctionne-t-il sur mobile ?",
    a: "Oui, la page de suivi est entièrement responsive et s'affiche correctement sur smartphone, tablette ou ordinateur, sans application à installer.",
  },
  {
    q: "Que se passe-t-il si je perds mon code de suivi ?",
    a: "Retrouvez-le dans l'email de confirmation envoyé à la création de la commande, ou contactez Golden Pet Transport avec les détails de votre envoi pour le retrouver.",
  },
  {
    q: "Puis-je être notifié à chaque étape du transport ?",
    a: "Oui. À chaque mise à jour de statut, l'entreprise de transport peut choisir de vous envoyer une notification par email — vous n'avez rien à activer de votre côté.",
  },
];

export function CommentCaMarchePage() {
  useSeo(
    "Comment ça marche — Suivi de colis en temps réel | Golden Pet Transport",
    "Découvrez comment fonctionne le transport et le suivi de colis chez Golden Pet Transport : réservation, prise en charge, suivi en temps réel et livraison, en 4 étapes simples."
  );

  return (
    <LandingLayout>
      <div className="section" style={{ paddingTop: 64 }}>
        <div className="section-header">
          <span className="eyebrow">Comment ça marche</span>
          <h1>Comment fonctionne le transport de vos colis avec Golden Pet Transport</h1>
          <p>
            De la réservation à la livraison, chaque envoi confié à Golden Pet Transport suit un
            parcours simple et entièrement traçable. Voici le détail des 4 étapes, et comment le
            suivi en temps réel vous permet de savoir exactement où se trouve votre colis, sans
            jamais avoir besoin de créer de compte.
          </p>
        </div>
        <div className="steps" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: 820, margin: "0 auto" }}>
          {STEPS.map((s, i) => (
            <div className="step" key={s.title} style={{ textAlign: "left" }}>
              <div className="step-number">{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <span className="eyebrow">Pourquoi ce fonctionnement</span>
          <h2>Un suivi pensé pour la transparence</h2>
          <p>
            Contrairement à un simple numéro de colis sans historique, chaque commande Golden Pet
            Transport conserve un enregistrement complet de son trajet — pas seulement un statut
            final, mais chaque étape horodatée, avec sa localisation quand elle est disponible.
          </p>
        </div>
        <div className="feature-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="feature-card">
            <h3 style={{ marginBottom: 8 }}>Historique complet</h3>
            <p>
              Chaque changement de statut est enregistré avec sa date et son heure, formant un
              historique consultable de bout en bout — pas juste un statut qui s'écrase.
            </p>
          </div>
          <div className="feature-card">
            <h3 style={{ marginBottom: 8 }}>Accès protégé</h3>
            <p>
              Le code de suivi seul ne suffit pas : il faut aussi l'email du destinataire pour
              consulter les informations, ce qui protège la confidentialité de chaque envoi.
            </p>
          </div>
          <div className="feature-card">
            <h3 style={{ marginBottom: 8 }}>Sans engagement technique</h3>
            <p>
              Pas d'application à télécharger, pas de compte à créer : le suivi fonctionne
              directement dans le navigateur, sur ordinateur comme sur mobile.
            </p>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0, maxWidth: 760 }}>
        <div className="section-header">
          <span className="eyebrow">Questions fréquentes</span>
          <h2>Tout savoir sur le suivi de vos colis</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQ.map((item) => (
            <details key={item.q} className="card" style={{ padding: "16px 20px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 15 }}>{item.q}</summary>
              <p style={{ marginTop: 10, color: "var(--color-text-muted)" }}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="cta-band">
        <h2>Prêt à expédier votre colis ?</h2>
        <p>Demandez un devis ou suivez une commande existante.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/contact" className="btn btn-primary">
            Demander un devis
          </Link>
          <Link to="/suivre" className="btn btn-outline">
            Suivre mon colis
          </Link>
        </div>
      </div>
    </LandingLayout>
  );
}
