import { PrismaClient } from "@prisma/client"; //récupére tous les uploads avec les inf util.

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const uploads = await prisma.upload.findMany({
      include: { user: true }, // inclut l'utilisateur associé
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(uploads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
