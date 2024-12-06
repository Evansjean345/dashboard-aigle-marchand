"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
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
} from "@nextui-org/react"; // Importation des composants de NextUI

const UserPage = ({ params }: { params: { userUuid: string } }) => {
  const [user, setUser] = useState<any>(null); // État pour l'utilisateur
  const [organisations, setOrganisations] = useState<any[]>([]); // État pour les organisations
  const { userUuid } = params; // Récupération du userUuid à partir des params
  const [loading, setLoading] = useState<boolean>(false); // État pour gérer le chargement

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userUuid}`
        );
        const userData = await userRes.json();
        setUser(userData); // Mettre à jour les informations utilisateur
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur:",
          error
        );
      }
    };

    fetchUserData();
  }, [userUuid]);

  // Fonction pour récupérer les organisations de l'utilisateur
  const fetchOrganisations = async (userUuid: string) => {
    setLoading(true); // Début du chargement
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userUuid}/organisations`
      );
      const data = await res.json();
      setOrganisations(data); // Mettre à jour l'état avec les organisations
    } catch (error) {
      console.error("Erreur lors de la récupération des organisations:", error);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Affichage conditionnel pendant le chargement
  if (!user) {
    return <p>Chargement...</p>;
  }

  // Colonnes du tableau pour afficher les informations utilisateur
  const columns = [
    { name: "Nom complet", uid: "fullname" },
    { name: "Email", uid: "email" },
    { name: "Code pays", uid: "countryCode" },
    { name: "Numéro de téléphone", uid: "phone" },
    { name: "Date de création", uid: "createdAt" },
    { name: "Date de mise à jour", uid: "updatedAt" },
    { name: "Organisations", uid: "organisations" }, // Nouvelle colonne pour afficher les détails des organisations
  ];

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      {/* Breadcrumb */}
      <ul className="flex">
        <li className="flex gap-2">
          <span>Home</span> / <span>Utilisateurs</span> /{" "}
          <span>{user.fullname}</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">
        Détails de l'utilisateur {user.fullname}
      </h3>

      {/* Table des informations utilisateur */}
      <Table aria-label="Tableau des détails utilisateur">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={[user]}>
          {(item) => (
            <TableRow key={item.userUuid}>
              <TableCell>{item.fullname}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.countryCode}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(item.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  className="bg-[#0070f0]"
                  onPress={() => fetchOrganisations(item.userUuid)}
                >
                  Voir les organisations
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal pour afficher les organisations */}
      {organisations.length > 0 && (
        <Modal
          isOpen={organisations.length > 0}
          onClose={() => setOrganisations([])}
        >
          <ModalContent>
            <ModalHeader>Organisations affiliées</ModalHeader>
            <ModalBody>
              {loading ? (
                <p>Chargement des organisations...</p>
              ) : organisations.length > 0 ? (
                organisations.map((org) => (
                  <div key={org.organisationId} className="mb-4">
                    <h4 className="text-lg font-semibold">{org.name}</h4>
                    <p>
                      <strong>Numéro de téléphone :</strong> {org.phone}
                    </p>
                    <p>
                      <strong>Type de compte :</strong> {org.accountType}
                    </p>
                    <p>
                      <strong>Type d'organisation :</strong>{" "}
                      {org.organisationType}
                    </p>
                    <p>
                      <strong>Status :</strong> {org.status}
                    </p>
                    <p>
                      <strong>Rôle utilisateur :</strong> {org.meta.pivot_role}
                    </p>
                    <p>
                      <strong>Date de création :</strong>{" "}
                      {new Date(org.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Date de mise à jour :</strong>{" "}
                      {new Date(org.updatedAt).toLocaleDateString()}
                    </p>
                    <hr className="my-2" />
                  </div>
                ))
              ) : (
                <p>Aucune organisation affiliée trouvée.</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onPress={() => setOrganisations([])}>
                Fermer
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default UserPage;
