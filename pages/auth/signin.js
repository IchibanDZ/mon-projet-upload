// === signin.js ===
import { signIn } from "next-auth/react";  // Fonction NextAuth pour tenter une connexion avec identifiants
import { useState } from "react";  // Hook React pour gérer les états du formulaire
import { useRouter } from "next/router";  // Permet la redirection après connexion
import Navbar from "../../components/Navbar";  // Affiche la barre de navigation

export default function SignIn() {  // Définition du composant de la page de connexion
  const [email, setEmail] = useState("");  // Stocke la saisie de l'email
  const [password, setPassword] = useState("");  // Stocke la saisie du mot de passe
  const [error, setError] = useState("");  // Stocke un message d'erreur éventuel
  const router = useRouter();  // Permet de rediriger l'utilisateur

  const handleSubmit = async (e) => {  // Fonction exécutée lors de la soumission du formulaire
    e.preventDefault();  // Empêche le rechargement de la page
    const result = await signIn("credentials", {  // Lance une tentative de connexion avec NextAuth
      email,
      password,
      redirect: false,  // On gère la redirection manuellement
    });

    if (result.error) {
      setError("Email ou mot de passe incorrect.");  // Affiche une erreur si la connexion échoue
    } else {
      router.push("/");  // Redirection vers la page d’accueil si la connexion réussit
    }
  };

  return (
    <>
      <Navbar /> 
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Connexion</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="block mb-1">Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Met à jour l'état email à chaque frappe
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Mot de passe :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // Met à jour l'état mot de passe à chaque frappe
              required
              className="border p-2 rounded w-full"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}  
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto text-sm md:text-base"
          >
            Se connecter
          </button>
        </form>
      </div>
    </>
  );
}
