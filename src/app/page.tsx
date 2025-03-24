"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !jsonData) {
      setMessage("Veuillez fournir un fichier et le JSON.");
      return;
    }

    // Préparer les données à envoyer via FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("jsonData", jsonData);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Upload réussi !");
      } else {
        setMessage("Erreur lors de l'upload.");
      }
    } catch (error) {
      console.error("Erreur : ", error);
      setMessage("Erreur lors de l'upload.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Uploader ton fichier Excel et JSON de structure
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">
            Fichier Excel (VentesAgence.xlsx) :
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) =>
              setFile(e.target.files ? e.target.files[0] : null)
            }
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            JSON de structure :
          </label>
          <textarea
            rows={8}
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder={`{
  "code_facture": "",
  "date_facture": "",
  "code_client": "",
  "montant": ""
}`}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Envoyer
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
