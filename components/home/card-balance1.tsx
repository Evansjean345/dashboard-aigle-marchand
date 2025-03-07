import { Card, CardBody } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
//import { Community } from "../icons/community";

export const CardBalance1 = () => {
  const [sold, setSold] = useState(null);
  useEffect(() => {
    const fetchSold = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/balance/wave`;
      try {
        const response = await fetch(url, {
          method: "GET", // Ou "POST", "PUT", "DELETE" selon ton besoin
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
    <Card className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-2xl shadow-2xl  px-1 py-2 w-full relative overflow-hidden">
      <CardBody>
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-white font-semibold">
            <span>00 XOF</span>
            <span>solde wave</span>
          </div>
          <img src="/wave.png" alt="" className="w-12 h-12" />
        </div>
      </CardBody>
    </Card>
  );
};
