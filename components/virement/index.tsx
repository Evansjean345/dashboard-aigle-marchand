"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
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

// Liste des colonnes à afficher
const columns = [
  { name: "Référence", uid: "reference" },
  { name: "Montant", uid: "amount" },
  { name: "frais", uid: "fees" },
  { name: "Total", uid: "total" },
  { name: "Type de transaction", uid: "virementType" },
  { name: "Date de la transaction", uid: "dateTransaction" },
  { name: "Statut", uid: "status" },
  { name: "Date de création", uid: "createdAt" },
  { name: "Date de mise à jour", uid: "updatedAt" },
  { name: "Actions", uid: "actions" },
];

const TableWrapper = () => {
  const [virement, setVirement] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Nouveau state pour la recherche
  const [virementPerPage] = useState(5);

  useEffect(() => {
    const fetchVirement = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_SECONDARY}/api/admin/transaction/all?operation=virement`
        );
        const result = await res.json();

        if (!result.data) {
          console.error(
            "Les données reçues ne contiennent pas la clé 'data'.",
            result
          );
          return;
        }

        setVirement(result.data); // Prendre directement result.data
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des transactions :",
          error
        );
      }
    };

    fetchVirement();
  }, []);

  // Filtrer les transactions en fonction du texte de recherche
  const filteredVirement = virement.filter((virement) =>
    Object.values(virement)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastVirement = currentPage * virementPerPage;
  const indexOfFirstVirement = indexOfLastVirement - virementPerPage;
  const currentVirement = filteredVirement.slice(
    indexOfFirstVirement,
    indexOfLastVirement
  );
  const totalPages = Math.ceil(filteredVirement.length / virementPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Tous les virements</h3>
      {/* Actions */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Rechercher un virement"
            value={searchTerm} // Liaison avec l'état
            onChange={(e) => setSearchTerm(e.target.value)} // Mise à jour de l'état
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table aria-label="Tableau des transactions">
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
        <TableBody items={currentVirement}>
          {(virement) => (
            <TableRow key={virement.transactionsUid}>
              {/* Affichage de toutes les données de la transaction */}
              <TableCell>{virement.reference}</TableCell>
              <TableCell>{virement.amount} XOF</TableCell>
              <TableCell>{virement.fees} XOF</TableCell>
              <TableCell>{virement.totalAmount} XOF</TableCell>
              <TableCell>{virement.operationType}</TableCell>
              <TableCell>{new Date(virement.dateTransaction).toUTCString()}</TableCell>
              <TableCell>
                <span
                  style={{
                    color: virement.status === "success" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {virement.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(virement.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(virement.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {/**
               *   <Link  href={`/payments/${virement.id}`}>
                  <Button size="sm"disabled>Voir</Button>
                </Link>
               */}
                ...
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
