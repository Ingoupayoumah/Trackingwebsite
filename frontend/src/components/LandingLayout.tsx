import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/services", label: "Services" },
  { to: "/comment-ca-marche", label: "Comment ça marche" },
  { to: "/suivre", label: "Suivre un colis" },
  { to: "/contact", label: "Contact" },
];

export function LandingLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="page">
      <div className="landing-navbar">
        <div className="landing-navbar-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">GP</span>
            Golden Pet Transport
          </Link>
          <div className="landing-nav-links">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={location.pathname === link.to ? "active" : ""}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login" className="btn btn-outline btn-sm">
              Espace entreprise
            </Link>
          </div>
        </div>
      </div>

      {children}

      <div className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-col">
            <div className="brand">
              <span className="brand-mark">GP</span>
              Golden Pet Transport
            </div>
            <p className="helper-text">Strasbourg, France</p>
            <p className="helper-text">tracking@goldenpettransport.org</p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <Link to="/services">Services</Link>
            <Link to="/comment-ca-marche">Comment ça marche</Link>
            <Link to="/suivre">Suivre un colis</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h4>Informations légales</h4>
            <Link to="/politique-de-confidentialite">Politique de confidentialité</Link>
            <Link to="/mentions-legales">Mentions légales</Link>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <p className="helper-text">
            © {new Date().getFullYear()} Golden Pet Transport. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
