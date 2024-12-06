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
import { AddCommercials } from "./add-commercials";

const columns = [
  { name: "Nom complet", uid: "fullname" },
  { name: "Téléphone", uid: "phone" },
  { name: "Date de création", uid: "createdAt" },
  { name: "Date de mise à jour", uid: "updatedAt" },
  { name: "Actions", uid: "actions" },
];

export const TableWrapper = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // État pour le modal
  const [userDetails, setUserDetails] = useState(null); // Détails de l'utilisateur
  const [isUpdating, setIsUpdating] = useState(false); // Chargement pour la requête PUT
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/commercials`
        );
        const data = await res.json();

        const transformedData = data.map((user) => ({
          ...user,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
          updatedAt: new Date(user.updatedAt).toLocaleDateString(),
        }));

        setUsers(transformedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des comptes:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    Object.values(user)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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

  const fetchUserDetails = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/commercials/${id}`
      );
      if (!res.ok) throw new Error("Utilisateur introuvable");
      const data = await res.json();
      setUserDetails(data); // Charge les détails pour le modal
      onOpen();
    } catch (error) {
      console.error("Erreur :", error.message);
      setUserDetails(null);
    }
  };

  const handleInputChange = (field, value) => {
    setUserDetails((prev) => ({
      ...prev,
      [field]: value !== "" ? value : null, // Mettre à jour seulement si une valeur est fournie
    }));
  };

  const handleUpdateUser = async () => {
    if (!userDetails) return;

    setIsUpdating(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/commercials/${userDetails.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname: userDetails.fullname,
            phone: userDetails.phone,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Échec de la mise à jour");
      }

      const updatedUser = await res.json();

      // Mettez à jour la liste des utilisateurs
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        )
      );

      alert("Utilisateur mis à jour avec succès !");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = confirm(
      "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/commercials/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Échec de la suppression de l'utilisateur");
      }

      // Mise à jour de la liste des utilisateurs après suppression
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      alert("Utilisateur supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Tous les comptes</h3>

      <div className="flex gap-4 items-center">
        {/* Recherche */}
        <Input
          placeholder="Rechercher des comptes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          classNames={{
            input: "w-full",
            mainWrapper: "w-full",
          }}
        />
        <AddCommercials />
      </div>

      {/* Table */}
      <Table aria-label="Tableau des comptes">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={currentUsers}>
          {(user) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullname}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell>{user.updatedAt}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button onPress={() => fetchUserDetails(user.id)}>
                    Détails
                  </Button>
                  <Button
                    color="danger"
                    onPress={() => handleDeleteUser(user.id)}
                  >
                    Supprimer
                  </Button>
                </div>
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

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Détails du compte</ModalHeader>
          <ModalBody>
            {userDetails ? (
              <div className="flex flex-col gap-4">
                <Input
                  label="Nom complet"
                  variant="bordered"
                  value={userDetails.fullname}
                  onChange={(e) =>
                    handleInputChange("fullname", e.target.value)
                  }
                />
                <Input
                  label="Téléphone"
                  variant="bordered"
                  value={userDetails.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
                <Input
                  label="Mot de passe"
                  type="password"
                  variant="bordered"
                  placeholder="Laissez vide pour ne pas modifier"
                  onChange={(e) => {
                    const newValue = e.target.value;
                    handleInputChange("password", newValue || null);
                  }}
                />
              </div>
            ) : (
              <p>Chargement des détails...</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              onPress={handleUpdateUser}
              isDisabled={isUpdating}
            >
              {isUpdating ? "Mise à jour..." : "Modifier"}
            </Button>
            <Button color="danger" onPress={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
