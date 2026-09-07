import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api/client";
import { STATUTS } from "../api/types";
import type { Commande, Entreprise, StatutCommande } from "../api/types";
import { Navbar } from "../components/Navbar";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export function DashboardPage() {
  const { auth } = useAuth();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [selected, setSelected] = useState<Commande | null>(null);

  async function refresh() {
    const { data } = await api.get<Commande[]>("/commandes");
    setCommandes(data);
    if (selected) {
      setSelected(data.find((c) => c.id === selected.id) ?? null);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1>Commandes</h1>
            <p>{auth?.nom ? `${auth.nom} — ` : ""}créez et suivez vos livraisons</p>
          </div>
        </div>

        <CreateCommandeForm isAdmin={auth?.role === "admin"} onCreated={refresh} />

        <div className="card">
          <h2 className="card-title">Liste des commandes</h2>
          {commandes.length === 0 ? (
            <p className="helper-text">Aucune commande pour le moment.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tracking code</th>
                    <th>Client</th>
                    <th>Statut</th>
                    <th>Créée le</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {commandes.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{c.trackingCode}</td>
                      <td>{c.clientNom}</td>
                      <td>
                        <StatusBadge statut={c.statutActuel} />
                      </td>
                      <td className="helper-text">{new Date(c.createdAt).toLocaleString()}</td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => setSelected(c)}>
                          Gérer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && <CommandeDetail commande={selected} onUpdated={refresh} />}
      </div>
    </div>
  );
}

function CreateCommandeForm({
  isAdmin,
  onCreated,
}: {
  isAdmin: boolean;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    entrepriseId: "",
    clientNom: "",
    clientEmail: "",
    clientTelephone: "",
    pointDepart: "",
    pointLivraison: "",
    description: "",
    prix: "",
    delaiEstime: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);

  useEffect(() => {
    if (isAdmin) {
      api.get<Entreprise[]>("/admin/entreprises").then(({ data }) => setEntreprises(data));
    }
  }, [isAdmin]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post("/commandes", {
        ...form,
        entrepriseId: isAdmin ? form.entrepriseId : undefined,
        prix: Number(form.prix),
      });
      setForm({
        entrepriseId: "",
        clientNom: "",
        clientEmail: "",
        clientTelephone: "",
        pointDepart: "",
        pointLivraison: "",
        description: "",
        prix: "",
        delaiEstime: "",
      });
      onCreated();
    } catch {
      setError("Impossible de créer la commande — vérifiez les champs");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">Nouvelle commande</h2>
      <form onSubmit={onSubmit} className="form-grid">
        {isAdmin && (
          <div className="field">
            <label>Entreprise</label>
            <select
              className="input"
              value={form.entrepriseId}
              onChange={(e) => set("entrepriseId", e.target.value)}
              required
            >
              <option value="" disabled>
                Choisir une entreprise
              </option>
              {entreprises.map((ent) => (
                <option key={ent.id} value={ent.id}>
                  {ent.nom}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="field">
          <label>Nom du client</label>
          <input
            className="input"
            value={form.clientNom}
            onChange={(e) => set("clientNom", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Email du client</label>
          <input
            className="input"
            type="email"
            value={form.clientEmail}
            onChange={(e) => set("clientEmail", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Téléphone du client</label>
          <input
            className="input"
            value={form.clientTelephone}
            onChange={(e) => set("clientTelephone", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Point de départ</label>
          <input
            className="input"
            placeholder="Adresse ou ville"
            value={form.pointDepart}
            onChange={(e) => set("pointDepart", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Point de livraison</label>
          <input
            className="input"
            placeholder="Adresse ou ville"
            value={form.pointLivraison}
            onChange={(e) => set("pointLivraison", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Prix (€)</label>
          <input
            className="input"
            type="number"
            step="0.01"
            value={form.prix}
            onChange={(e) => set("prix", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Délai estimé</label>
          <input
            className="input"
            placeholder="ex: 3-5 jours"
            value={form.delaiEstime}
            onChange={(e) => set("delaiEstime", e.target.value)}
            required
          />
        </div>
        <div className="field span-2">
          <label>Description</label>
          <textarea
            className="input"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
          />
        </div>
        {error && <p className="form-error span-2">{error}</p>}
        <div className="span-2">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Création..." : "Créer la commande"}
          </button>
        </div>
      </form>
    </div>
  );
}

function CommandeDetail({ commande, onUpdated }: { commande: Commande; onUpdated: () => void }) {
  const [statut, setStatut] = useState<StatutCommande>(commande.statutActuel);
  const [message, setMessage] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [notifierClient, setNotifierClient] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post(`/commandes/${commande.id}/evenements`, {
        statut,
        message,
        localisation: localisation || undefined,
        notifierClient,
      });
      setMessage("");
      setLocalisation("");
      setNotifierClient(false);
      onUpdated();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h2>
            <span style={{ fontFamily: "monospace" }}>{commande.trackingCode}</span> —{" "}
            {commande.clientNom}
          </h2>
          <p>
            {commande.pointDepart} → {commande.pointLivraison}
          </p>
        </div>
        <StatusBadge statut={commande.statutActuel} />
      </div>

      <h3 style={{ marginBottom: 12 }}>Historique</h3>
      <ul className="timeline">
        {commande.evenements.map((ev, i) => (
          <li key={i} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-date">{new Date(ev.createdAt).toLocaleString()}</div>
              <StatusBadge statut={ev.statut} />
              <div className="timeline-message">
                {ev.message}
                {ev.notifie ? " · client notifié par email" : ""}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <h3 style={{ margin: "24px 0 12px" }}>Ajouter une mise à jour</h3>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="form-grid">
          <div className="field">
            <label>Statut</label>
            <select
              className="input"
              value={statut}
              onChange={(e) => setStatut(e.target.value as StatutCommande)}
            >
              {STATUTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Localisation (optionnel)</label>
            <input
              className="input"
              placeholder="ex: Centre de tri Lyon"
              value={localisation}
              onChange={(e) => setLocalisation(e.target.value)}
            />
          </div>
          <div className="field span-2">
            <label>Message</label>
            <input
              className="input"
              placeholder="ex: colis arrivé au centre de tri"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={notifierClient}
            onChange={(e) => setNotifierClient(e.target.checked)}
          />
          Notifier le client par email
        </label>
        <div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Envoi..." : "Ajouter la mise à jour"}
          </button>
        </div>
      </form>
    </div>
  );
}
