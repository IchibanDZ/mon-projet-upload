import { promises as fs } from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";  // Utilisation de prisma depuis lib/prisma

export const config = {
  api: {
    bodyParser: false, // Désactive le bodyParser pour permettre à formidable de gérer la requête
  },
};
export default async function handler(req, res) {
  // Récupère la session de l'utilisateur et vérifie son authentification
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Vérifie que la méthode HTTP utilisée est POST
  if (req.method === 'POST') {
    // Crée une instance de IncomingForm pour gérer l'upload de fichiers
    const form = new IncomingForm();
    // Configure le répertoire de destination
    form.uploadDir = path.join(process.cwd(), 'public/uploads');
    // Active l'option pour conserver l'extension originale du fichier(format)
    form.keepExtensions = true;
    // extraire les champs du form et les fichiers uploadés
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({ message: "Error during file upload." });
      }
      console.log("Files received:", files);
    // Vérifie la présence du fichier dans le champ 'file' et sélectionne le premier fichier en cas de multiples fichiers
      const file = files.file ? files.file[0] : null;
      if (!file) {
        return res.status(400).json({ message: "File not found" });
      }
      // Extrait le nom original du fichier uploadé
      const fileName = file.originalFilename;
      if (!fileName) {
        return res.status(400).json({ message: "File name is missing" });
      }
      // Construit le chemin relatif du fichier
      const relativeFilePath = `/uploads/${fileName}`;
      // Vérifie si "jsonData" est une chaîne, sinon, le convertit en chaîne JSON
      const jsonData = typeof fields.jsonData === "string" ? fields.jsonData : JSON.stringify(fields.jsonData);
      if (!jsonData) {
        return res.status(400).json({ message: "JSON data is missing or invalid." });
      }
       // Convertit l'ID de l'utilisateur récupéré de la session en entier
      const userId = parseInt(session.user.id, 10);
      try {
        // Crée un nouvel enregistrement dans la table Upload avec Prisma
        const upload = await prisma.upload.create({
          data: {
            filePath: relativeFilePath,
            jsonData: jsonData,
            userId: userId,
          },
        });
        return res.status(200).json({ message: "File uploaded successfully!", upload });
      } catch (error) {
        console.error("Error during database save:", error);
        return res.status(500).json({ message: "Error during database save." });
      }
    });
  } else {
    // Si la méthode HTTP n'est pas POST, renvoie une réponse 405 (Méthode non autorisée)
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
