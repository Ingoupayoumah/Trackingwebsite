import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { TrackingMap } from "../components/TrackingMap";
import type { TrackingPoint } from "../components/TrackingMap";
import { StatusBadge } from "../components/StatusBadge";
import type { StatutCommande } from "../api/types";

interface SuiviData {
  trackingCode: string;
  entrepriseNom: string;
  statutActuel: StatutCommande;
  pointDepart: string;
  pointDepartLat: number | null;
  pointDepartLng: number | null;
  pointLivraison: string;
  pointLivraisonLat: number | null;
  pointLivraisonLng: number | null;
  description: string;
  delaiEstime: string;
  createdAt: string;
  evenements: {
    statut: StatutCommande;
    message: string;
    localisation: string | null;
    latitude: number | null;
    longitude: number | null;
    createdAt: string;
  }[];
}

export function SuiviPage() {
  const { trackingCode } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const magicToken = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [data, setData] = useState<SuiviData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const url = magicToken
      ? `/suivi/${trackingCode}?token=${encodeURIComponent(magicToken)}`
      : `/suivi/${trackingCode}`;
    api
      .get<SuiviData>(url)
      .then(({ data: result }) => {
        setData(result);
        // Le backend a posé le cookie de session à partir du token : on peut
        // retirer le token de l'URL visible (historique, partage d'écran...).
        if (magicToken) setSearchParams({}, { replace: true });
      })
      .catch(() => {})
      .finally(() => setCheckingSession(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingCode]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data: result } = await api.post<SuiviData>(
        `/suivi/${trackingCode}/verifier`,
        { email }
      );
      setData(result);
    } catch {
      setError("Code de suivi ou email invalide");
    } finally {
      setBusy(false);
    }
  }

  if (checkingSession) {
    return <div className="centered-status">Chargement...</div>;
  }

  if (!data) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <Link to="/" className="brand">
            <span className="brand-mark">GP</span>
            Golden Pet Transport
          </Link>
          <h1>Suivre mon colis</h1>
          <p className="helper-text" style={{ textAlign: "center", marginBottom: 20 }}>
            Code : <span className="tracking-code-pill">{trackingCode}</span>
          </p>
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label>Confirmez votre email pour accéder au suivi</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="vous@example.com"
                required
                autoFocus
              />
              <p className="helper-text" style={{ marginTop: 2 }}>
                L'adresse email doit correspondre à celle utilisée lors de la création de
                votre commande — c'est ce qui protège la confidentialité de votre suivi.
              </p>
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? "Vérification..." : "Voir le suivi"}
            </button>
          </form>
          <Link to="/" className="helper-text" style={{ display: "block", textAlign: "center", marginTop: 20 }}>
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const points: TrackingPoint[] = [];
  if (data.pointDepartLat && data.pointDepartLng) {
    points.push({ lat: data.pointDepartLat, lng: data.pointDepartLng, label: `Départ : ${data.pointDepart}` });
  }
  data.evenements.forEach((ev, i) => {
    if (ev.latitude && ev.longitude) {
      points.push({
        lat: ev.latitude,
        lng: ev.longitude,
        label: `${ev.statut} — ${ev.message}`,
        isCurrent: i === data.evenements.length - 1,
      });
    }
  });
  if (data.pointLivraisonLat && data.pointLivraisonLng) {
    points.push({
      lat: data.pointLivraisonLat,
      lng: data.pointLivraisonLng,
      label: `Livraison : ${data.pointLivraison}`,
    });
  }

  return (
    <div className="page">
      <div className="suivi-hero">
        <div className="suivi-hero-inner">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <Link to="/" className="brand">
              <span className="brand-mark">GP</span>
              Golden Pet Transport
            </Link>
            <Link to="/" className="btn btn-outline btn-sm">
              ← Accueil
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
            <h1>{data.entrepriseNom}</h1>
            <StatusBadge statut={data.statutActuel} />
          </div>
          <p className="helper-text" style={{ marginBottom: 14 }}>
            Suivi en temps réel de votre colis — cette page se met à jour à chaque nouvelle étape.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span className="tracking-code-pill">{data.trackingCode}</span>
            <span className="helper-text">
              {data.pointDepart} → {data.pointLivraison} · délai estimé {data.delaiEstime}
            </span>
          </div>
        </div>
      </div>

      <div className="suivi-content">
        <div className="card" style={{ marginBottom: 20 }}>
          <h4 style={{ marginBottom: 6 }}>Description du colis</h4>
          <p>{data.description}</p>
        </div>

        <div className="map-card" style={{ marginBottom: 20 }}>
          <TrackingMap points={points} />
        </div>

        <div className="card">
          <h2 className="card-title">Historique</h2>
          <p className="helper-text" style={{ marginTop: -10, marginBottom: 16 }}>
            Chaque étape ci-dessous est ajoutée par {data.entrepriseNom} au fur et à mesure du
            transport, de la prise en charge jusqu'à la livraison.
          </p>
          <ul className="timeline">
            {data.evenements.map((ev, i) => (
              <li key={i} className={`timeline-item${i === data.evenements.length - 1 ? "" : " is-muted"}`}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-date">{new Date(ev.createdAt).toLocaleString()}</div>
                  <StatusBadge statut={ev.statut} />
                  <div className="timeline-message">
                    {ev.message}
                    {ev.localisation ? ` · ${ev.localisation}` : ""}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
