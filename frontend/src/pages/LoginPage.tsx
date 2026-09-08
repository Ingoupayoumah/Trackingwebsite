import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Email ou mot de passe incorrect");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <span className="brand-mark">TF</span>
          TrackFlow
        </div>
        <h1>Connexion</h1>
        <p className="helper-text" style={{ textAlign: "center", marginBottom: 20 }}>
          Cet espace est réservé aux entreprises de transport partenaires et aux administrateurs
          de la plateforme, pour créer et gérer les commandes de leurs clients.
        </p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field">
            <label>Email</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="vous@entreprise.com"
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label>Mot de passe</label>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p className="helper-text" style={{ textAlign: "center", marginTop: 20 }}>
          Vous êtes client et cherchez à suivre un colis ?{" "}
          <Link to="/suivre">Accédez au suivi ici</Link> — aucune connexion n'est nécessaire.
        </p>
        <Link to="/" className="helper-text" style={{ display: "block", textAlign: "center", marginTop: 10 }}>
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
