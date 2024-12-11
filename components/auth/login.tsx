"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Valeurs par défaut pour une connexion automatique
  const initialValues: LoginFormType = {
    phone: "0101010101",
    password: "password",
  };

  const handleLogin = useCallback(
    async (values: LoginFormType) => {
      try {
        // Vérifie si les valeurs entrées correspondent aux valeurs prédéfinies
        if (
          values.phone === initialValues.phone &&
          values.password === initialValues.password
        ) {
          // Simuler la connexion réussie
          localStorage.setItem("authToken", "mockAuthToken12345"); // Exemple de token simulé
          await createAuthCookie();
          router.replace("/"); // Redirige vers la page d'accueil
          console.log("Connexion réussie avec des valeurs simulées");
        } else {
          throw new Error("Identifiants incorrects");
        }
      } catch (error: any) {
        setError(
          error.message || "Une erreur est survenue lors de la connexion"
        );
      }
    },
    [router]
  );

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

            <Button
              onPress={() => handleSubmit()}
              variant="flat"
              color="primary"
            >
              Login
            </Button>
          </>
        )}
      </Formik>
    </>
  );
};
