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
  { name: "Devise", uid: "currency" },
  { name: "Type de transaction", uid: "transactionType" },
  { name: "Statut", uid: "status" },
  { name: "Méthode de paiement", uid: "paymentMethod" },
  { name: "OTP", uid: "otp" },
  { name: "Fournisseur", uid: "provider" },
  { name: "Pays", uid: "country" },
  { name: "Numéro de téléphone", uid: "phone_number" },
  { name: "Description", uid: "description" },
  { name: "Type de compte", uid: "accountType" },
  { name: "Organisation", uid: "organisation" },
  { name: "Catégorie", uid: "category" },
  { name: "Transaction ID", uid: "transactionId" },
  { name: "Date de création", uid: "createdAt" },
  { name: "Date de mise à jour", uid: "updatedAt" },
  { name: "Actions", uid: "actions" },
];

const TableWrapper = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Nouveau state pour la recherche
  const [transactionsPerPage] = useState(5);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions`
      );
      const data = await res.json();
      setTransactions(data); // Assurez-vous que `data` est bien un tableau de transactions
    };

    fetchTransactions();
  }, []);

  // Filtrer les transactions en fonction du texte de recherche
  const filteredTransactions = transactions.filter((transaction) =>
    Object.values(transaction)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Toutes les transactions</h3>
      {/* Actions */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Rechercher des transactions"
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
        <TableBody items={currentTransactions}>
          {(transaction) => (
            <TableRow key={transaction.transactionId}>
              {/* Affichage de toutes les données de la transaction */}
              <TableCell>{transaction.reference}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.currency}</TableCell>
              <TableCell>{transaction.transactionType}</TableCell>
              <TableCell>
                <span
                  style={{
                    color: transaction.status === "success" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {transaction.status}
                </span>
              </TableCell>
              <TableCell>{transaction.paymentMethod}</TableCell>
              <TableCell>{transaction.paymentDetails?.otp}</TableCell>
              <TableCell>
                {transaction.paymentDetails?.provider === "wave" ? (
                  <img src="/wave.png" alt="" className="h-8 w-8" />
                ) : transaction.paymentDetails?.provider === "orange" ? (
                  <img src="/orange.jpg" alt="" className="h-8 w-8" />
                ) : transaction.paymentDetails?.provider === "mtn" ? (
                  <img src="/mtn.png" alt="" className="h-8 w-8" />
                ) : transaction.paymentDetails?.provider === "moov" ? (
                  <img src="/moov.png" alt="" className="h-8 w-8" />
                ) : transaction.transactionType === "airtime" ? (
                  <img src="/air.png" alt="" className="h-8 w-8" />
                ) : (
                  "non spécifié"
                )}
              </TableCell>
              <TableCell>
                {transaction.paymentDetails?.country_code.toUpperCase()}
              </TableCell>
              <TableCell>{transaction.paymentDetails?.phone_number}</TableCell>
              <TableCell>
                {transaction.description || "Aucune description"}
              </TableCell>
              <TableCell>{transaction.organisation?.accountType}</TableCell>
              <TableCell>{transaction.organisation?.name}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{transaction.transactionId}</TableCell>
              <TableCell>
                {new Date(transaction.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(transaction.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link href={`/payments/${transaction.organisationId}`}>
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
