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
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

// Définition du type pour une transaction
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
  paymentDetails?: {
    service?: string;
    provider?: string;
    country_code?: string;
    phone_number?: string;
  };
  details?: {
    senderDetails?: {
      provider?: string;
      phone_number?: string;
    };
    receiveDetails?: {
      provider?: string;
      phone_number?: string;
    };
  };
}

// Définition des props que le composant accepte
interface TableWrapperProps {
  transactions: Transaction[];
}

const TableWrapper: React.FC<TableWrapperProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const transactionsPerPage = 15;

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

  const fetchTransactions = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/transactions`
    );
    const data = await res.json();

    // Désérialisation de `paymentDetails` pour chaque transaction
    const formattedData = data.map((transaction) => {
      if (transaction.paymentDetails || transaction.details) {
        // Si `paymentDetails` est une chaîne JSON, la convertir en objet
        try {
          transaction.paymentDetails = JSON.parse(transaction.paymentDetails);
          transaction.details.senderDetails = JSON.parse(
            transaction.details.senderDetails
          );
          transaction.details.receiveDetails = JSON.parse(
            transaction.details.receiveDetails
          );
        } catch (error) {
          console.error("Erreur de désérialisation de paymentDetails", error);
        }
      }
      return transaction;
    });

    setTransactionDetails(formattedData); // Assurez-vous que les transactions sont bien formatées
  };

  // Liste des colonnes à afficher
  const columns = [
    { name: "Référence", uid: "reference" },
    { name: "Montant", uid: "amount" },
    // { name: "Devise", uid: "currency" },
    { name: "Type de transaction", uid: "transactionType" },
    { name: "Statut", uid: "status" },
    /*
    { name: "Cpte payeur", uid: "ctpeP" },
    { name: "Cpte Beneficiare", uid: "ctpeB" }, */
    // { name: "Méthode de paiement", uid: "paymentMethod" },
    // { name: "OTP", uid: "otp" },
    { name: "Fournisseur", uid: "provider" },
    { name: "Pays", uid: "country" },
    // { name: "Numéro de téléphone", uid: "phone_number" },
    // { name: "Description", uid: "description" },
    /*
    { name: "Type de compte", uid: "accountType" },
    { name: "Organisation", uid: "organisation" }, */
    // { name: "Catégorie", uid: "category" },
    // { name: "Transaction ID", uid: "transactionId" },
    { name: "Date de création", uid: "createdAt" },
    // { name: "Date de mise à jour", uid: "updatedAt" },
    { name: "Actions", uid: "actions" },
  ];

  // Fonction pour récupérer les détails d'une transaction
  const fetchTransactionDetails = async (reference) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${reference}`
      );
      if (!res.ok) throw new Error("Utilisateur introuvable");
      const data = await res.json();
      // Désérialisation des champs JSON
      if (data.paymentDetails) {
        try {
          data.paymentDetails = JSON.parse(data.paymentDetails);
        } catch (error) {
          console.error("Erreur de désérialisation de paymentDetails", error);
        }
      }

      if (data.details) {
        try {
          data.details.senderDetails = JSON.parse(data.details.senderDetails);
        } catch (error) {
          console.error("Erreur de désérialisation de senderDetails", error);
        }

        try {
          data.details.receiveDetails = JSON.parse(data.details.receiveDetails);
        } catch (error) {
          console.error("Erreur de désérialisation de receiveDetails", error);
        }
      }

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
              <TableCell>
                <span>{transaction.amount}</span>
                &nbsp;
                <span>XOF</span>
              </TableCell>
              {/** <TableCell>{transaction.currency}</TableCell> */}
              <TableCell>{transaction.transactionType}</TableCell>
              <TableCell>
                <span
                  style={{
                    color:
                      transaction.status === "success"
                        ? "green"
                        : transaction.status === "failed"
                        ? "red"
                        : "yellow",
                    fontWeight: "bold",
                  }}
                >
                  {transaction.status}
                </span>
              </TableCell>
              {/*
                <TableCell>
                {transaction.details === null
                  ? transaction.paymentDetails?.phone_number
                  : transaction.details !== null
                  ? transaction.details?.senderDetails?.phone_number
                  : ""}
              </TableCell>
              <TableCell>
                {transaction.details === null
                  ? transaction.paymentDetails?.phone_number
                  : transaction.details !== null
                  ? transaction.details?.receiveDetails?.phone_number
                  : ""}
              </TableCell> */}
              {/* <TableCell>{transaction.paymentDetails?.service}</TableCell> */}
              {/*  <TableCell>{transaction.paymentDetails?.otp}</TableCell> */}
              <TableCell>
                {(() => {
                  // Vérifier si paymentDetails contient un service
                  if (transaction.paymentDetails?.service) {
                    return (
                      <img
                        src="/v-c.webp"
                        alt="credit-card"
                        className="h-8 w-8 object-fill"
                      />
                    );
                  }

                  // Déterminer le provider
                  const provider =
                    transaction.paymentDetails?.provider ||
                    transaction.details?.senderDetails?.provider;

                  // Objet de correspondance entre provider et image
                  const providerImages = {
                    wave: "/wave.png",
                    orange: "/orange.jpg",
                    mtn: "/mtn.png",
                    moov: "/moov.png",
                    air: "/air.png",
                  };

                  // Vérifier si le provider a une image correspondante
                  if (provider && providerImages[provider]) {
                    return (
                      <img
                        src={providerImages[provider]}
                        alt={provider}
                        className="h-8 w-8"
                      />
                    );
                  }

                  // Si transactionType est "airtime", afficher une image spécifique
                  if (transaction.transactionType === "airtime") {
                    return (
                      <img src="/air.png" alt="airtime" className="h-8 w-8" />
                    );
                  }

                  // Si aucun provider trouvé, ne rien afficher
                  return null;
                })()}
              </TableCell>

              <TableCell>
                {transaction.paymentDetails?.country_code?.toUpperCase()}
              </TableCell>
              {/*   <TableCell>{transaction.paymentDetails?.phone_number}</TableCell> */}
              {/*   <TableCell>
                {transaction.description || "Aucune description"}
              </TableCell> */}
              {/*
               <TableCell>{transaction.organisation?.accountType}</TableCell>
              <TableCell>{transaction.organisation?.name}</TableCell> */}
              {/*<TableCell>{transaction.category}</TableCell> */}
              {/*   <TableCell>{transaction.transactionId}</TableCell> */}
              <TableCell>
                {new Date(transaction.createdAt).toUTCString()}
              </TableCell>
              {/*      <TableCell>
                {new Date(transaction.updatedAt).toLocaleDateString()}
              </TableCell> */}
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered">Plus d'actions</Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Dropdown menu with icons"
                    variant="faded"
                  >
                    <DropdownItem
                      //  key="copy"
                      // shortcut="⌘C"
                      onPress={() =>
                        fetchTransactionDetails(transaction.reference)
                      }
                    >
                      Voir les details
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
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
