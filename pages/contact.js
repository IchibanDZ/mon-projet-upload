import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Contact() {
  const [messageEnvoye, setMessageEnvoye] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajoutez ici votre logique d'envoi du formulaire (via fetch ou autre)
    console.log("Formulaire soumis !");
    setMessageEnvoye(true);
  };

  return (<div><Navbar/>
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contactez-nous</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nom :</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Votre nom"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email :</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Votre email"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Message :</label>
          <textarea
            className="w-full border p-2 rounded"
            rows="6"
            placeholder="Votre message"
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Envoyer
        </button>
      </form>
      {messageEnvoye && (
        <p className="mt-4 text-green-600">
          Votre message a bien été envoyé !
        </p>
      )}
      {}
    </div></div>
  );
}
