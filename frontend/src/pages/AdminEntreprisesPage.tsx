import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api/client";
import type { Entreprise } from "../api/types";
import { Navbar } from "../components/Navbar";

export function AdminEntreprisesPage() {
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
    <div className="page">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1>Entreprises</h1>
            <p>Gère les comptes des entreprises de transport</p>
          </div>
        </div>

        <CreateEntrepriseForm onCreated={refresh} />

        <div className="card">
          <h2 className="card-title">Liste des entreprises</h2>
          {entreprises.length === 0 ? (
            <p className="helper-text">Aucune entreprise pour le moment.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Statut</th>
                    <th>Créée le</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {entreprises.map((e) => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 600 }}>{e.nom}</td>
                      <td>{e.email}</td>
                      <td>
                        <span className={`badge ${e.statut === "ACTIF" ? "badge-success" : "badge-danger"}`}>
                          {e.statut === "ACTIF" ? "Actif" : "Suspendu"}
                        </span>
                      </td>
                      <td className="helper-text">{new Date(e.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${e.statut === "ACTIF" ? "btn-danger-outline" : "btn-outline"}`}
                          disabled={busyId === e.id}
                          onClick={() => toggleStatut(e)}
                        >
                          {e.statut === "ACTIF" ? "Suspendre" : "Réactiver"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
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
    <div className="card">
      <h2 className="card-title">Nouvelle entreprise</h2>
      <form onSubmit={onSubmit} className="form-grid">
        <div className="field">
          <label>Nom de l'entreprise</label>
          <input
            className="input"
            value={form.nom}
            onChange={(e) => set("nom", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Email (login)</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Mot de passe initial</label>
          <input
            className="input"
            type="password"
            minLength={8}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Téléphone</label>
          <input
            className="input"
            value={form.telephone}
            onChange={(e) => set("telephone", e.target.value)}
          />
        </div>
        <div className="field span-2">
          <label>Adresse</label>
          <input
            className="input"
            value={form.adresse}
            onChange={(e) => set("adresse", e.target.value)}
          />
        </div>
        {error && <p className="form-error span-2">{error}</p>}
        <div className="span-2">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Création..." : "Créer l'entreprise"}
          </button>
        </div>
      </form>
    </div>
  );
}
