"use client";

import React, { useEffect, useState } from "react";
import TableWrapper from "@/components/organisation/tableWrapper"; // Adaptez le chemin
import Link from "next/link";

const OrganisationPage = ({
  params,
}: {
  params: { organisationId: string };
}) => {
  const [organisation, setOrganisation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { organisationId } = params;

  useEffect(() => {
    const fetchOrganisationData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${organisationId}`
        );
        const data = await res.json();
        setOrganisation(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisationData();
  }, [organisationId]);

  if (loading) {
    return <p>Chargement des données de l'organisation...</p>;
  }

  if (!organisation) {
    return <p>Organisation introuvable.</p>;
  }

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      {/* Breadcrumb */}
      <ul className="flex">
        <li className="flex gap-2">
          <Link href="/">Home</Link> /{" "}
          <Link href="/organisations">Organisations</Link> /{" "}
          <span>{organisation.name}</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">
        Informations de l'organisation : {organisation.name}
      </h3>

      {/* TableWrapper prend un tableau */}
      <TableWrapper organisations={[organisation]} />
    </div>
  );
};

export default OrganisationPage;
