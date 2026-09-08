import { LandingLayout } from "../components/LandingLayout";
import { useSeo } from "../hooks/useSeo";

export function LegalNoticePage() {
  useSeo(
    "Mentions légales — Golden Pet Transport",
    "Mentions légales de Golden Pet Transport : éditeur du site, hébergement, propriété intellectuelle."
  );

  return (
    <LandingLayout>
      <div className="legal-content">
        <h1>Mentions légales</h1>
        <span className="updated-at">Dernière mise à jour : 7 septembre 2026</span>

        <p style={{ background: "var(--color-warning-bg)", color: "var(--color-warning)", padding: 14, borderRadius: "var(--radius-md)", fontWeight: 600 }}>
          ⚠️ Les informations d'immatriculation ci-dessous (forme juridique, SIRET, RCS) sont des
          exemples à compléter avec les données réelles de l'entreprise avant la mise en ligne du
          site, conformément à la loi n°2004-575 du 21 juin 2004 (LCEN).
        </p>

        <h2>Éditeur du site</h2>
        <ul>
          <li>Raison sociale : Golden Pet Transport</li>
          <li>Forme juridique : [à compléter — ex. SASU, EURL...]</li>
          <li>Siège social : Strasbourg, France</li>
          <li>SIRET : [à compléter]</li>
          <li>RCS : [à compléter]</li>
          <li>
            Email :{" "}
            <a href="mailto:tracking@goldenpettransport.org">tracking@goldenpettransport.org</a>
          </li>
          <li>Directeur de la publication : [à compléter]</li>
        </ul>

        <h2>Hébergement</h2>
        <p>
          Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus présents sur ce site (textes, logos, mise en page) sont la
          propriété de Golden Pet Transport, sauf mention contraire, et ne peuvent être reproduits
          sans autorisation préalable.
        </p>

        <h2>Données personnelles</h2>
        <p>
          Le traitement des données personnelles collectées via ce site est décrit dans notre{" "}
          <a href="/politique-de-confidentialite">politique de confidentialité</a>.
        </p>

        <h2>Contact</h2>
        <p>
          Pour toute question relative à ces mentions légales :{" "}
          <a href="mailto:tracking@goldenpettransport.org">tracking@goldenpettransport.org</a>.
        </p>
      </div>
    </LandingLayout>
  );
}
