import { LandingLayout } from "../components/LandingLayout";

export function PrivacyPolicyPage() {
  return (
    <LandingLayout>
      <div className="legal-content">
        <h1>Politique de confidentialité</h1>
        <span className="updated-at">Dernière mise à jour : 7 septembre 2026</span>

        <p>
          Golden Pet Transport (« nous ») accorde une importance particulière à la protection
          des données personnelles des utilisateurs de son service de transport et de suivi de
          colis. Cette politique explique quelles données nous traitons, pourquoi, et quels sont
          vos droits, conformément au Règlement Général sur la Protection des Données (RGPD –
          Règlement (UE) 2016/679) et à la loi Informatique et Libertés.
        </p>

        <h2>1. Responsable du traitement</h2>
        <p>
          Golden Pet Transport, Strasbourg, France — contact :{" "}
          <a href="mailto:tracking@goldenpettransport.org">tracking@goldenpettransport.org</a>.
        </p>

        <h2>2. Données que nous collectons</h2>
        <ul>
          <li>
            <strong>Données du destinataire d'un colis</strong> : nom, adresse email, numéro de
            téléphone (facultatif), adresses de départ et de livraison — transmises par
            l'entreprise de transport qui crée la commande.
          </li>
          <li>
            <strong>Données de suivi</strong> : statut et localisation approximative du colis à
            chaque étape du trajet, horodatage.
          </li>
          <li>
            <strong>Comptes entreprise / administrateur</strong> : email professionnel et mot de
            passe (stocké de façon chiffrée, jamais en clair).
          </li>
          <li>
            <strong>Données techniques</strong> : adresse IP et informations de session,
            uniquement à des fins de sécurité (protection contre les abus sur l'accès au suivi).
          </li>
        </ul>

        <h2>3. Pourquoi nous traitons ces données</h2>
        <ul>
          <li>Organiser et exécuter le transport de votre colis (exécution du contrat).</li>
          <li>Vous permettre de suivre votre colis en temps réel.</li>
          <li>Vous informer par email des changements de statut de votre commande.</li>
          <li>Assurer la sécurité du service (empêcher les accès non autorisés au suivi).</li>
        </ul>

        <h2>4. Base légale</h2>
        <p>
          Le traitement repose sur l'exécution du contrat de transport (art. 6.1.b du RGPD) pour
          les données du destinataire et le suivi, et sur notre intérêt légitime à sécuriser le
          service pour les données techniques.
        </p>

        <h2>5. Destinataires des données</h2>
        <p>
          Vos données sont accessibles à l'entreprise de transport ayant créé la commande et à
          Golden Pet Transport. Elles peuvent également être transmises à nos sous-traitants
          techniques, limités à ce qui est nécessaire au fonctionnement du service :
        </p>
        <ul>
          <li>Un prestataire d'envoi d'emails transactionnels, pour les notifications de suivi.</li>
          <li>
            Un service de géocodage d'adresses (OpenStreetMap / Nominatim), pour positionner les
            étapes du trajet sur une carte.
          </li>
        </ul>
        <p>Nous ne vendons ni ne louons vos données à des tiers à des fins commerciales.</p>

        <h2>6. Durée de conservation</h2>
        <p>
          Les données liées à une commande sont conservées le temps nécessaire à l'exécution du
          transport, puis archivées pendant la durée requise par nos obligations comptables et
          légales, avant suppression ou anonymisation.
        </p>

        <h2>7. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants sur vos données :</p>
        <ul>
          <li>Droit d'accès et de rectification</li>
          <li>Droit à l'effacement (« droit à l'oubli »)</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit d'opposition</li>
          <li>Droit à la portabilité des données</li>
        </ul>
        <p>
          Pour exercer l'un de ces droits, contactez-nous à{" "}
          <a href="mailto:tracking@goldenpettransport.org">tracking@goldenpettransport.org</a>.
          Vous disposez également du droit d'introduire une réclamation auprès de la CNIL
          (www.cnil.fr) si vous estimez que vos droits ne sont pas respectés.
        </p>

        <h2>8. Cookies et traceurs</h2>
        <p>
          Le suivi public d'un colis utilise un cookie de session technique (strictement
          nécessaire) pour éviter de redemander votre email à chaque page. Ce cookie n'est pas
          utilisé à des fins publicitaires ou de suivi marketing et ne nécessite pas de
          consentement au titre de l'exemption « cookies strictement nécessaires ».
        </p>

        <h2>9. Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures techniques raisonnables pour protéger vos données :
          mots de passe chiffrés, accès au suivi limité par une double vérification (code de
          suivi + email), et limitation du nombre de tentatives pour empêcher les abus.
        </p>

        <h2>10. Contact</h2>
        <p>
          Pour toute question relative à cette politique ou à vos données personnelles :{" "}
          <a href="mailto:tracking@goldenpettransport.org">tracking@goldenpettransport.org</a>.
        </p>
      </div>
    </LandingLayout>
  );
}
