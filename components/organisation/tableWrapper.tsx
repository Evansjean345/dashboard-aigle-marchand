"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Link from "next/link";
import { UsersIcon } from "../icons/breadcrumb/users-icon";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";

// Colonnes pour les organisations
const columns = [
  { name: "Nom de l'organisation", uid: "name" },
  { name: "Numéro de l'organisation", uid: "phone" },
  { name: "Type de compte", uid: "accountType" },
  { name: "Type d'organisation", uid: "organisationType" },
  { name: "Nom du propriétaire", uid: "owner.fullname" },
  { name: "Téléphone du propriétaire", uid: "owner.phone" },
  { name: "Email du propriétaire", uid: "owner.email" },
  { name: "Statut de l'organisation", uid: "status" },
  { name: "Solde du portefeuille", uid: "wallet.balance" },
  { name: "Transfert", uid: "wallet.transfer" },
  { name: "Collect", uid: "wallet.collect" },
  { name: "Statut du portefeuille", uid: "wallet.statut" },
];

// Fonction utilitaire pour accéder aux objets imbriqués
const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((value, key) => value?.[key], obj);
};

const TableWrapper = ({ organisations }: { organisations: any[] }) => {
  const [subOrganisation, setSubOrganisation] = useState<any | null>(null);
  const [noSubOrganisationMessage, setNoSubOrganisationMessage] = useState<
    string | null
  >(null);
  const [members, setMembers] = useState<any | null>(null);

  useEffect(() => {
    const fetchSubOrganisationAndMembers = async () => {
      for (let organisation of organisations) {
        const organisationId = organisation.organisationId;

        // Récupérer les sous-organisations
        try {
          const subResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${organisationId}/sub-organisations`
          );
          if (subResponse.ok) {
            const subData = await subResponse.json();
            if (subData.length === 0) {
              setNoSubOrganisationMessage(
                "Cette organisation est une organisation principale et ne contient aucune sous-organisation"
              );
              console.log(subData);
            } else {
              setNoSubOrganisationMessage(null);
            }
            setSubOrganisation(subData); // Sauvegarder les sous-organisations dans l'état
          } else {
            setNoSubOrganisationMessage(
              "Cette organisation n'est pas une organisation principale."
            );
            setSubOrganisation(null); // Réinitialiser si erreur
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des sous-organisations",
            error
          );
          setNoSubOrganisationMessage(
            "Cette organisation n'est pas une organisation principale."
          );
        }
        // Récupérer les membres
        try {
          const membersResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${organisationId}/members`
          );
          if (membersResponse.ok) {
            const membersData = await membersResponse.json();
            setMembers(membersData); // Sauvegarder les membres dans l'état
          } else {
            setMembers(null); // Réinitialiser les membres en cas d'erreur
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des membres", error);
          setMembers(null); // Réinitialiser les membres en cas d'erreur
        }
      }
    };

    // Lancer la récupération des données dès que les organisations sont disponibles
    if (organisations && organisations.length > 0) {
      fetchSubOrganisationAndMembers();
    }
  }, [organisations]);

  if (!organisations || organisations.length === 0) {
    return <p>Aucune organisation disponible.</p>;
  }

  return (
    <>
      <Table aria-label="Tableau des organisations">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={organisations}>
          {(organisation) => (
            <TableRow key={organisation.organisationId}>
              {columns.map((column) => (
                <TableCell key={column.uid}>
                  {column.uid === "actions" ? (
                    <Link
                      href={`/organisations/${organisation.organisationId}`}
                    >
                      Voir
                    </Link>
                  ) : column.uid.includes(".") ? (
                    getNestedValue(organisation, column.uid)
                  ) : (
                    organisation[column.uid] || "Non mentionné"
                  )}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Affichage du message si nécessaire */}
      {noSubOrganisationMessage && (
        <div>
          <div
            style={{ marginTop: "20px" }}
            className="border-1 p-6 px-8 flex flex-col gap-2 rounded-xl w-full xl:w-1/2 text-gray-400"
          >
            <div className="flex gap-4">
              {" "}
              <ProductsIcon />{" "}
              <span className="font-bold">Sous-organisations</span>
            </div>
            <p className="text-red-500">{noSubOrganisationMessage}</p>
          </div>
        </div>
      )}

      {/* Affichage des sous-organisations */}
      {subOrganisation ? (
        subOrganisation.length > 0 ? (
          <div
            style={{ marginTop: "20px" }}
            className="border-1 rounded-xl px-8 p-6 xl:w-1/2 w-full dark:bg-[#18181b]"
          >
            <div className="flex gap-3">
              <HomeIcon />
              <h3>Sous-organisations</h3>
            </div>
            {subOrganisation.map((subOrg: any) => (
              <div key={subOrg.id} className="xl:w-1/2 w-full mt-3 text-black">
                <div className="py-2 px-4 overflow-hidden border-1 rounded-xl ">
                  <div className="flex gap-2.5">
                    <div className="flex flex-col ">
                      <span className="dark:text-gray-200">{subOrg.name}</span>
                      <span className="text-xs dark:text-gray-200">
                        Type de compte : {subOrg.accountType}
                      </span>
                      <span className="text-xs dark:text-gray-200">
                        Numéro : {subOrg.phone}
                      </span>
                      <span className="text-xs dark:text-gray-200">
                        Status : {subOrg.status}
                      </span>
                      <span className="text-xs font-semibold dark:text-gray-200">
                        Wallet
                      </span>
                      <span className="text-xs dark:text-gray-200">
                        Transfer : {subOrg.wallet?.transfer}
                      </span>
                      <span className="text-xs dark:text-gray-200">
                        Collect : {subOrg.wallet?.collect}
                      </span>
                      <span className="text-xs dark:text-gray-200">
                        Statut : {subOrg.wallet?.statut}
                      </span>
                      <span className="text-xs dark:text-gray-200">
                        Balance : {subOrg.wallet?.balance}
                      </span>
                      <span className="text-xs dark:text-gray-200">
                        {subOrg.createdAt
                          ? `Créée le: ${new Date(
                              subOrg.createdAt
                            ).toLocaleDateString()}`
                          : "Date inconnue"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucune Sous-organisation Trouvée</p>
        )
      ) : (
        <></>
      )}

      {/* Affichage des membres sous forme de cartes */}
      {members ? (
        members.length > 0 ? (
          <div
            style={{ marginTop: "20px" }}
            className="border-1 rounded-xl px-8 p-6 xl:w-1/2 w-full dark:bg-[#18181b] light:text-black"
          >
            <div className="flex gap-3">
              <UsersIcon />
              <h3>Réseau de l'organisation</h3>
            </div>
            {members.map((member: any) => (
              <div key={member.id} className="xl:w-1/2 w-full mt-3 ">
                <div className="py-2 px-4 overflow-hidden border-1 rounded-xl ">
                  <div className="flex gap-2.5">
                    <div className="flex flex-col">
                      <span className="dark:text-gray-200">
                        {member.fullname}
                      </span>
                      <span className="dark:text-gray-200 text-xs">
                        {member.email}
                      </span>
                      <span className="dark:text-gray-200 text-xs">
                        {member.phone}
                      </span>
                      <span className="dark:text-gray-200 text-xs">
                        {member.meta?.pivot_role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{ marginTop: "20px" }}
            className="border-1 p-6 px-8 flex flex-col gap-2 rounded-xl xl:w-1/2 w-full text-gray-400"
          >
            <div className="flex gap-4">
              {" "}
              <UsersIcon />{" "}
              <span className="font-bold">Membres de l'organisation</span>
            </div>
            <p className="text-red-500">
              Cette organisation ne contient aucun membres
            </p>
          </div>
        )
      ) : (
        <div style={{ marginTop: "20px", color: "gray" }}>
          <p>Aucun membre dans cet organisation</p>
        </div>
      )}
    </>
  );
};

export default TableWrapper;
