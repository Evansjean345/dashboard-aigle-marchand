"use client";

import React, { useEffect, useState } from "react";
import TableWrapper from "@/components/payments/tableWrapper"; // Assurez-vous que le chemin est correct

const OrganisationPage = ({
  params,
}: {
  params: { organisationId: string };
}) => {
  const [organisation, setOrganisation] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { organisationId } = params;

  // Fonction pour parser un champ JSON imbriqué
  const parseJSONField = (field: any) => {
    try {
      return typeof field === "string" ? JSON.parse(field) : field;
    } catch (error) {
      console.error("Erreur de parsing JSON :", error);
      return null;
    }
  };

  // Fonction pour récupérer les données
  const fetchData = async () => {
    try {
      const [organisationRes, transactionsRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${organisationId}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${organisationId}/transactions`
        ),
      ]);

      if (!organisationRes.ok || !transactionsRes.ok) {
        throw new Error("Erreur de chargement des données");
      }

      const organisationData = await organisationRes.json();
      const transactionsData = await transactionsRes.json();

      // Désérialisation des champs JSON
      const parsedTransactions = transactionsData.map((transaction: any) => ({
        ...transaction,
        paymentDetails: parseJSONField(transaction.paymentDetails),
        organisation: parseJSONField(transaction.organisation),
        details: parseJSONField(transaction.details),
      }));

      setOrganisation(organisationData);
      setTransactions(parsedTransactions);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [organisationId]);

  if (!organisation || transactions.length === 0) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      {/* Breadcrumb */}
      <ul className="flex">
        <li className="flex gap-2">
          <span>Home</span> / <span>Transactions</span> /{" "}
          <span>{organisation?.name}</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">
        Transactions de l'organisation {organisation?.name}
      </h3>

      {/* Table des transactions */}
      <TableWrapper transactions={transactions} />
    </div>
  );
};

export default OrganisationPage;
