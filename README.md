Mon Projet Upload

➡️ Objectif

Créer une application web Next.js permettant l'upload de fichiers Excel, la sauvegarde d'un JSON associé, la gestion des utilisateurs avec rôles (admin/user) et un espace admin pour voir et gérer tous les uploads.

➡️ Technos utilisées

Next.js

React

Prisma ORM (SQLite)

NextAuth (authentification sécurisée)

Tailwind CSS (design responsive)

React Toastify (notifications)

➡️ Installation

git clone <repo>
cd mon-projet-upload
npm install
npx prisma migrate dev
npm run dev

➡️ Fonctionnalités

Authentification sécurisée (bcrypt pour hasher les mots de passe)

Upload et stockage local avec chemin en base

Tableau des fichiers personnels et admin

Suppression d'uploads

Filtres et recherche dans l'admin

Interface responsive

➡️ Sécurité

Mot de passe hashé avec bcrypt

Rôles vérifiés côté serveur pour les actions sensibles

Aucune donnée sensible exposée dans le front

➡️ Démo recommandée

Créer un compte utilisateur

Se connecter

Uploader un fichier

Consulter "Mes uploads"

Se déconnecter et se reconnecter en admin

Accéder au dashboard admin et supprimer un fichier

Montrer les notifications

Déconnexion
