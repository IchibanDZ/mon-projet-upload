
import { useEffect, useState } from "react";  
import { useSession } from "next-auth/react";  
import { useRouter } from "next/router";  
import Navbar from "../components/Navbar"; 

export default function MyUploads() {  
  const { data: session, status } = useSession();  // Récupération de la session utilisateur
  const [uploads, setUploads] = useState([]);  // État contenant les fichiers de l'utilisateur
  const [error, setError] = useState("");  
  const router = useRouter();  //redirige

  useEffect(() => {
    if (status === "loading") return;  // Ne rien faire tant que la session est en chargement
    if (!session) {
      router.push("/auth/signin");  // Redirection si l'utilisateur n'est pas connecté
      return;
    }
    const fetchMyUploads = async () => {  // Fonction pour récupérer les fichiers personnels
      const res = await fetch("/api/myuploads");  // Appel API
      if (res.ok) {
        const data = await res.json();
        setUploads(data);  // Stocke les fichiers dans l'état
      } else {
        setError("Impossible de récupérer vos fichiers. Êtes-vous connecté ?");
      }
    };
    fetchMyUploads();
  }, [session, status, router]);

  const handleDelete = async (id) => {  // Fonction pour supprimer un fichier
    const confirmed = confirm("Supprimer ce fichier ?");
    if (!confirmed) return;
    const res = await fetch(`/api/delete-upload/${id}`, { method: "DELETE" });  // Appel API suppression
    if (res.ok) {
      setUploads(uploads.filter((u) => u.id !== id));  // Mise à jour locale après suppression
    } else {
      alert("Échec de la suppression.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mes fichiers uploadés</h1>
        {error && <p className="text-red-500">{error}</p>}
        {uploads.length === 0 ? (
          <p>Aucun fichier trouvé.</p>
        ) : (
          <table className="table-auto w-full">
            <thead><tr>
                <th>Nom du fichier</th>
                <th>Date</th>
                <th>Action</th></tr>
            </thead>
            <tbody>{/* Parcourt la liste des uploads et crée une ligne pour chaque upload */}
              {uploads.map((upload) => ( 
                <tr key={upload.id}>
                  {/* Extraction et affichage du nom du fichier à partir du chemin complet */}
                  <td>{upload.filePath.split("/").pop()}</td>
                  <td>{new Date(upload.createdAt).toLocaleString()}</td> 
                  <td> 
                    <a href={upload.filePath} className="text-blue-600 mr-2">Voir</a>
                    <button onClick={() => handleDelete(upload.id)} 
                    className="text-red-600 py-4">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}