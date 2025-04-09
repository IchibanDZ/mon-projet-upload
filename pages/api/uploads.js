
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  //Vérification de la méthode HTTP
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const uploads = await prisma.upload.findMany({
      include: { user: true }, // inclut les informations de  l'utilisateur associé pour chaque upload
      orderBy: { createdAt: "desc" },// trie les uploads de maniére décroissante 
    });
    res.status(200).json(uploads);// affiche dynamiquement les uploads
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
