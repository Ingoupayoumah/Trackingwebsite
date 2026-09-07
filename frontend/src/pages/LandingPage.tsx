import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "🐾",
    title: "Transport porte-à-porte",
    text: "Votre chien est pris en charge chez vous et livré directement chez le destinataire, sans étape intermédiaire.",
  },
  {
    icon: "📍",
    title: "Suivi en temps réel",
    text: "Suivez le trajet de votre compagnon sur une carte, du départ jusqu'à l'arrivée, avec chaque étape horodatée.",
  },
  {
    icon: "🩺",
    title: "Chauffeurs formés bien-être animal",
    text: "Une équipe sensibilisée au confort et au stress des animaux, avec pauses régulières et véhicules adaptés.",
  },
  {
    icon: "✉️",
    title: "Notifications automatiques",
    text: "Un email vous informe à chaque étape clé du transport, sans avoir besoin de créer de compte.",
  },
];

const STEPS = [
  { title: "Réservez", text: "Contactez-nous avec les détails du trajet et de votre animal." },
  { title: "Prise en charge", text: "Notre équipe récupère votre chien à l'adresse convenue." },
  { title: "Suivi en direct", text: "Vous recevez un code de suivi et suivez le trajet en ligne." },
  { title: "Livraison", text: "Votre chien arrive en toute sécurité à destination." },
];

export function LandingPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const navigate = useNavigate();

  function onTrack(e: FormEvent) {
    e.preventDefault();
    if (trackingCode.trim()) {
      navigate(`/suivi/${trackingCode.trim()}`);
    }
  }

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
            <a href="#suivi">Suivre un colis</a>
            <Link to="/login" className="btn btn-outline btn-sm">
              Espace entreprise
            </Link>
          </div>
        </div>
      </div>

      <div className="hero">
        <div className="hero-inner">
          <span className="hero-eyebrow">📍 Basé à Strasbourg, France</span>
          <h1>Le transport de votre chien, en toute sérénité</h1>
          <p className="lead">
            Golden Pet Transport organise le transport de vos animaux de compagnie partout en
            France, avec un suivi en temps réel et des chauffeurs formés au bien-être animal.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">
              Demander un devis
            </a>
            <a href="#suivi" className="btn btn-outline">
              Suivre mon colis
            </a>
          </div>

          <form className="track-box" onSubmit={onTrack} id="suivi">
            <input
              className="input"
              placeholder="Entrez votre code de suivi (ex: LOG-XXXXXXXX)"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Suivre
            </button>
          </form>

          <div className="stats-row">
            <div>
              <div className="stat-number">500+</div>
              <div className="stat-label">Chiens transportés</div>
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
      </div>

      <div className="section" id="services">
        <div className="section-header">
          <span className="eyebrow">Nos services</span>
          <h2>Un transport pensé pour le confort de votre animal</h2>
          <p>De la prise en charge à la livraison, chaque étape est pensée pour rassurer.</p>
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
