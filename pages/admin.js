import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [uploads, setUploads] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }
    const fetchUploads = async () => {
      const res = await fetch("/api/all-uploads");
      const data = await res.json();
      setUploads(data);
    };
    fetchUploads();
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  // Fonction pour filtrer les données
  const filteredUploads = uploads.filter(
    (upload) =>
      upload.filePath.toLowerCase().includes(search.toLowerCase()) ||
      upload.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar /><div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard Admin</h1>
        <input
          type="text"
          placeholder="Rechercher par nom de fichier ou email..."
          value={search}// Liaison de l'input avec le state 'search' et mise à jour en temps réel avec la valeur saisie.
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded mb-4 w-full max-w-md mx-auto block"
        /><div className="overflow-x-auto">
          <table className="w-full border-collapse border text-sm md:text-base">
            <thead>
              <tr><th className="border p-2">Nom du fichier</th>
                <th className="border p-2">Utilisateur</th>
                <th className="border p-2">Date d'upload</th>
                <th className="border p-2">Lien</th></tr>
            </thead>
            <tbody>{/* Parcours de la liste filtrée des uploads pour générer une ligne par upload */}
              {filteredUploads.map((upload) => (
                <tr key={upload.id}>
                  <td className="border p-2">
                    {upload.filePath.split("/").pop()}
                  </td>{/* Affichage de l'email de l'utilisateur associé à l'upload */}
                  <td className="border p-2">{upload.user.email}</td>
                  <td className="border p-2">
                    {new Date(upload.createdAt).toLocaleString()}
                  </td>
                  <td className="border p-2">{/* Lien permettant d'ouvrir le fichier dans un nouvel onglet */}
                    <a href={upload.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline">Voir le fichier
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
