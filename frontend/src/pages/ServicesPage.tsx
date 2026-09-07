import { Link } from "react-router-dom";
import { LandingLayout } from "../components/LandingLayout";

const FEATURES = [
  {
    icon: "📦",
    title: "Livraison porte-à-porte",
    text: "Votre colis est enlevé directement à l'adresse convenue et livré chez le destinataire, sans rupture de charge ni passage par un point relais.",
  },
  {
    icon: "📍",
    title: "Suivi GPS en temps réel",
    text: "Chaque étape du trajet est géolocalisée et visible sur une carte interactive, du départ jusqu'à la livraison finale.",
  },
  {
    icon: "🚚",
    title: "Chauffeurs professionnels et assurés",
    text: "Une équipe expérimentée, des véhicules entretenus et une couverture assurance sur l'ensemble des trajets.",
  },
  {
    icon: "✉️",
    title: "Notifications automatiques",
    text: "Le destinataire reçoit un email à chaque étape clé (prise en charge, transit, livraison), sans avoir besoin de créer de compte.",
  },
  {
    icon: "🕒",
    title: "Délais annoncés à l'avance",
    text: "Un délai estimé est communiqué dès la création de la commande, et mis à jour si la situation évolue.",
  },
  {
    icon: "🔒",
    title: "Accès sécurisé au suivi",
    text: "Le suivi n'est accessible qu'en combinant le code de suivi et l'email du destinataire, pour protéger la confidentialité de chaque envoi.",
  },
];

export function ServicesPage() {
  return (
    <LandingLayout>
      <div className="section" style={{ paddingTop: 64 }}>
        <div className="section-header">
          <span className="eyebrow">Nos services</span>
          <h2>Un transport de colis pensé pour la fiabilité</h2>
          <p>
            Golden Pet Transport accompagne particuliers et entreprises dans l'acheminement de
            leurs colis partout en France, avec une visibilité complète à chaque étape.
          </p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-band">
        <h2>Une question sur nos services ?</h2>
        <p>Contactez-nous pour un devis personnalisé ou plus d'informations.</p>
        <Link to="/contact" className="btn btn-primary">
          Nous contacter
        </Link>
      </div>
    </LandingLayout>
  );
}
