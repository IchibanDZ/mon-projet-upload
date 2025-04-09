// pages/mentions-legales.js
import React from "react";
import Navbar from "../components/Navbar"; // Assure-toi que ce composant existe
import Footer from "../components/Footer"; // Facultatif, si tu souhaites aussi afficher un footer

export default function MentionsLegales() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-lg shadow-lg max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-8 text-black">
            Mentions Légales
          </h1>
          <p className="text-lg text-black mb-6">
            <strong>Éditeur du site :</strong>
            <br />
            Nom de l'entreprise : Votre Société SARL
            <br />
            Siège social : 123 Rue Exemple, 75000 Paris, France
            <br />
            Numéro de SIRET : 000 000 000 00000
            <br />
            Représentée par : Monsieur/Madame X, en qualité de Directeur/Directrice
          </p>
          <p className="text-lg text-black mb-6">
            <strong>Directeur de la publication :</strong> Monsieur/Madame X
          </p>
          <p className="text-lg text-black mb-6">
            <strong>Hébergeur :</strong>
            <br />
            Nom de l'hébergeur : Hébergeur Exemplar
            <br />
            Adresse : 456 Rue Hébergeur, 75000 Paris, France
            <br />
            Téléphone : 01 23 45 67 89
          </p>
          <p className="text-lg text-black mb-6">
            <strong>Contact :</strong>
            <br />
            Email : contact@votresociete.fr
            <br />
            Téléphone : 01 23 45 67 89
          </p>
          <p className="text-lg text-black mb-6">
            <strong>Conditions d'utilisation :</strong>
            <br />
            L'utilisation de ce site est soumise aux présentes mentions légales.
            Tout accès et/ou utilisation de ce site implique l'acceptation intégrale
            et sans réserve des conditions décrites ci-dessous. Votre Société se
            réserve le droit de modifier, à tout moment et sans préavis, ces
            conditions d'utilisation. Les contenus présents sur ce site sont
            protégés par le droit de la propriété intellectuelle. Toute
            reproduction, totale ou partielle, sans autorisation écrite préalable,
            est strictement interdite.
          </p>
          <p className="text-lg text-black mb-6">
            <strong>Données personnelles :</strong>
            <br />
            Conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique,
            aux fichiers et aux libertés, vous disposez d'un droit d'accès, de
            rectification et de suppression des données vous concernant. Pour
            exercer ce droit, merci de nous contacter à l'adresse : contact@votresociete.fr.
          </p>
          <p className="text-lg text-black">
            <strong>Responsabilité :</strong>
            <br />
            Votre Société ne saurait être tenue pour responsable des erreurs, d'une
            absence de disponibilité des informations et/ou de la transmission des
            informations contenues sur son site, et des éventuelles conséquences de
            leur utilisation. Les liens hypertextes présents sur ce site en direction
            d'autres sites ne sauraient engager la responsabilité de Votre Société.
          </p>
        </div>
      </div>
    </div>
  );
}
