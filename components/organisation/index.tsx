"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Link from "next/link";
import { ExportIcon } from "@/components/icons/accounts/export-icon";

// Liste des colonnes à afficher pour les organisations
const columns = [
  { name: "Nom de l'organisation", uid: "name" },
  // { name: "Référence de l'organisation", uid: "organisationId" },
  { name: "Nom du propriétaire", uid: "owner" },
  { name: "Téléphone du propriétaire", uid: "ownerPhone" },
  { name: "Numéro de l'organisation", uid: "phone" },
  { name: "Type d'organisation", uid: "organisationType" },
  { name: "Type de compte", uid: "accountType" },
  { name: "Status", uid: "status" },
  { name: "Date de création", uid: "createdAt" },
  { name: "Date de mise à jour", uid: "updatedAt" },
  { name: "Actions", uid: "actions" },
];

const TableWrapper = () => {
  const [organisations, setOrganisations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Nouveau state pour la recherche
  const [organisationsPerPage] = useState(5);

  // Fetch des données d'organisation depuis l'API
  useEffect(() => {
    const fetchOrganisations = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organisations`
      );
      const data = await res.json();
      setOrganisations(data); // Assurez-vous que `data` est un tableau d'organisations
    };

    fetchOrganisations();
  }, []);

  // Filtrer les organisations en fonction du texte de recherche
  const filteredOrganisations = organisations.filter((organisation) =>
    Object.values(organisation)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastOrganisation = currentPage * organisationsPerPage;
  const indexOfFirstOrganisation =
    indexOfLastOrganisation - organisationsPerPage;
  const currentOrganisations = filteredOrganisations.slice(
    indexOfFirstOrganisation,
    indexOfLastOrganisation
  );
  const totalPages = Math.ceil(
    filteredOrganisations.length / organisationsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Toutes les organisations</h3>
      {/* Actions */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Rechercher des organisations"
            value={searchTerm} // Liaison avec l'état
            onChange={(e) => setSearchTerm(e.target.value)} // Mise à jour de l'état
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" startContent={<ExportIcon />}>
            Exporter en CSV
          </Button>
        </div>
      </div>

      {/* Table des organisations */}
      <Table aria-label="Tableau des organisations">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={currentOrganisations}>
          {(organisation) => (
            <TableRow key={organisation.organisationId}>
              {/* Affichage des données de l'organisation */}
              <TableCell>{organisation.name}</TableCell>
              {/*<TableCell>{organisation.organisationId}</TableCell> */}
              <TableCell>
                {organisation.owner?.fullname || "Non mentionné"}
              </TableCell>
              <TableCell>
                {organisation.owner?.phone || "Non mentionné"}
              </TableCell>
              <TableCell>{organisation.phone || "Non mentionné"}</TableCell>
              <TableCell>{organisation.organisationType}</TableCell>
              <TableCell>{organisation.accountType}</TableCell>
              <TableCell>
                <span
                  style={{
                    color: organisation.status === "active" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {organisation.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(organisation.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(organisation.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link href={`/organisation/${organisation.organisationId}`}>
                  <Button size="sm">Voir</Button>
                </Link>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Précédent
        </Button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default TableWrapper;
