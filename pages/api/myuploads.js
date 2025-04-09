// pages/api/myuploads.js
import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import { authOptions } from "./auth/[...nextauth]";  // Assurez-vous que l'importation de authOptions fonctionne

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Méthode non autorisée" });

  // Vérifier la session
  const session = await getServerSession(req, res, authOptions);
  console.log("Session dans myuploads :", session);

  // Vérifier si la session existe et si l'utilisateur est authentifié
  if (!session || !session.user.id) return res.status(401).json({ message: "Non autorisé" });

  try {
    // Récupérer les uploads de l'utilisateur connecté
    const uploads = await prisma.upload.findMany({
      where: { userId: parseInt(session.user.id) }, // Utiliser l'ID de l'utilisateur de la session
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(uploads); // Réponse avec la liste des fichiers uploadés
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
