import { Card, CardBody } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
//import { Community } from "../icons/community";

export const CardBalance3 = () => {
  const [sold, setSold] = useState(null);
  useEffect(() => {
    const fetchSold = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/balance/reloadly/balance`;
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
    console.log(sold);
  }, []);
  return (
    <Card className=" bg-gradient-to-br from-[#8f8f94] to-[#f6f6f6] rounded-2xl shadow-2xl  px-1 py-2 w-full relative overflow-hidden">
      <CardBody>
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-white font-semibold text-xs">
            <span> balance : {sold?.balance} XOF</span>
            <span>solde reloadly</span>
          </div>
          <img src="/reloadly.svg" alt="" className="w-16 h-16" />
        </div>
      </CardBody>
    </Card>
  );
};
