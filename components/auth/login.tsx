"use client";

import { createAuthCookie } from "@/actions/auth.action"; // Import pour la création du cookie
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "./loader";

export const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues: LoginFormType = {
    phone: "",
    password: "",
  };

  useEffect(() => {
    // Vérifie si un jeton est présent dans localStorage ou les cookies
    const token =
      localStorage.getItem("authToken") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("userAuth="))
        ?.split("=")[1];
    if (token) {
      router.push("/"); // Redirection vers la page d'accueil si authentifié
    }
  }, [router]);
  const handleLogin = async (values: LoginFormType) => {
    setLoading(true); // Afficher le loader

    try {
      // Simuler la vérification des informations d'identification
      const validPhone = "0101010101";
      const validPassword = "password";

      if (values.phone === validPhone && values.password === validPassword) {
        // Simuler l'obtention du jeton d'authentification
        const authToken = "mockAuthToken123";
        localStorage.setItem("authToken", authToken); // Sauvegarder le token dans localStorage

        // Créer un cookie côté client
        document.cookie = `userAuth=${authToken}; path=/; max-age=${
          60 * 60 * 24 * 7
        }`; // Cookie valable 7 jours

        router.replace("/"); // Redirection après 5 secondes
      } else {
        throw new Error("Invalid phone or password");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
    } finally {
      setLoading(false); // Masquer le loader
    }
  };

  return (
    <>
      <div className="text-center text-[25px] font-bold mb-6">Login</div>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <>
            <div className="flex flex-col w-1/2 gap-4 mb-4">
              <Input
                variant="bordered"
                label="Phone"
                type="text"
                value={values.phone}
                isInvalid={!!errors.phone && !!touched.phone}
                errorMessage={errors.phone}
                onChange={handleChange("phone")}
              />
              <Input
                variant="bordered"
                label="Password"
                type="password"
                value={values.password}
                isInvalid={!!errors.password && !!touched.password}
                errorMessage={errors.password}
                onChange={handleChange("password")}
              />
            </div>

            {loading ? (
              <Loader />
            ) : (
              <Button
                onPress={() => handleSubmit()}
                variant="flat"
                color="primary"
              >
                Login
              </Button>
            )}
          </>
        )}
      </Formik>
    </>
  );
};
