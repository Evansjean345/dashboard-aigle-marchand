"use server";

// Utilisation des cookies de Next.js côté serveur
import { cookies } from "next/headers";

export const createAuthCookie = async (authToken: string) => {
  // Définir un cookie pour l'utilisateur
  cookies().set("userAuth", authToken, {
    secure: true, // Assurez-vous d'être en HTTPS
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // Expiration du cookie : 7 jours
  });
};

export const deleteAuthCookie = async () => {
  // Supprimer le cookie de l'utilisateur
  cookies().delete("userAuth");
};
