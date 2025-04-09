import NextAuth from "next-auth";  // Importe la fonction principale de configuration NextAuth
import CredentialsProvider from "next-auth/providers/credentials";  // Provider pour authentification par identifiants (email + mot de passe)
import prisma from "../../../lib/prisma";  // Importe Prisma pour interagir avec la base de données
import bcrypt from "bcryptjs";  // Utilisé pour comparer les mots de passe hashés

export const authOptions = {  // Déclaration de l'objet de configuration de NextAuth
  providers: [  // Définition des méthodes d'authentification disponibles
    CredentialsProvider({  // Utilisation du provider "credentials"
      name: "Credentials",  // Nom affiché du provider 
      credentials: {  // Déclaration des champs du formulaire de connexion
        email: { label: "Email", type: "email" },  // Champ email
        password: { label: "Password", type: "password" },  // Champ mot de passe
      },
      async authorize(credentials) {  // Fonction de vérification des identifiants côté serveur
        const user = await prisma.user.findUnique({  // Recherche de l'utilisateur par email dans la base
          where: { email: credentials.email },  // Critère : email tapé par l'utilisateur
        });
        if (!user) return null;  // Si aucun utilisateur n'est trouvé, retour null → échec connexion

        const isValid = await bcrypt.compare(credentials.password, user.password);  // Compare le mot de passe tapé au hash stocké
        if (!isValid) return null;  // Si le mot de passe est invalide, retour null

        return { id: user.id, email: user.email, role: user.role };  // Retourne un objet avec les infos de l'utilisateur
      },
    }),
  ],
  callbacks: {  // Callbacks pour personnaliser le comportement de la session et du token JWT
    async session({ session, token }) {  // Callback exécuté quand la session est créée ou accédée
      if (token) {
        session.user.id = token.sub;  // Ajoute l'ID utilisateur à la session depuis le token
        session.user.role = token.role;  // Ajoute le rôle utilisateur à la session depuis le token
      }
      return session;  // Retourne la session enrichie
    },
    async jwt({ token, user }) {  // Callback exécuté à la création/mise à jour du token JWT
      if (user) {
        token.role = user.role;  // si utilisateur auth ajoute le rôle de l'utilisateur dans le token JWT
      }
      return token;  // Retourne le token enrichi
    },
  },
  pages: {
    signIn: "/auth/signin",  // Spécifie la page personnalisée de connexion
  },
  secret: process.env.NEXTAUTH_SECRET,  // Clé secrète pour signer le token et sécuriser les sessions
};

export default NextAuth(authOptions);  // Exporte la configuration pour être utilisée par NextAuth
