import { Card, CardBody } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Community } from "../icons/community";

// Liste des drapeaux associés aux codes pays
const countryFlags = {
  BF: "/flag/bf.png", // Burkina Faso
  BJ: "/flag/bj.png", // Bénin
  CD: "/flag/cd.png", // RD Congo
  CI: "/flag/ci.svg", // Côte d'Ivoire
  CM: "/flag/cm.png", // Cameroun
  GN: "/flag/gn.png", // Guinée
  ML: "/flag/ml.png", // Mali
  SN: "/flag/sn.png", // Sénégal
  TG: "/flag/tg.png", // Togo
};

export const CardBalance4 = () => {
  const [sold, setSold] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("CI");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchSold = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/balance/cinetpay/balance`;
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

  const countryBalance =
    sold?.data?.countryBalance?.[selectedCountry]?.available || 0;

  return (
    <Card className=" bg-gradient-to-br text-xs from-[#696969] to-[#000000]  rounded-2xl shadow-2xl  px-1 py-2 w-full relative overflow-hidden">
      <CardBody>
        <div className="flex justify-between items-center">
          <div className="flex flex-col font-semibold text-white">
            <span className="absolute left-4 top-1 text-sm">
              solde mastercard
            </span>
            <span className="mt-1 text-xs">
              Total : {sold?.data?.amount} XOF
            </span>
            <span className="text-xs flex gap-x-1 mt-1 text-yellow-400">
              solde {selectedCountry}{" "}
              {countryFlags[selectedCountry] && (
                <img
                  src={countryFlags[selectedCountry]}
                  alt={selectedCountry}
                  className="w-5 h-3"
                />
              )}
              : {countryBalance} XOF
            </span>
            {/*Select country */}
            <div className="mt-1 flex flex-col">
              <label className="text-white text-xs font-thin">
                Selectionnez un pays :
              </label>
              <select
                className="w-full cursor-pointer mt-1 bg-[#696969] text-white px-1 py-1 rounded-md"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                {sold?.data?.countryBalance &&
                  Object.keys(sold?.data?.countryBalance)?.map(
                    (countryCode) => (
                      <option key={countryCode} value={countryCode}>
                        {countryCode}
                      </option>
                    )
                  )}
              </select>
            </div>
          </div>
          <div>
            <img src="/visa.png" alt="" className="w-12 h-18" />
            <img src="/mastercard.svg" alt="" className="w-12 h-8" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
