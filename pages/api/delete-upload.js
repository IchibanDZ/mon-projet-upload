import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.id) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  const { id } = req.query;

  try {
    const upload = await prisma.upload.findUnique({ where: { id: parseInt(id) } });

    if (!upload || upload.userId !== parseInt(session.user.id)) {
      return res.status(403).json({ message: "Vous n'avez pas le droit de supprimer ce fichier." });
    }

    // Supprimer le fichier physique (optionnel)
    const filePath = path.join(process.cwd(), "public", upload.filePath);
    await fs.unlink(filePath).catch((err) => {
      console.warn("Fichier déjà supprimé ou introuvable :", err.message);
    });

    // Supprimer la ligne dans la base
    await prisma.upload.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "Fichier supprimé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
}
