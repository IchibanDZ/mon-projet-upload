import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";  // On importe l'authOptions directement

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Méthode non autorisée" });

  const session = await getServerSession(req, res, authOptions);
  console.log("Session dans myuploads :", session);

  if (!session || !session.user.id) return res.status(401).json({ message: "Non autorisé" });

  try {
    const uploads = await prisma.upload.findMany({
      where: { userId: parseInt(session.user.id) },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(uploads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
