"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Importation de useRouter
import TableWrapper from "@/components/payments/tableWrapper"; // Assurez-vous d'avoir le bon chemin pour l'importation

const OrganisationPage = ({
  params,
}: {
  params: { organisationId: string };
}) => {
  const [organisation, setOrganisation] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { organisationId } = params;

  // Fetch organisation data
  useEffect(() => {
    const fetchOrganisationData = async () => {
      // Récupérer les informations de l'organisation et des transactions
      try {
        const organisationRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${organisationId}`
        );
        const organisationData = await organisationRes.json();
        setOrganisation(organisationData);

        const transactionsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${organisationId}/transactions`
        );
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchOrganisationData();
  }, [organisationId]);

  // Affichage conditionnel pendant le chargement
  if (!organisation || !transactions.length) {
    return <p>Chargement...</p>;
  }

  console.log("one transaction" , transactions);
  

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      {/* Breadcrumb */}
      <ul className="flex">
        <li className="flex gap-2">
          <span>Home</span> / <span>Transactions</span> /{" "}
          <span>{organisation.name}</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">
        Transactions de l'organisation {organisation.name}
      </h3>

      {/* Table des transactions */}
      <TableWrapper transactions={transactions} />
    </div>
  );
};

export default OrganisationPage;
