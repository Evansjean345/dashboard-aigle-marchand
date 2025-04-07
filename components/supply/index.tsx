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
  createSupplyAuthCookie,
  deleteSupplyAuthCookie,
} from "@/actions/supplyAuth.action";

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
  //for auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  //
  const [provisionRequests, setProvisionRequests] = useState([]);
  const [paymentProviders, setPaymentProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orgDetails, setOrgDetails] = useState(null);
  const [provisionDetails, setProvisionDetails] = useState(null);
  const [amountRequested, setAmonutRequested] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const requestsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "pending", "completed", "rejected"
  const [sixes, setSixes] = useState<
    "5xl" | "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "3xl" | "4xl" | "full"
  >("5xl");

  // Si validation dynamique est nécessaire
  const isValidSize = (
    size: string
  ): size is
    | "5xl"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "xs"
    | "3xl"
    | "4xl"
    | "full" => {
    const validSizes = [
      "5xl",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "xs",
      "3xl",
      "4xl",
      "full",
    ];
    return validSizes.includes(size);
  };

  //Auth before Fetch Data
  /** 🔑 Vérification des accès (login) */
  const handleLogin = () => {
    const validPhone = "0707400716";
    const validPassword = "30121978";

    if (phone === validPhone && password === validPassword) {
      setIsAuthenticated(true);
    } else {
      setError("Numéro ou mot de passe incorrect");
    }
  };

  /** 🚪 Déconnexion */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPhone("");
    setPassword("");
  };

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

      // Trier les demandes par date de création (les plus récentes en premier)
      provisionData.sort(
        (a, b) =>
          new Date(b.createdAt)?.getTime() - new Date(a.createdAt)?.getTime()
      );

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

  const fetchOrganisationDetails = async (organisationId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organisations`
      );
      const data = await response.json();

      const organisation = data.find(
        (org) => org.organisationId === organisationId
      );
      if (organisation) {
        setOrgDetails(organisation);
        setTotalAmount(organisation?.wallet?.balance + amountRequested);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des infos de l'organisation",
        error
      );
    }
  };

  const handleOpenModal = async (organisationId, provisionId, amount) => {
    const selectedProvision = provisionRequests.find(
      (request) =>
        request.organisationId == organisationId && request.id === provisionId
    );
    if (selectedProvision) {
      setProvisionDetails(selectedProvision);
      setAmonutRequested(parseInt(selectedProvision.amount));
      await fetchOrganisationDetails(organisationId);
      onOpen();
    }
  };

  const updateWallet = async (id, updatedWallet) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${id}/wallet`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedWallet),
        }
      );

      if (!res.ok) throw new Error("Erreur lors de la mise jour du wallet");
      await await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/provision_requests/${provisionDetails.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        }
      );

      alert("Demande traitée avec succès");
      fetchData();
      onClose();
    } catch (error) {
      console.error("Erreur :", error.message);
      alert("Echec de la mise à jour du wallet :" + error.message);
    }
  };

  /*
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
  }; */

  const rejectProvisionRequest = async () => {
    if (!provisionDetails?.id) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/provision_requests/${provisionDetails.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "rejected" }),
        }
      );

      if (!res.ok) throw new Error("Erreur lors du refus de la demande.");

      alert("Demande refusée avec succès !");
      fetchData(); // Recharger toutes les données
      onClose(); // Fermer le modal
    } catch (error) {
      console.error("Erreur :", error.message);
      alert("Échec du refus de la demande : " + error.message);
    }
  };

  const filteredRequests = provisionRequests
    .filter((request) => {
      if (statusFilter === "all") return true;
      return request.status === statusFilter;
    })
    .filter((request) => {
      return Object.values(request)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  // Afficher le formulaire de connexion si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold mb-4">Authentification Requise</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex flex-col w-80 gap-4">
          <Input
            label="Numéro de téléphone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button color="primary" onPress={handleLogin}>
            Confirmer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">
        Liste des demandes d'approvisionnement
      </h3>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Rechercher des demandes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Toutes les demandes</option>
          <option value="pending">En attente</option>
          <option value="completed">Traitées</option>
          <option value="rejected">Refusées</option>
        </select>
        <Button color="primary" onPress={handleLogout}>
          Sortir
        </Button>
      </div>

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
              <TableCell>
                <span className="font-bold">
                  {request.paymentProviderDetails.type}
                </span>
              </TableCell>
              <TableCell>{request.paymentProviderDetails.number}</TableCell>
              <TableCell>
                <Button
                  color={
                    request.status === "completed"
                      ? "success"
                      : request.status === "pending"
                      ? "warning"
                      : request.status === "rejected"
                      ? "danger"
                      : "default"
                  }
                  onPress={() =>
                    handleOpenModal(
                      request.organisationId,
                      request.id,
                      request.amount
                    )
                  }
                  disabled={request.status === "completed"}
                >
                  {request.status === "completed"
                    ? "confirmer"
                    : request.status === "pending"
                    ? "en attente"
                    : request.status === "rejected"
                    ? "refusée"
                    : "indéfini"}
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
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={isValidSize(sixes) ? sixes : "5xl"}
      >
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
                        className="h-12 w-12 hover:scale-110  transition-all"
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
                  <strong>NOM DE L'ORGANISATION</strong>
                  <div>{provisionDetails?.organisationName}</div>
                </div>
                <div>
                  <strong>OPERATEUR</strong>
                  <div>{provisionDetails?.paymentProviderLabel}</div>
                </div>
                <div>
                  <strong>STATUT</strong>
                  <div>
                    {provisionDetails?.status == "pending" ? (
                      <Button color="danger">en attente</Button>
                    ) : provisionDetails?.status == "completed" ? (
                      <Button color="success">confirmé</Button>
                    ) : (
                      ""
                    )}
                  </div>
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
            {/*
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
            )} */}
            {orgDetails && (
              <div className="flex flex-col gap-4">
                {provisionDetails?.status === "completed" ? (
                  <>
                    <>
                      <h2 className="text-success-400">Demande Traitée</h2>
                      <Input
                        label="Montant demandé"
                        value={`${amountRequested} XOF`}
                        readOnly
                      />
                      <Input
                        label="Solde actuel"
                        value={`${orgDetails.wallet?.balance} XOF`}
                        readOnly
                      />
                    </>
                  </>
                ) : provisionDetails?.status === "rejected" ? (
                  <>
                    <h2 className="text-danger-400">Demande refusée</h2>
                    <Input
                      label="Solde actuel"
                      value={`${orgDetails.wallet?.balance} XOF`}
                      readOnly
                    />
                    <Input
                      label="Montant demandé"
                      value={`${amountRequested} XOF`}
                      readOnly
                    />
                  </>
                ) : provisionDetails?.status === "pending" ? (
                  <>
                    <h2 className="text-yellow-400">Demande en attente</h2>
                    <Input
                      label="Solde actuel"
                      value={`${orgDetails.wallet?.balance} XOF`}
                      readOnly
                    />
                    <Input
                      label="Montant demandé"
                      value={`${amountRequested} XOF`}
                      readOnly
                    />
                    <Input
                      label="Total après approvisionnement"
                      value={`${
                        orgDetails.wallet?.balance + amountRequested
                      } XOF`}
                      readOnly
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            {provisionDetails?.status === "pending" ? (
              <>
                <Button color="warning" onPress={rejectProvisionRequest}>
                  Refuser
                </Button>
                <Button color="danger" onPress={onClose}>
                  Annuler
                </Button>
                <Button
                  color="success"
                  onPress={() =>
                    updateWallet(orgDetails.organisationId, {
                      balance: orgDetails.wallet?.balance + amountRequested,
                    })
                  }
                >
                  Confirmer
                </Button>
              </>
            ) : provisionDetails?.status === "completed" ? (
              <>
                <Button color="primary" onPress={onClose}>
                  fermer
                </Button>
              </>
            ) : provisionDetails?.status === "rejected" ? (
              <>
                {" "}
                <Button color="primary" onPress={onClose}>
                  fermer
                </Button>
              </>
            ) : (
              <></>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
