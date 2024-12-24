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
  { name: "Nom de l'organisation", uid: "name" },
  { name: "Téléphone", uid: "phone" },
  { name: "Solde du portefeuille", uid: "balance" },
  { name: "Solde Airtime", uid: "transfert" },
  { name: "Date de création", uid: "createdAt" },
  { name: "Date de mise à jour", uid: "updatedAt" },
  { name: "Actions", uid: "actions" },
];

export const TableWrapper = () => {
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const organizationsPerPage = 5;

  const [orgDetails, setOrgDetails] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/organisations`
        );
        const data = await res.json();

        const transformedData = data.map((org) => ({
          id: org.id,
          organisationId: org.organisationId, // Inclure organisationId ici
          name: org.name,
          phone: org.phone,
          balance: org.wallet?.balance || 0,
          transfer: org.wallet?.transfer || 0,
          createdAt: new Date(org.createdAt).toLocaleDateString(),
          updatedAt: new Date(org.updatedAt).toLocaleDateString(),
          owner: org.owner,
          wallet: org.wallet,
        }));

        setOrganizations(transformedData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des organisations :",
          error
        );
      }
    };

    fetchOrganizations();
  }, []);

  const filteredOrganizations = organizations.filter((org) =>
    Object.values(org)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastOrg = currentPage * organizationsPerPage;
  const indexOfFirstOrg = indexOfLastOrg - organizationsPerPage;
  const currentOrganizations = filteredOrganizations.slice(
    indexOfFirstOrg,
    indexOfLastOrg
  );
  const totalPages = Math.ceil(
    filteredOrganizations.length / organizationsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const fetchOrgDetails = async (id) => {
    const selectedOrg = organizations.find((org) => org.id === id);
    if (selectedOrg) {
      setOrgDetails(selectedOrg);
      onOpen();
    }
  };

  const updateWallet = async (id, updatedWallet) => {
    try {
      // Trouver l'organisation par id
      const selectedOrg = organizations.find((org) => org.id === id);

      if (!selectedOrg || !selectedOrg.organisationId) {
        throw new Error(
          "Impossible de trouver l'identifiant 'organisationId' pour cette organisation"
        );
      }

      const orgUniqueId = selectedOrg.organisationId;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${orgUniqueId}/wallet`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedWallet),
        }
      );

      if (!res.ok) throw new Error("Erreur lors de la mise à jour du wallet");

      const updatedData = await res.json();

      // Mettre à jour l'état local pour refléter les nouvelles données
      setOrganizations((prevOrganizations) =>
        prevOrganizations.map((org) =>
          org.id === id
            ? { ...org, wallet: { ...org.wallet, ...updatedWallet } }
            : org
        )
      );

      alert("Wallet mis à jour avec succès !");
      await window.location.reload();
    } catch (error) {
      console.error("Erreur :", error.message);
      alert("Échec de la mise à jour du wallet : " + error.message);
    }
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Liste des organisations</h3>
      <Input
        placeholder="Rechercher des organisations"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        classNames={{ input: "w-full", mainWrapper: "w-full" }}
      />
      <Table aria-label="Tableau des organisations">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={currentOrganizations}>
          {(org) => (
            <TableRow key={org.id}>
              <TableCell>{org.name}</TableCell>
              <TableCell>{org.phone}</TableCell>
              <TableCell>{org.balance} XOF</TableCell>
              <TableCell>{org.transfer} XOF</TableCell>
              <TableCell>{org.createdAt}</TableCell>
              <TableCell>{org.updatedAt}</TableCell>
              <TableCell>
                <Button color="danger" onPress={() => fetchOrgDetails(org.id)}>
                  Approvisionner
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Approvisionner &nbsp;{orgDetails?.name}
          </ModalHeader>
          <ModalBody>
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
                updateWallet(orgDetails.id, {
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
