import { Card, CardBody } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
//import { Community } from "../icons/community";

export const CardBalance2 = () => {
  const [sold, setSold] = useState(null);
  useEffect(() => {
    const fetchSold = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/balance/hub2`;
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
    <Card className=" bg-gradient-to-br from-[#f15522] to-[#9a3a0a] rounded-2xl shadow-2xl  px-1 py-2 w-full relative overflow-hidden">
      <CardBody>
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-xs text-gray-200 font-semibold">
            <span>
              Collect : {sold?.collectionAccount?.[0]?.availableBalance} XOF
            </span>
            <span>
              Transfer : {sold?.transferAccount?.[0]?.availableBalance} XOF
            </span>
            <span>solde hub2</span>
          </div>
          <img src="/hub2.png" alt="" className="w-12 h-8" />
        </div>
      </CardBody>
    </Card>
  );
};
