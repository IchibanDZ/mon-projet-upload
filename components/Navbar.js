"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") return null;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">Mon-Projet</div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>☰</button> 
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="hover:underline">Accueil</Link>
          <Link href="/myuploads" className="hover:underline">Mes fichiers</Link>
          {session?.user?.role === "ADMIN" && ( //logique conditionnelle de la session util via Nextauth
            <Link href="/admin" className="hover:underline">Admin</Link>
          )}
          <Link href="/" className="hover:underline">Upload</Link>
          {session ? (
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >Déconnexion</button>//handleLogout permet de terminer la session
          ) : (
            <Link href="/auth/signin" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
            >Connexion</Link>)}
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden flex flex-col mt-2 space-y-2">
          <Link href="/" onClick={() => setIsOpen(false)}>Accueil</Link>
          <Link href="/myuploads" onClick={() => setIsOpen(false)}>Mes fichiers</Link>
          {session?.user?.role === "ADMIN" && ( //setIsOpen permet de fermer le menu une fois qu'un lien est cliqué
            <Link href="/admin" onClick={() => setIsOpen(false)}>Admin</Link>
          )} 
          <Link href="/" onClick={() => setIsOpen(false)}>Upload</Link>
          {session ? (
            <button
              onClick={() => {// Ferme le menu et exécute handleLogout pour déconnecter l'utilisateur
                setIsOpen(false);
                handleLogout();
              }}
              className="bg-red-500 px-3 py-1 rounded">Déconnexion</button>
          ) : (
            <Link
              href="/auth/signin"
              onClick={() => setIsOpen(false)}
              className="bg-blue-500 px-3 py-1 rounded">Connexion</Link>
          )}
        </div>
      )}
    </nav>
  );
}
