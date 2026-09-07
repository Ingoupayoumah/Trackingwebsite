export type StatutCommande =
  | "CREEE"
  | "EN_PREPARATION"
  | "EN_TRANSIT"
  | "EN_LIVRAISON"
  | "LIVREE"
  | "PROBLEME"
  | "ANNULEE";

export const STATUTS: StatutCommande[] = [
  "CREEE",
  "EN_PREPARATION",
  "EN_TRANSIT",
  "EN_LIVRAISON",
  "LIVREE",
  "PROBLEME",
  "ANNULEE",
];

export interface TrackingEvent {
  id?: string;
  statut: StatutCommande;
  message: string;
  localisation?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  notifie?: boolean;
  createdAt: string;
}

export interface Commande {
  id: string;
  trackingCode: string;
  entrepriseId: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone?: string | null;
  pointDepart: string;
  pointDepartLat?: number | null;
  pointDepartLng?: number | null;
  pointLivraison: string;
  pointLivraisonLat?: number | null;
  pointLivraisonLng?: number | null;
  description: string;
  prix: number;
  delaiEstime: string;
  statutActuel: StatutCommande;
  createdAt: string;
  evenements: TrackingEvent[];
}
