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

const columns = [
  { name: "Référence", uid: "reference" },
  { name: "Montant", uid: "amount" },
  { name: "Devise", uid: "currency" },
  { name: "Type", uid: "transactionType" },
  { name: "Statut", uid: "status" },
  { name: "Méthode de paiement", uid: "paymentMethod" },
  { name: "Description", uid: "description" },
  { name: "Opérateur", uid: "provider" },
  { name: "Code du pays", uid: "countryCode" },
  { name: "Numéro", uid: "phoneNumber" },
  { name: "Raison de l'échec", uid: "failureReason" },
  { name: "Date de création", uid: "createdAt" },
  { name: "Date de mise à jour", uid: "updatedAt" },
  { name: "Actions", uid: "actions" },
];

const TableWrapper = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  // État pour le modal
  const [transactionDetails, setTransactionDetails] = useState(null); // Détails de la transaction
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook pour gérer le modal

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/transactions`
        );
        const data = await res.json();

        const transformedData = data.map((transaction) => ({
          ...transaction,
          provider: transaction.paymentDetails?.provider || "N/A",
          countryCode: transaction.paymentDetails?.country_code || "N/A",
          phoneNumber: transaction.paymentDetails?.phone_number || "N/A",
          failureReason: transaction.failureReason || "Aucune",
          description: transaction.description || "Aucune",
        }));

        setTransactions(transformedData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des transactions:",
          error
        );
      }
    };

    fetchTransactions();
  }, []);

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

  // Fonction pour récupérer les détails d'une transaction par référence
  const fetchTransactionDetails = async (reference) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${reference}`
      );
      if (!res.ok) throw new Error("Transaction introuvable");
      const data = await res.json();
      setTransactionDetails(data); // Met à jour les données affichées dans le modal
      onOpen(); // Ouvre le modal
    } catch (error) {
      console.error("Erreur :", error.message);
      setTransactionDetails(null);
    }
  };

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
                {" "}
                {transaction.provider === "wave" ? (
                  <img src="/wave.png" alt="" className="h-8 w-8" />
                ) : transaction.provider === "orange" ? (
                  <img src="/orange.jpg" alt="" className="h-8 w-8" />
                ) : transaction.provider === "mtn" ? (
                  <img src="/mtn.png" alt="" className="h-8 w-8" />
                ) : transaction.provider === "moov" ? (
                  <img src="/moov.png" alt="" className="h-8 w-8" />
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
