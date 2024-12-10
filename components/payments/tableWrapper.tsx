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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";

// Définition du type pour une transaction
interface Transaction {
  transactionId: string;
  reference: string;
  amount: number;
  currency: string;
  transactionType: string;
  status: string;
  paymentMethod: string;
  description: string;
  provider: string;
  countryCode: string;
  phoneNumber: string;
  failureReason: string;
  createdAt: string;
  updatedAt: string;
}

// Définition des props que le composant accepte
interface TableWrapperProps {
  transactions: Transaction[];
}

const TableWrapper: React.FC<TableWrapperProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const transactionsPerPage = 5;

  const [transactionDetails, setTransactionDetails] =
    useState<Transaction | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Filtrer les transactions en fonction du terme de recherche
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

  const fetchTransactionDetails = async (reference: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${reference}`
      );
      if (!res.ok) throw new Error("Transaction introuvable");
      const data: Transaction = await res.json();
      setTransactionDetails(data);
      onOpen();
    } catch (error) {
      console.error("Erreur :", error.message);
      setTransactionDetails(null);
    }
  };

  const columns = [
    { uid: "reference", name: "Référence" },
    { uid: "amount", name: "Montant" },
    { uid: "currency", name: "Devise" },
    { uid: "transactionType", name: "Type de transaction" },
    { uid: "status", name: "Statut" },
    { uid: "paymentMethod", name: "Méthode de paiement" },
    { uid: "description", name: "Description" },
    { uid: "provider", name: "Fournisseur" },
    { uid: "countryCode", name: "Code pays" },
    { uid: "phoneNumber", name: "Numéro de téléphone" },
    { uid: "failureReason", name: "Raison de l'échec" },
    { uid: "createdAt", name: "Date de création" },
    { uid: "updatedAt", name: "Date de mise à jour" },
    { uid: "actions", name: "Actions" },
  ];

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Toutes les transactions</h3>

      {/* Recherche */}
      <Input
        placeholder="Rechercher des transactions"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        classNames={{
          input: "w-full",
          mainWrapper: "w-full",
        }}
      />

      {/* Table */}
      <Table aria-label="Tableau des transactions">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={currentTransactions}>
          {(transaction) => (
            <TableRow key={transaction.transactionId}>
              <TableCell>{transaction.reference}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.currency}</TableCell>
              <TableCell>{transaction.transactionType}</TableCell>
              <TableCell
                style={{
                  color: transaction.status === "success" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {transaction.status}
              </TableCell>
              <TableCell>{transaction.paymentMethod}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                {transaction.provider === "wave" ? (
                  <img src="/wave.png" alt="" className="h-8 w-8" />
                ) : transaction.provider === "orange" ? (
                  <img src="/orange.jpg" alt="" className="h-8 w-8" />
                ) : transaction.provider === "mtn" ? (
                  <img src="/mtn.png" alt="" className="h-8 w-8" />
                ) : transaction.provider === "moov" ? (
                  <img src="/moov.png" alt="" className="h-8 w-8" />
                ) : transaction.transactionType === "airtime" ? (
                  <img src="/air.png" alt="" className="h-8 w-8" />
                ) : (
                  "non spécifié"
                )}
              </TableCell>
              <TableCell>{transaction.countryCode}</TableCell>
              <TableCell>{transaction.phoneNumber}</TableCell>
              <TableCell>{transaction.failureReason}</TableCell>
              <TableCell>
                {new Date(transaction.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(transaction.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  onPress={() => fetchTransactionDetails(transaction.reference)}
                >
                  Détails
                </Button> 
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

      {/* Modal pour afficher les détails */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Détails de la transaction</ModalHeader>
          <ModalBody>
            {transactionDetails ? (
              <div>
                <p>
                  <strong>Référence :</strong> {transactionDetails.reference}
                </p>
                <p>
                  <strong>Montant :</strong> {transactionDetails.amount}{" "}
                  {transactionDetails.currency}
                </p>
                <p>
                  <strong>Statut :</strong> {transactionDetails.status}
                </p>
                <p>
                  <strong>Raison de l'échec :</strong>{" "}
                  {transactionDetails.failureReason || "Aucune"}
                </p>
                <p>
                  <strong>Type :</strong> {transactionDetails.transactionType}
                </p>
              </div>
            ) : (
              <p>Chargement des détails...</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TableWrapper;
