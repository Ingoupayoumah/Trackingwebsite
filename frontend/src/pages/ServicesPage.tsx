import { Link } from "react-router-dom";
import servicesBg from "../assets/services-bg.jpg";
import { LandingLayout } from "../components/LandingLayout";
import { useSeo } from "../hooks/useSeo";
import {
  IconClock,
  IconMail,
  IconMapPin,
  IconPackage,
  IconShieldCheck,
  IconTruck,
} from "../components/icons";

const FEATURES = [
  {
    icon: IconPackage,
    title: "Livraison porte-à-porte",
    text: "Votre colis est enlevé directement à l'adresse convenue et livré chez le destinataire, sans rupture de charge ni passage par un point relais. Une seule prise en charge, un seul interlocuteur, du début à la fin du trajet.",
  },
  {
    icon: IconMapPin,
    title: "Suivi GPS en temps réel",
    text: "Chaque étape du trajet est géolocalisée et visible sur une carte interactive, du départ jusqu'à la livraison finale. Vous savez exactement où se trouve votre envoi, sans avoir à appeler pour demander des nouvelles.",
  },
  {
    icon: IconTruck,
    title: "Chauffeurs professionnels et assurés",
    text: "Une équipe expérimentée, des véhicules entretenus régulièrement et une couverture assurance sur l'ensemble des trajets, quel que soit le type de marchandise transportée.",
  },
  {
    icon: IconMail,
    title: "Notifications automatiques",
    text: "Le destinataire reçoit un email à chaque étape clé (prise en charge, transit, livraison), avec un lien direct vers le suivi — sans avoir besoin de créer de compte ni d'installer d'application.",
  },
  {
    icon: IconClock,
    title: "Délais annoncés à l'avance",
    text: "Un délai estimé est communiqué dès la création de la commande, et mis à jour si la situation évolue en cours de trajet, pour que vous puissiez organiser la réception en conséquence.",
  },
  {
    icon: IconShieldCheck,
    title: "Accès sécurisé au suivi",
    text: "Le suivi n'est accessible qu'en combinant le code de suivi unique et l'email du destinataire, pour protéger la confidentialité de chaque envoi contre les accès non autorisés.",
  },
];

export function ServicesPage() {
  useSeo(
    "Nos services de transport de colis — Golden Pet Transport",
    "Livraison porte-à-porte, suivi GPS en temps réel, chauffeurs assurés, notifications automatiques : découvrez tous les services de transport de colis de Golden Pet Transport à Strasbourg et partout en France."
  );

  return (
    <LandingLayout>
      <div className="page-hero" style={{ backgroundImage: `url(${servicesBg})` }}>
        <div className="page-hero-inner">
          <span className="hero-eyebrow">Nos services</span>
          <h1>Un transport de colis pensé pour la fiabilité</h1>
          <p>
            Golden Pet Transport accompagne particuliers et entreprises dans l'acheminement de
            leurs colis partout en France, avec une visibilité complète à chaque étape du trajet.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="eyebrow">Ce qui est inclus</span>
          <h2>6 engagements sur chaque envoi</h2>
          <p>
            Que vous soyez un particulier qui envoie un colis ponctuel ou une entreprise avec des
            besoins réguliers, chaque commande bénéficie du même niveau de service.
          </p>
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
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <span className="eyebrow">Pour qui</span>
          <h2>Un service adapté à chaque besoin</h2>
        </div>
        <div className="feature-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          <div className="feature-card">
            <h3 style={{ marginBottom: 8 }}>Particuliers</h3>
            <p>
              Envoi ponctuel d'un colis, déménagement partiel, cadeau à faire livrer : demandez un
              devis en quelques minutes, sans engagement, et suivez votre envoi comme n'importe
              quel client professionnel.
            </p>
          </div>
          <div className="feature-card">
            <h3 style={{ marginBottom: 8 }}>Entreprises</h3>
            <p>
              Livraisons régulières à vos clients avec un espace dédié pour créer vos commandes,
              suivre l'ensemble de votre activité et notifier automatiquement vos destinataires à
              chaque étape.
            </p>
          </div>
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
