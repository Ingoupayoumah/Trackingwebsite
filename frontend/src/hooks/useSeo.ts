import { useEffect } from "react";

// SPA côté client : pas de rendu serveur, donc pas de meta par route au
// premier chargement. On met à jour title/description dès le montage de
// chaque page, ce qui reste utile pour l'onglet, le partage, et les moteurs
// de recherche modernes qui exécutent le JS avant d'indexer.
export function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute("content", description);
  }, [title, description]);
}
