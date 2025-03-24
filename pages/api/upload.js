import { promises as fs } from "fs";
import path from "path";
import { IncomingForm } from "formidable";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// On déclare authOptions directement ici
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return { id: user.id.toString(), email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "mon_secret_tres_simple",
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  // On récupère la session directement avec l'authOptions local
  const session = await getServerSession(req, res, authOptions);
  console.log("Session récupérée :", session);

  if (!session || !session.user.id) {
    return res.status(401).json({ message: "Utilisateur non connecté" });
  }

  const userId = parseInt(session.user.id);
  console.log("User ID utilisé pour l'upload :", userId);

  const form = new IncomingForm({ keepExtensions: true, multiples: false });

  try {
    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const { fields, files } = data;
    const jsonData = Array.isArray(fields.jsonData)
      ? fields.jsonData[0]
      : fields.jsonData;

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    const tempPath = uploadedFile.filepath;
    const fileName = uploadedFile.originalFilename;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const newFilePath = path.join(uploadDir, fileName);
    await fs.rename(tempPath, newFilePath);

    const relativeFilePath = `/uploads/${fileName}`;

    const uploadRecord = await prisma.upload.create({
      data: {
        filePath: relativeFilePath,
        jsonData: jsonData,
        user: { connect: { id: userId } },
      },
    });

    res.status(200).json({ message: "Upload réussi", upload: uploadRecord });
  } catch (error) {
    console.error("Erreur lors de l’upload :", error);
    res.status(500).json({ error: "Erreur lors de l’upload" });
  }
}
