import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Entreprise } from "../api/types";
import { useAuth } from "../context/AuthContext";

export function AdminEntreprisesPage() {
  const { logout } = useAuth();
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function refresh() {
    const { data } = await api.get<Entreprise[]>("/admin/entreprises");
    setEntreprises(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function toggleStatut(entreprise: Entreprise) {
    setBusyId(entreprise.id);
    try {
      const statut = entreprise.statut === "ACTIF" ? "SUSPENDU" : "ACTIF";
      await api.patch(`/admin/entreprises/${entreprise.id}/statut`, { statut });
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: "40px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Entreprises</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/dashboard">Commandes</Link>
          <button onClick={logout}>Déconnexion</button>
        </div>
      </div>

      <CreateEntrepriseForm onCreated={refresh} />

      <h2>Liste</h2>
      <table width="100%" cellPadding={6}>
        <thead>
          <tr>
            <th align="left">Nom</th>
            <th align="left">Email</th>
            <th align="left">Statut</th>
            <th align="left">Créée le</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {entreprises.map((e) => (
            <tr key={e.id}>
              <td>{e.nom}</td>
              <td>{e.email}</td>
              <td>{e.statut}</td>
              <td>{new Date(e.createdAt).toLocaleString()}</td>
              <td>
                <button disabled={busyId === e.id} onClick={() => toggleStatut(e)}>
                  {e.statut === "ACTIF" ? "Suspendre" : "Réactiver"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CreateEntrepriseForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nom: "",
    adresse: "",
    telephone: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post("/admin/entreprises", form);
      setForm({ email: "", password: "", nom: "", adresse: "", telephone: "" });
      onCreated();
    } catch {
      setError("Impossible de créer l'entreprise (email déjà utilisé ?)");
    } finally {
      setBusy(false);
    }
  }

  return (
    <fieldset>
      <legend>Nouvelle entreprise</legend>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
        <input
          placeholder="Nom de l'entreprise"
          value={form.nom}
          onChange={(e) => set("nom", e.target.value)}
          required
        />
        <input
          placeholder="Email (login)"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          required
        />
        <input
          placeholder="Mot de passe initial"
          type="password"
          minLength={8}
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          required
        />
        <input
          placeholder="Téléphone"
          value={form.telephone}
          onChange={(e) => set("telephone", e.target.value)}
        />
        <input
          placeholder="Adresse"
          value={form.adresse}
          onChange={(e) => set("adresse", e.target.value)}
          style={{ gridColumn: "1 / -1" }}
        />
        {error && <p style={{ color: "crimson", gridColumn: "1 / -1" }}>{error}</p>}
        <button type="submit" disabled={busy} style={{ gridColumn: "1 / -1" }}>
          {busy ? "Création..." : "Créer l'entreprise"}
        </button>
      </form>
    </fieldset>
  );
}
