import { useState } from "react";
import type { FormEvent } from "react";
import { LandingLayout } from "../components/LandingLayout";

const CONTACT_EMAIL = "tracking@goldenpettransport.org";

export function ContactPage() {
  const [form, setForm] = useState({ nom: "", email: "", message: "" });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Demande de devis — ${form.nom || "site web"}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.nom} (${form.email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <LandingLayout>
      <div className="section" style={{ paddingTop: 64 }}>
        <div className="section-header">
          <span className="eyebrow">Contact</span>
          <h2>Parlons de votre envoi</h2>
          <p>Une question, un devis à demander ? Notre équipe vous répond rapidement.</p>
        </div>

        <div className="contact-grid" style={{ maxWidth: 720, margin: "0 auto 32px" }}>
          <div className="card">
            <h4 style={{ marginBottom: 6 }}>📍 Adresse</h4>
            <p className="helper-text">Strasbourg, France</p>
          </div>
          <div className="card">
            <h4 style={{ marginBottom: 6 }}>✉️ Email</h4>
            <p className="helper-text">{CONTACT_EMAIL}</p>
          </div>
        </div>

        <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <h3 className="card-title">Demander un devis</h3>
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label>Nom</label>
              <input
                className="input"
                value={form.nom}
                onChange={(e) => set("nom", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea
                className="input"
                rows={4}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Décrivez votre besoin : point de départ, point de livraison, type de colis..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Envoyer
            </button>
            <p className="helper-text" style={{ textAlign: "center" }}>
              Ouvre votre messagerie avec le message pré-rempli, à destination de {CONTACT_EMAIL}.
            </p>
          </form>
        </div>
      </div>
    </LandingLayout>
  );
}
