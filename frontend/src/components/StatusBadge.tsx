import type { StatutCommande } from "../api/types";

const CONFIG: Record<StatutCommande, { label: string; className: string }> = {
  CREEE: { label: "Créée", className: "badge-neutral" },
  EN_PREPARATION: { label: "En préparation", className: "badge-info" },
  COLISAGE: { label: "Colisage", className: "badge-info" },
  CHARGEMENT: { label: "Chargement", className: "badge-info" },
  EN_TRANSIT: { label: "En transit", className: "badge-primary" },
  EN_ARRET: { label: "En arrêt", className: "badge-danger" },
  EN_LIVRAISON: { label: "En livraison", className: "badge-primary" },
  LIVREE: { label: "Livrée", className: "badge-success" },
  PROBLEME: { label: "Problème", className: "badge-danger" },
  ANNULEE: { label: "Annulée", className: "badge-danger" },
};

export function StatusBadge({ statut }: { statut: StatutCommande }) {
  const config = CONFIG[statut];
  return <span className={`badge ${config.className}`}>{config.label}</span>;
}

export const STATUT_LABELS: Record<StatutCommande, string> = Object.fromEntries(
  Object.entries(CONFIG).map(([statut, c]) => [statut, c.label])
) as Record<StatutCommande, string>;
