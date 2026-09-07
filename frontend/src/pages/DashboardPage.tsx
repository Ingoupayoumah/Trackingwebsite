import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api/client";
import { STATUTS } from "../api/types";
import type { Commande, StatutCommande } from "../api/types";
import { useAuth } from "../context/AuthContext";

export function DashboardPage() {
  const { auth, logout } = useAuth();
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
    <div style={{ maxWidth: 960, margin: "40px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Commandes {auth?.nom ? `— ${auth.nom}` : ""}</h1>
        <button onClick={logout}>Déconnexion</button>
      </div>

      <CreateCommandeForm isAdmin={auth?.role === "admin"} onCreated={refresh} />

      <h2>Liste</h2>
      <table width="100%" cellPadding={6}>
        <thead>
          <tr>
            <th align="left">Tracking code</th>
            <th align="left">Client</th>
            <th align="left">Statut</th>
            <th align="left">Créée le</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {commandes.map((c) => (
            <tr key={c.id}>
              <td>{c.trackingCode}</td>
              <td>{c.clientNom}</td>
              <td>{c.statutActuel}</td>
              <td>{new Date(c.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => setSelected(c)}>Gérer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && <CommandeDetail commande={selected} onUpdated={refresh} />}
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
    <fieldset>
      <legend>Nouvelle commande</legend>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
        {isAdmin && (
          <input
            placeholder="ID entreprise"
            value={form.entrepriseId}
            onChange={(e) => set("entrepriseId", e.target.value)}
            required
          />
        )}
        <input
          placeholder="Nom du client"
          value={form.clientNom}
          onChange={(e) => set("clientNom", e.target.value)}
          required
        />
        <input
          placeholder="Email du client"
          type="email"
          value={form.clientEmail}
          onChange={(e) => set("clientEmail", e.target.value)}
          required
        />
        <input
          placeholder="Téléphone du client"
          value={form.clientTelephone}
          onChange={(e) => set("clientTelephone", e.target.value)}
        />
        <input
          placeholder="Point de départ (adresse)"
          value={form.pointDepart}
          onChange={(e) => set("pointDepart", e.target.value)}
          required
        />
        <input
          placeholder="Point de livraison (adresse)"
          value={form.pointLivraison}
          onChange={(e) => set("pointLivraison", e.target.value)}
          required
        />
        <input
          placeholder="Prix"
          type="number"
          step="0.01"
          value={form.prix}
          onChange={(e) => set("prix", e.target.value)}
          required
        />
        <input
          placeholder="Délai estimé (ex: 3-5 jours)"
          value={form.delaiEstime}
          onChange={(e) => set("delaiEstime", e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          required
          style={{ gridColumn: "1 / -1" }}
        />
        {error && <p style={{ color: "crimson", gridColumn: "1 / -1" }}>{error}</p>}
        <button type="submit" disabled={busy} style={{ gridColumn: "1 / -1" }}>
          {busy ? "Création..." : "Créer la commande"}
        </button>
      </form>
    </fieldset>
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
    <div style={{ border: "1px solid #ccc", padding: 16, marginTop: 16 }}>
      <h3>
        {commande.trackingCode} — {commande.clientNom}
      </h3>
      <p>
        {commande.pointDepart} → {commande.pointLivraison}
      </p>

      <h4>Historique</h4>
      <ul>
        {commande.evenements.map((ev, i) => (
          <li key={i}>
            {new Date(ev.createdAt).toLocaleString()} — <strong>{ev.statut}</strong> : {ev.message}
            {ev.notifie ? " (client notifié)" : ""}
          </li>
        ))}
      </ul>

      <h4>Ajouter une mise à jour</h4>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <select value={statut} onChange={(e) => setStatut(e.target.value as StatutCommande)}>
          {STATUTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          placeholder="Message (ex: colis arrivé au centre de tri)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <input
          placeholder="Localisation (adresse ou ville, optionnel)"
          value={localisation}
          onChange={(e) => setLocalisation(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={notifierClient}
            onChange={(e) => setNotifierClient(e.target.checked)}
          />{" "}
          Notifier le client par email
        </label>
        <button type="submit" disabled={busy}>
          {busy ? "Envoi..." : "Ajouter la mise à jour"}
        </button>
      </form>
    </div>
  );
}
