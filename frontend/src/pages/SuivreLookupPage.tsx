import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

export function SuivreLookupPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const navigate = useNavigate();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (trackingCode.trim()) {
      navigate(`/suivi/${trackingCode.trim()}`);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="brand">
          <span className="brand-mark">GP</span>
          Golden Pet Transport
        </Link>
        <h1>Suivre mon colis</h1>
        <p className="helper-text" style={{ textAlign: "center", marginBottom: 20 }}>
          Entrez le code de suivi reçu par email pour voir où en est votre livraison.
        </p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field">
            <label>Code de suivi</label>
            <input
              className="input"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="ex: LOG-XXXXXXXX"
              required
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Voir le suivi
          </button>
        </form>
        <Link to="/" className="helper-text" style={{ display: "block", textAlign: "center", marginTop: 20 }}>
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
