import { promises as fs } from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// On désactive le body parser par défaut de Next.js car Formidable va gérer le flux brut
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const form = new IncomingForm({
    keepExtensions: true, // Garde l’extension (.xlsx, etc.)
    multiples: false,     // On accepte un seul fichier
  });

  try {
    // On parse la requête pour récupérer les fichiers et les champs
    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const { fields, files } = data;

    // On récupère le JSON du champ textarea et on s’assure que c’est bien une string
    const jsonData = Array.isArray(fields.jsonData)
      ? fields.jsonData[0]
      : fields.jsonData;

    if (!files.file) {
      return res.status(400).json({ error: 'Aucun fichier reçu.' });
    }

    // On gère le cas où Formidable peut renvoyer un tableau ou un objet
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    const tempPath = uploadedFile.filepath; // Chemin temporaire
    const fileName = uploadedFile.originalFilename; // Nom d'origine du fichier

    if (!tempPath || !fileName) {
      return res.status(400).json({ error: 'Fichier ou chemin invalide.' });
    }

    // Dossier de destination
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true }); // Crée le dossier si besoin

    // Déplacement du fichier dans le dossier uploads
    const newFilePath = path.join(uploadDir, fileName);
    await fs.rename(tempPath, newFilePath);

    const relativeFilePath = `/uploads/${fileName}`;

    // Sauvegarde en base avec Prisma
    const uploadRecord = await prisma.upload.create({
      data: {
        filePath: relativeFilePath,
        jsonData: jsonData, // on envoie bien une string
      },
    });

    res.status(200).json({ message: 'Upload réussi', upload: uploadRecord });
  } catch (error) {
    console.error('Erreur dans l’upload :', error);
    res.status(500).json({ error: 'Erreur interne lors de l’upload.' });
  }
}
