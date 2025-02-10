import { Card, CardBody } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
//import { Community } from "../icons/community";

export const CardBalance1 = () => {
  const [sold, setSold] = useState(null);
  useEffect(() => {
    const fetchSold = async () => {
      const url = "https://api.wave.com/v1/balance";
      const token =
        "wave_ci_prod_AmGvx1kFkrzRkryC1dnBSgrslJneLfwXt_pNcqWZLsWV5AY7HwGgfyuv5-lIIk7DD7L4B-xxC285IExwhVSV2MstZitIZYPFyg";
      try {
        const response = await fetch(url, {
          method: "GET", // Ou "POST", "PUT", "DELETE" selon ton besoin
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        setSold(data);
        console.log("Données reçues :", data);
      } catch (error) {
        console.error("Erreur lors de la requête :", error);
      }
    };
    fetchSold();
  }, []);

  return (
    <Card className="xl:max-w-xs bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-2xl shadow-2xl border border-gray-200 px-5 py-6 w-full relative overflow-hidden">
      {/* Effet de lumière pour un rendu premium */}
      <div className="absolute inset-0 bg-white/10 opacity-10 rounded-2xl"></div>

      <CardBody className="relative z-10">
        <div className="flex justify-between items-center">
          <img src="/wave.png" className="h-10 w-10" alt="Wave Logo" />
          <span className="text-white text-xs font-medium tracking-widest">
            PRÉPAYÉE
          </span>
        </div>

        <div className="mt-6">
          <span className="text-gray-300 text-sm">Solde disponible</span>
          <p className="text-white text-3xl font-bold mt-1">
            {sold?.amount}
            {sold?.currency}
          </p>
        </div>

        <div className="mt-8">
          <span className="text-gray-300 text-sm tracking-widest">
            **** **** **** 1234
          </span>
          <div className="flex justify-between text-gray-300 text-xs mt-2">
            <span>EXP: 12/26</span>
            <span className="font-semibold">WAVE</span>
          </div>
        </div>

        {/* Bordure inférieure métallique pour effet réaliste */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-100 to-gray-300 opacity-30"></div>
      </CardBody>
    </Card>
  );
};
