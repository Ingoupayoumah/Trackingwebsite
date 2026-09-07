import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { TrackingMap } from "../components/TrackingMap";
import type { TrackingPoint } from "../components/TrackingMap";

interface SuiviData {
  trackingCode: string;
  entrepriseNom: string;
  statutActuel: string;
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
    statut: string;
    message: string;
    localisation: string | null;
    latitude: number | null;
    longitude: number | null;
    createdAt: string;
  }[];
}

export function SuiviPage() {
  const { trackingCode } = useParams();
  const [email, setEmail] = useState("");
  const [data, setData] = useState<SuiviData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Réutilise le cookie de session posé par une vérification précédente,
    // pour éviter de redemander l'email à chaque rafraîchissement de page.
    api
      .get<SuiviData>(`/suivi/${trackingCode}`)
      .then(({ data: result }) => setData(result))
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
    return <p style={{ textAlign: "center", marginTop: 80 }}>Chargement...</p>;
  }

  if (!data) {
    return (
      <div style={{ maxWidth: 400, margin: "80px auto" }}>
        <h1>Suivi de colis</h1>
        <p>
          Code : <strong>{trackingCode}</strong>
        </p>
        <form onSubmit={onSubmit}>
          <label>
            Confirmez votre email pour accéder au suivi
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          {error && <p style={{ color: "crimson" }}>{error}</p>}
          <button type="submit" disabled={busy}>
            {busy ? "Vérification..." : "Voir le suivi"}
          </button>
        </form>
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
    <div style={{ maxWidth: 720, margin: "40px auto" }}>
      <h1>{data.entrepriseNom}</h1>
      <p>
        Code : <strong>{data.trackingCode}</strong> — Statut actuel :{" "}
        <strong>{data.statutActuel}</strong>
      </p>
      <p>
        {data.pointDepart} → {data.pointLivraison} (délai estimé : {data.delaiEstime})
      </p>
      <p>{data.description}</p>

      <TrackingMap points={points} />

      <h2>Historique</h2>
      <ul>
        {data.evenements.map((ev, i) => (
          <li key={i}>
            {new Date(ev.createdAt).toLocaleString()} — <strong>{ev.statut}</strong> : {ev.message}
            {ev.localisation ? ` (${ev.localisation})` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
