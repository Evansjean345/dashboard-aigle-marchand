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

const columns = [
  { name: "Nom de l'organisation", uid: "organisationName" },
  { name: "Nom du client", uid: "userName" },
  { name: "Montant", uid: "amount" },
  { name: "Statut", uid: "status" },
  { name: "Type d'approvisionnement", uid: "provisionType" },
  { name: "Fournisseur", uid: "paymentProviderLabel" },
  { name: "Type de fournisseur", uid: "paymentProviderType" },
  { name: "Numéro", uid: "paymentProviderNumber" },
  { name: "Actions", uid: "actions" },
];

export const TableWrapper = () => {
  const [provisionRequests, setProvisionRequests] = useState([]);
  const [paymentProviders, setPaymentProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orgDetails, setOrgDetails] = useState(null);
  const [provisionDetails, setProvisionDetails] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const requestsPerPage = 5;
  const [sixes, setSixes] = useState("5xl");

  const fetchData = async () => {
    try {
      // 1. Récupérer tous les fournisseurs de paiement
      const paymentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment_providers`
      );
      const paymentProvidersData = await paymentRes.json();
      setPaymentProviders(paymentProvidersData);

      // 2. Récupérer toutes les demandes d'approvisionnement
      const provisionRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/provision_requests`
      );
      const provisionData = await provisionRes.json();

      // 3. Transformer les données des demandes
      const transformedData = await Promise.all(
        provisionData.map(async (provision) => {
          // Trouver le fournisseur de paiement correspondant
          const paymentProvider = paymentProvidersData.find(
            (provider) =>
              provider.reference === provision.paymentProviderReference
          );

          // Récupérer les détails de l'organisation
          const orgRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${provision.organisationId}`
          );
          const orgData = await orgRes.json();

          // Récupérer les détails de l'utilisateur
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/${provision.userId}`
          );
          const userData = await userRes.json();

          // Retourner les données enrichies
          return {
            ...provision,
            userName: userData.fullname,
            organisationName: orgData.name,
            paymentProviderDetails: {
              reference: paymentProvider?.reference || "Non trouvé",
              label: paymentProvider?.label || "Non trouvé",
              type: paymentProvider?.type || "Non trouvé",
              number: paymentProvider?.number || "Non trouvé",
            },
          };
        })
      );

      // Enregistrer les demandes enrichies
      setProvisionRequests(transformedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = async (organisationId, provisionId) => {
    try {
      const selectedProvision = provisionRequests.find(
        (request) =>
          request.organisationId === organisationId &&
          request.id === provisionId
      );

      if (selectedProvision) {
        // Mettre à jour les détails de l'organisation
        const orgRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${organisationId}`
        );
        const orgData = await orgRes.json();

        setOrgDetails({
          ...orgData,
          wallet: orgData.wallet || { balance: 0, transfer: 0 },
          organisationId,
        });

        // Mettre à jour les détails de la provision
        setProvisionDetails(selectedProvision);

        onOpen(); // Ouvrir le modal
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture du modal :", error);
      alert("Impossible de récupérer les détails.");
    }
  };

  const updateWallet = async (id, updatedWallet) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${id}/wallet`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedWallet),
        }
      );

      if (!res.ok) throw new Error("Erreur lors de la mise à jour du wallet");

      // Mettre à jour le statut de la demande d'approvisionnement
      if (provisionDetails) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/provision_requests/${provisionDetails.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "completed" }),
          }
        );
      }

      alert("Wallet mis à jour avec succès !");
      fetchData(); // Recharger toutes les données
      onClose();
    } catch (error) {
      console.error("Erreur :", error.message);
      alert("Échec de la mise à jour du wallet : " + error.message);
    }
  };

  // Pagination logic
  const filteredRequests = provisionRequests.filter((request) =>
    Object.values(request)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);


  console.log(provisionDetails);
  

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">
        Liste des demandes d'approvisionnement
      </h3>
      <Input
        placeholder="Rechercher des demandes"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        classNames={{ input: "w-full", mainWrapper: "w-full" }}
      />
      <Table>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={currentRequests}>
          {(request) => (
            <TableRow key={request.id}>
              <TableCell>{request.organisationName}</TableCell>
              <TableCell>{request.userName}</TableCell>
              <TableCell>{request.amount} XOF</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>{request.provisionType}</TableCell>
              <TableCell>{request.paymentProviderDetails.label}</TableCell>
              <TableCell>{request.paymentProviderDetails.type}</TableCell>
              <TableCell>{request.paymentProviderDetails.number}</TableCell>
              <TableCell>
                <Button
                  color="primary"
                  onPress={() =>
                    handleOpenModal(request.organisationId, request.id)
                  }
                  disabled={request.status === "completed"}
                >
                  Approvisionner
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4">
        <Button
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <Button
          onPress={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} size={sixes}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Demande d'approvisionnement de {orgDetails?.name}
          </ModalHeader>
          <ModalBody>
            <strong>Détails de la demande</strong>
            <div className="flex w-full">
              <div className="w-1/2">
                <div>
                  <strong>ID</strong>
                  <div>{provisionDetails?.id}</div>
                </div>
                <div>
                  <strong>MONTANT A APPROVISIONNER</strong>
                  <div>{provisionDetails?.amount} XOF</div>
                </div>
                <div>
                  <strong>METHODE DE PAIEMENT</strong>
                  <div> {provisionDetails?.paymentProviderDetails?.label}</div>
                </div>
                <div>
                  <strong>NUMERO DU COMPTE</strong>
                  <div> {provisionDetails?.paymentProviderDetails?.number}</div>
                </div>
                <div>
                  <strong>PREUVE DU PAIEMENT</strong>
                  {provisionDetails?.documentUrl && (
                    <a
                      href={provisionDetails.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={provisionDetails.documentUrl}
                        alt="Preuve de paiement"
                        className="h-12 w-12"
                      />
                    </a>
                  )}
                </div>
              </div>
              <div className="w-1/2">
                <div>
                  <strong>TYPE D'APPROVISIONNEMENT</strong>
                  <div> {provisionDetails?.paymentProviderDetails?.label}</div>
                </div>
                <div>
                  <strong>ID DE L'ORGANISATION</strong>
                  <div>{provisionDetails?.organisationId}</div>
                </div>
                <div>
                  <strong>OPERATEUR</strong>
                  <div>{provisionDetails?.paymentProviderLabel}</div>
                </div>
                <div>
                  <strong>STATUT</strong>
                  <div>{provisionDetails?.status}</div>
                </div>
                <div>
                  <strong>DATE ET HEURE</strong>
                  <div>
                    {provisionDetails?.createdAt
                      ? new Date(provisionDetails.createdAt).toLocaleString()
                      : ""}
                  </div>
                </div>
              </div>
            </div>
            <strong>Confirmer la demande d'approvisionnement</strong>
            {orgDetails && (
              <div className="flex flex-col gap-4">
                <Input
                  label="Nouveau solde (balance)"
                  type="number"
                  value={orgDetails.wallet?.balance || ""}
                  onChange={(e) =>
                    setOrgDetails({
                      ...orgDetails,
                      wallet: {
                        ...orgDetails.wallet,
                        balance: parseInt(e.target.value),
                      },
                    })
                  }
                />
                <Input
                  label="Nouveau montant (transfer)"
                  type="number"
                  value={orgDetails.wallet?.transfer || ""}
                  onChange={(e) =>
                    setOrgDetails({
                      ...orgDetails,
                      wallet: {
                        ...orgDetails.wallet,
                        transfer: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={onClose}>
              Annuler
            </Button>
            <Button
              color="success"
              onPress={() =>
                updateWallet(orgDetails.organisationId, {
                  balance: orgDetails.wallet?.balance,
                  transfer: orgDetails.wallet?.transfer,
                })
              }
            >
              Confirmer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
