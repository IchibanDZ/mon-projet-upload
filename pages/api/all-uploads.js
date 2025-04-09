import prisma from "../../lib/prisma";  // ORM pour interagir avec la base de données
import { getServerSession } from "next-auth/next";  // Fonction NextAuth pour récupérer la session côté serveur
import { authOptions } from "./auth/[...nextauth]";  // Configuration NextAuth

export default async function handler(req, res) {  // Fonction handler API route
  const session = await getServerSession(req, res, authOptions);  // Récupère la session active

  if (!session || session.user.role !== "ADMIN") {  // Vérifie que l'utilisateur est un admin
    return res.status(403).json({ message: "Accès refusé" });  // Refus si non-admin
  }

  try {
    const uploads = await prisma.upload.findMany({  // Récupère tous les fichiers depuis la base
      include: {
        user: {
          select: {
            email: true,  // Inclut uniquement l'email de l'utilisateur associé
          },
        },
      },
      orderBy: {
        createdAt: "desc",  // Trie du plus récent au plus ancien
      },
    });

    res.status(200).json(uploads);  // Renvoie la liste des fichiers
  } catch (error) {
    console.error(error);  // Log l'erreur serveur
    res.status(500).json({ message: "Erreur serveur" });  // Réponse d'erreur générique
  }
}
