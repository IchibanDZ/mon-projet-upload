import prisma from "../../../lib/prisma"; 
import { getServerSession } from "next-auth/next"; // Importation de getServerSession pour récupérer la session côté serveur via NextAuth
import { authOptions } from "../auth/[...nextauth]"; // Importation des options d'authentification configurées dans NextAuth
import fs from "fs/promises"; // Utilisation du module fs avec promises pour manipuler le système de fichiers de façon asynchrone
import path from "path"; /

export default async function handler(req, res) {
  // Vérifie que la requête utilise la méthode DELETE
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  // Récupère la session utilisateur pour vérifier l'authentification et obtenir les informations de l'utilisateur
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.id) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  // Extrait l'ID de l'upload à supprimer depuis les paramètres de la requête (req.query)
  const { id } = req.query;

  try {
    // Recherche l'upload correspondant à l'ID fourni dans la base de données
    const upload = await prisma.upload.findUnique({ where: { id: parseInt(id) } });

    // Vérifie que l'upload existe et que l'utilisateur connecté en est bien le propriétaire
    if (!upload || upload.userId !== parseInt(session.user.id)) {
      return res.status(403).json({ message: "Vous n'avez pas le droit de supprimer ce fichier." });
    }

    // Construit le chemin absolu du fichier sur le serveur
    const filePath = path.join(process.cwd(), "public", upload.filePath);
    // Tente de supprimer le fichier physique; en cas d'erreur (par exemple, fichier déjà supprimé), un avertissement est logué
    await fs.unlink(filePath).catch((err) => {
      console.warn("Fichier déjà supprimé ou introuvable :", err.message);
    });

    // Supprime l'enregistrement de l'upload dans la base de données via Prisma
    await prisma.upload.delete({ where: { id: parseInt(id) } });

    // Renvoie une réponse 200 indiquant que la suppression a réussi
    res.status(200).json({ message: "Fichier supprimé avec succès." });
  } catch (error) {
    // En cas d'erreur inattendue, log l'erreur et renvoie une réponse 500 (Erreur serveur)
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
}
