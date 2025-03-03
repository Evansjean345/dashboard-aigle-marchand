"use client";

import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { createSupplyAuthCookie } from "@/actions/supplyAuth.action";

export const SupplyAuth = ({
  onAuthSuccess,
}: {
  onAuthSuccess: () => void;
}) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    const validPhone = "5757575757";
    const validPassword = "motdepasse";

    if (phone === validPhone && password === validPassword) {
      const authToken = "supplyAuthToken";
      localStorage.setItem("supplyAuth", authToken);

      await createSupplyAuthCookie(authToken);
      onAuthSuccess(); // Correction de la typo
    } else {
      setError("Numéro ou mot de passe incorrect");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-bold mb-4">Authentification Requise</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex flex-col w-80 gap-4">
        <Input
          label="Numéro de téléphone"
          variant="bordered"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          label="Mot de passe"
          variant="bordered"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button color="primary" onPress={handleLogin}>
          Se Connecter
        </Button>
      </div>
    </div>
  );
};
