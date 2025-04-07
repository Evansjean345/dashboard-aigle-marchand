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
  { name: "Nom complet", uid: "fullname" },
  { name: "Email", uid: "email" },
  { name: "Téléphone", uid: "phone" },
  { name: "Total Organisations", uid: "total_organizations" },
  { name: "Date de création", uid: "createdAt" },
  { name: "Date de mise à jour", uid: "updatedAt" },
  { name: "Actions", uid: "actions" },
];

const TableWrapper = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  // État pour le modal
  const [userDetails, setUserDetails] = useState(null); // Détails de l'utilisateur
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook pour gérer le modal

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
        const data = await res.json();

        // Ajuster les données en fonction de la réponse API
        const transformedData = data.map((user) => ({
          ...user,
          total_organizations: user.meta?.total_organizations || 0,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
          updatedAt: new Date(user.updatedAt).toLocaleDateString(),
        }));

        setUsers(transformedData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
      }
    };

    fetchUsers();
  }, []);

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter((user) =>
    Object.values(user)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Fonction pour récupérer les détails d'un utilisateur
  const fetchUserDetails = async (userUuid) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userUuid}`
      );
      if (!res.ok) throw new Error("Utilisateur introuvable");
      const data = await res.json();
      setUserDetails(data); // Met à jour les données affichées dans le modal
      onOpen(); // Ouvre le modal
    } catch (error) {
      console.error("Erreur :", error.message);
      setUserDetails(null);
    }
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Tous les clients</h3>

      {/* Recherche */}
      <Input
        placeholder="Rechercher des utilisateurs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        classNames={{
          input: "w-full",
          mainWrapper: "w-full",
        }}
      />

      {/* Table */}
      <Table aria-label="Tableau des utilisateurs">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={currentUsers}>
          {(user) => (
            <TableRow key={user.userUuid}>
              <TableCell>{user.fullname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.total_organizations}</TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell>{user.updatedAt}</TableCell>
              <TableCell>
                <Button onPress={() => fetchUserDetails(user.userUuid)}>
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
          <ModalHeader>Détails de l'utilisateur</ModalHeader>
          <ModalBody>
            {userDetails ? (
              <div>
                <p>
                  <strong>Nom complet :</strong> {userDetails.fullname}
                </p>
                <p>
                  <strong>Email :</strong> {userDetails.email}
                </p>
                <p>
                  <strong>Téléphone :</strong> {userDetails.phone}
                </p>
                <p>
                  <strong>Code du pays :</strong> {userDetails.countryCode}
                </p>
                <p>
                  <strong>Nombre d'organisations :</strong>{" "}
                  {userDetails.meta?.total_organizations || "Aucune"}
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
