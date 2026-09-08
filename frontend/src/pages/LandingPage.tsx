import { Link } from "react-router-dom";
import heroBg from "../assets/hero-bg.png";
import { LandingLayout } from "../components/LandingLayout";
import { useSeo } from "../hooks/useSeo";
import { IconMapPin, IconPackage, IconTruck } from "../components/icons";

const FEATURES = [
  {
    icon: IconPackage,
    title: "Livraison porte-à-porte",
    text: "Votre colis est enlevé à l'adresse convenue et livré directement à destination, sans rupture de charge.",
  },
  {
    icon: IconMapPin,
    title: "Suivi GPS en temps réel",
    text: "Chaque étape du trajet est visible sur une carte interactive, du départ jusqu'à la livraison.",
  },
  {
    icon: IconTruck,
    title: "Chauffeurs professionnels et assurés",
    text: "Une équipe expérimentée et des véhicules équipés pour transporter vos marchandises en toute sécurité.",
  },
];

export function LandingPage() {
  useSeo(
    "Golden Pet Transport — Transport et suivi de colis en temps réel",
    "Golden Pet Transport assure le transport et la livraison de vos colis partout en France, avec un suivi en temps réel accessible à tout moment. Basé à Strasbourg."
  );

  return (
    <LandingLayout>
      <div className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-inner">
          <div className="hero-text">
            <h1>Vos colis livrés à temps, suivis à chaque étape</h1>
            <p className="lead">
              Golden Pet Transport prend en charge le transport de vos colis partout en France :
              enlèvement, transit et livraison, avec un suivi en temps réel accessible à tout
              moment — sans compte à créer.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary">
                Demander un devis
              </Link>
              <Link to="/suivre" className="btn btn-outline">
                Suivre mon colis
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-row">
          <div>
            <div className="stat-number">2 500+</div>
            <div className="stat-label">Colis livrés</div>
          </div>
          <div>
            <div className="stat-number">98%</div>
            <div className="stat-label">Clients satisfaits</div>
          </div>
          <div>
            <div className="stat-number">100%</div>
            <div className="stat-label">Trajets suivis en direct</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="eyebrow">Nos services</span>
          <h2>Un transport de colis fiable, de bout en bout</h2>
          <p>De la prise en charge à la livraison, chaque étape est suivie et sécurisée.</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">
                <f.icon />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link to="/services" className="btn btn-outline">
            Voir tous nos services
          </Link>
        </div>
      </div>

      <div className="cta-band">
        <h2>Vous gérez une entreprise de transport ?</h2>
        <p>Connectez-vous à votre espace pour créer et suivre les commandes de vos clients.</p>
        <Link to="/login" className="btn btn-primary">
          Accéder à l'espace entreprise
        </Link>
      </div>
    </LandingLayout>
  );
}
