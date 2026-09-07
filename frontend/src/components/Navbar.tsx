import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { auth, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="brand-mark">TF</span>
          TrackFlow
        </div>
        <div className="nav-links">
          <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
            Commandes
          </Link>
          {auth?.role === "admin" && (
            <Link
              to="/admin/entreprises"
              className={location.pathname === "/admin/entreprises" ? "active" : ""}
            >
              Entreprises
            </Link>
          )}
          <span className="helper-text">{auth?.nom ?? auth?.role}</span>
          <button className="btn btn-outline btn-sm" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
