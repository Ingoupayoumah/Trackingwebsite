import { Link } from "react-router-dom";
import heroDelivery from "../assets/hero-delivery.jpg";

const FEATURES = [
  {
    icon: "📦",
    title: "Livraison porte-à-porte",
    text: "Votre colis est enlevé à l'adresse convenue et livré directement à destination, sans rupture de charge.",
  },
  {
    icon: "📍",
    title: "Suivi GPS en temps réel",
    text: "Chaque étape du trajet est visible sur une carte interactive, du départ jusqu'à la livraison.",
  },
  {
    icon: "🚚",
    title: "Chauffeurs professionnels et assurés",
    text: "Une équipe expérimentée et des véhicules équipés pour transporter vos marchandises en toute sécurité.",
  },
  {
    icon: "✉️",
    title: "Notifications automatiques",
    text: "Vos destinataires reçoivent un email à chaque étape clé, sans avoir besoin de créer de compte.",
  },
];

const STEPS = [
  { title: "Réservez votre envoi", text: "Contactez-nous avec les détails de votre colis et de la livraison souhaitée." },
  { title: "Prise en charge", text: "Notre équipe récupère votre colis à l'adresse convenue." },
  { title: "Suivi en direct", text: "Vous recevez un code de suivi et suivez le trajet en ligne à tout moment." },
  { title: "Livraison", text: "Votre colis arrive à destination, en toute sécurité et dans les délais." },
];

export function LandingPage() {
  return (
    <div className="page">
      <div className="landing-navbar">
        <div className="landing-navbar-inner">
          <div className="brand">
            <span className="brand-mark">GP</span>
            Golden Pet Transport
          </div>
          <div className="landing-nav-links">
            <a href="#services">Services</a>
            <a href="#comment-ca-marche">Comment ça marche</a>
            <Link to="/suivre">Suivre un colis</Link>
            <Link to="/login" className="btn btn-outline btn-sm">
              Espace entreprise
            </Link>
          </div>
        </div>
      </div>

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-eyebrow">📍 Basé à Strasbourg, France</span>
            <h1>Vos colis livrés à temps, suivis à chaque étape</h1>
            <p className="lead">
              Golden Pet Transport prend en charge le transport de vos colis partout en France :
              enlèvement, transit et livraison, avec un suivi en temps réel accessible à tout
              moment — sans compte à créer.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">
                Demander un devis
              </a>
              <Link to="/suivre" className="btn btn-outline">
                Suivre mon colis
              </Link>
            </div>
          </div>
          <div className="hero-photo">
            <img
              src={heroDelivery}
              alt="Chargement de colis dans une camionnette de livraison"
            />
          </div>
        </div>

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

      <div className="section" id="services">
        <div className="section-header">
          <span className="eyebrow">Nos services</span>
          <h2>Un transport de colis fiable, de bout en bout</h2>
          <p>De la prise en charge à la livraison, chaque étape est suivie et sécurisée.</p>
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

      <div className="section" id="comment-ca-marche" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <span className="eyebrow">Comment ça marche</span>
          <h2>4 étapes simples</h2>
        </div>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div className="step" key={s.title}>
              <div className="step-number">{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-band" id="contact">
        <h2>Vous gérez une entreprise de transport ?</h2>
        <p>Connectez-vous à votre espace pour créer et suivre les commandes de vos clients.</p>
        <Link to="/login" className="btn btn-primary">
          Accéder à l'espace entreprise
        </Link>
      </div>

      <div className="landing-footer">
        <div className="landing-footer-inner">
          <div className="brand">
            <span className="brand-mark">GP</span>
            Golden Pet Transport
          </div>
          <p className="helper-text">Strasbourg, France — tracking@goldenpettransport.org</p>
        </div>
      </div>
    </div>
  );
}
