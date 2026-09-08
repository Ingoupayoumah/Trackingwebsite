import { Link } from "react-router-dom";
import { LandingLayout } from "../components/LandingLayout";

const STEPS = [
  {
    title: "Réservez votre envoi",
    text: "Contactez-nous avec les détails de votre colis : point de départ, point de livraison, description et délai souhaité.",
  },
  {
    title: "Prise en charge",
    text: "Notre équipe récupère votre colis à l'adresse convenue et crée votre commande, avec un code de suivi généré automatiquement.",
  },
  {
    title: "Suivi en direct",
    text: "Vous recevez le code de suivi par email. Chaque changement d'étape est mis à jour en temps réel et visible sur une carte.",
  },
  {
    title: "Livraison",
    text: "Votre colis arrive à destination. Le destinataire est notifié et peut consulter tout l'historique du trajet à tout moment.",
  },
];

export function CommentCaMarchePage() {
  return (
    <LandingLayout>
      <div className="section" style={{ paddingTop: 64 }}>
        <div className="section-header">
          <span className="eyebrow">Comment ça marche</span>
          <h2>Un parcours simple, du départ à l'arrivée</h2>
          <p>4 étapes suffisent pour organiser et suivre le transport de votre colis.</p>
        </div>
        <div className="steps" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: 720, margin: "0 auto" }}>
          {STEPS.map((s, i) => (
            <div className="step" key={s.title} style={{ textAlign: "left" }}>
              <div className="step-number">{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
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
