import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar"; // On importe la Navbar

export default function MyUploads() {
  const { data: session, status } = useSession();
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin"); // redirection si non connecté
      return;
    }
    const fetchMyUploads = async () => {
      const res = await fetch("/api/myuploads");
      if (res.ok) {
        const data = await res.json();
        setUploads(data);
      } else {
        setError("Impossible de récupérer vos fichiers. Êtes-vous connecté ?");
      }
    };
    fetchMyUploads();
  }, [session, status, router]);

  // Fonction suppression de fichier
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Es-tu sûr de vouloir supprimer ce fichier ?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/delete-upload?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Fichier supprimé !");
      setUploads(uploads.filter((u) => u.id !== id));
    } else {
      alert("Erreur lors de la suppression.");
    }
  };

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <Navbar /> {/* Ajout de la barre de menu */}
      <div className="container mx-auto p-4">
  <h1 className="text-2xl font-bold mb-4">Mes fichiers uploadés</h1>
  {uploads.length === 0 && <p>Aucun fichier trouvé.</p>}
  {Array.isArray(uploads) && (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Nom du fichier</th>
            <th className="border p-2">Télécharger</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((upload) => (
            <tr key={upload.id}>
              <td className="border p-2">
                {upload.filePath.split("/").pop()}
              </td>
              <td className="border p-2">
                <a
                  href={upload.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Télécharger
                </a>
              </td>
              <td className="border p-2">
                {new Date(upload.createdAt).toLocaleString()}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(upload.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

    </>
  );
}

