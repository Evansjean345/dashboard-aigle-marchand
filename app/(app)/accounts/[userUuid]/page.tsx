"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  /*
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow, */
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Tabs,
  Tab,
  Card,
  CardBody,
} from "@nextui-org/react"; // Importation des composants de NextUI
import { useRouter } from "next/navigation";

const UserPage = ({ params }: { params: { userUuid: string } }) => {
  const [user, setUser] = useState<any>(null); // État pour l'utilisateur
  const [organisations, setOrganisations] = useState<any[]>([]); // État pour les organisations
  const { userUuid } = params; // Récupération du userUuid à partir des params
  const [loading, setLoading] = useState<boolean>(false); // État pour gérer le chargement
  const router = useRouter();

  // États pour le modal de modification
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedOrganisation, setSelectedOrganisation] = useState<any>(null);
  const [editedName, setEditedName] = useState("");
  const [editedStatus, setEditedStatus] = useState("active");
  const [editedPhone, setEditedPhone] = useState("");

  //message erreur ou success
  const [modalMessage, setModalMessage] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [newOrganisationName, setNewOrganisationName] = useState("");
  const [newOrganisationPhone, setNewOrganisationPhone] = useState("");
  const [addOrganisationLoading, setAddOrganisationLoading] = useState(false);

  // Fonction pour récupérer les informations de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userUuid}`
        );
        const userData = await userRes.json();
        setUser(userData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur:",
          error
        );
      }
    };

    // Fonction pour récupérer les organisations
    const fetchOrganisations = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userUuid}/organisations`
        );
        const data = await res.json();
        setOrganisations(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des organisations:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    // Exécuter les deux fetch en même temps
    fetchUserData();
    fetchOrganisations();
  }, [userUuid]);

  // Fonction pour supprimer une organisation
  const handleDelete = async (organisationId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${organisationId}/user/${userUuid}/delete-org`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setOrganisations(
          organisations.filter((org) => org.organisationId !== organisationId)
        );
        setModalMessage("✅ l'organisation a été supprimée avec succès !");
      } else {
        console.error("Échec de la suppression de l'organisation.");
        setModalMessage(
          `❌ Erreur : "Échec de la suppression de l'organisation."}`
        );
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'organisation:", error);
      setModalMessage(
        `❌ Erreur : ${
          error.message || "Erreur lors de la suppression de l'organisation"
        }`
      );
    } finally {
      setIsSuccessModalOpen(true);
    }
  };

  // Fonction pour ouvrir le modal et remplir les champs avec les valeurs actuelles
  const openEditModal = (organisation: any) => {
    setSelectedOrganisation(organisation);
    setEditedName(organisation.name);
    setEditedStatus(organisation.status);
    setEditedPhone(organisation.phone);
    onOpen();
  };

  // Fonction pour modifier une organisation
  const handleEdit = async () => {
    if (!selectedOrganisation) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/${selectedOrganisation.organisationId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editedName,
            status: editedStatus,
            phone: editedPhone,
          }),
        }
      );

      if (res.ok) {
        setOrganisations(
          organisations.map((org) =>
            org.organisationId === selectedOrganisation.organisationId
              ? {
                  ...org,
                  name: editedName,
                  status: editedStatus,
                  phone: editedPhone,
                }
              : org
          )
        );
        onOpenChange(); // Fermer le modal après mise à jour
        setModalMessage("✅ Les informations ont bien été mises à jour");
      } else {
        console.error("Échec de la mise à jour de l'organisation.");
        setModalMessage(
          `❌ Erreur : Erreur lors de la mise à jour de l'organisation:`
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'organisation:", error);
      setModalMessage(
        `❌ Erreur : ${
          error.message || "Erreur lors de la mise à jour de l'organisation"
        }`
      );
    } finally {
      setIsSuccessModalOpen(true);
    }
  };

  console.log(organisations);
  

  // Colonnes du tableau pour afficher les informations utilisateur
  /*
  const columns = [
    { name: "Nom complet", uid: "fullname" },
    { name: "Email", uid: "email" },
    { name: "Code pays", uid: "countryCode" },
    { name: "Numéro de téléphone", uid: "phone" },
    { name: "Date de création", uid: "createdAt" },
    { name: "Date de mise à jour", uid: "updatedAt" },
    { name: "Organisations", uid: "organisations" }, // Nouvelle colonne pour afficher les détails des organisations
  ]; */

  const handleAddOrganisation = async () => {
    if (!newOrganisationName || !newOrganisationPhone) {
      setModalMessage("❌ Veuillez remplir tous les champs.");
      setIsSuccessModalOpen(true);
      return;
    }

    setAddOrganisationLoading(true);

    // Trouver l'organisation la plus récente
    const latestOrganisation = organisations
      .filter((org) => org.userId === userUuid) // S'assurer que c'est bien l'utilisateur en cours
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

    const parentOrganisationId = latestOrganisation?.organisationId || null; // Si aucune org, parent_id reste null

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/organisations/create-sub`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parent_id: parentOrganisationId, // Utiliser l'organisation la plus récente comme parent
            company_name: newOrganisationName,
            company_phone_number: newOrganisationPhone,
          }),
        }
      );

      if (res.ok) {
        const newOrg = await res.json();
        setOrganisations([...organisations, newOrg]); // Mise à jour de la liste
        setNewOrganisationName("");
        setNewOrganisationPhone("");
        setModalMessage("✅ L'organisation a été ajoutée avec succès !");
      } else {
        setModalMessage("❌ Erreur lors de l'ajout de l'organisation.");
      }
    } catch (error) {
      setModalMessage(
        `❌ Erreur : ${error.message || "Impossible d'ajouter l'organisation."}`
      );
    } finally {
      setIsSuccessModalOpen(true);
      setAddOrganisationLoading(false);
      await setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  // Affichage conditionnel pendant le chargement
  if (!user || loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      {/* Breadcrumb */}
      <ul className="flex">
        <li className="flex gap-2">
          <span
            className="text-[#0070f0] cursor-pointer font-semibold"
            onClick={() => router.push("/accounts")}
          >
            Retour
          </span>{" "}
          / <span className="text-xl">{user.fullname}</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">
        Détails du client {user?.fullname}
      </h3>

      {/* Table des informations utilisateur */}
      {/*
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
      </Table> */}

      <div className="flex w-full flex-col">
        <Tabs aria-label="Options">
          <Tab key="details" title={`Détails de ${user?.fullname}`}>
            <Card>
              <CardBody>
                <div className="flex w-full  gap-3 py-2 px-4">
                  <div className="flex flex-col gap-2 w-1/2">
                    <label className="font-semibold">Nom complet</label>
                    <Input value={user?.fullname} readOnly />
                    <label className="font-semibold">Email</label>
                    <Input value={user?.email} readOnly />
                    <label className="font-semibold">Code du pays</label>
                    <Input value={user?.countryCode} readOnly />
                  </div>
                  <div className="flex flex-col gap-2 w-1/2">
                    <label className="font-semibold">Numéro du client</label>
                    <Input value={user?.fullname} readOnly />
                    <label className="font-semibold">Date de création</label>
                    <Input
                      value={new Date(user?.createdAt).toString()}
                      readOnly
                    />
                    <label className="font-semibold">Date de mise à jour</label>
                    <Input
                      value={new Date(user?.updatedAt).toString()}
                      readOnly
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="organisations" title="Listes des organisations">
            <Card>
              <CardBody>
                {loading ? (
                  <p>Chargement des organisations...</p>
                ) : organisations.length > 0 ? (
                  organisations.map((org) => (
                    <>
                      <div className="flex flex-col w-full relative  gap-4 py-16 px-1 md:px-8 my-2  border-[0.1px] rounded-xl">
                        <label className="font-semibold text-xl absolute top-2 left-8">
                          {org?.name}
                        </label>
                        <div className="flex w-full  gap-3 px-2">
                          <div className="flex flex-col gap-2 w-1/2">
                            <label className="font-semibold">
                              Nom de l'entreprise
                            </label>
                            <Input value={org?.name} readOnly />
                            <label className="font-semibold">
                              Numéro de l'entreprise
                            </label>
                            <Input value={org?.phone} readOnly />
                            <label className="font-semibold">
                              Type d'organisation
                            </label>
                            <Input
                              value={
                                org?.organisationType === "main"
                                  ? "ORGANISATION PRINCIPALE"
                                  : org?.organisationType === "sub"
                                  ? "ORGANISATION SECONDAIRE"
                                  : ""
                              }
                              readOnly
                            />
                          </div>
                          <div className="flex flex-col gap-2 w-1/2">
                            <label className="font-semibold">
                              Status de l'organisation
                            </label>
                            <Input value={org?.status} readOnly />
                            <label className="font-semibold">
                              Date de création
                            </label>
                            <Input
                              value={new Date(org?.createdAt).toString()}
                              readOnly
                            />
                            <label className="font-semibold">
                              Date de mise à jour
                            </label>
                            <Input
                              value={new Date(org?.updatedAt).toString()}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end md:flex-row flex-col gap-4 right-8">
                          <Button
                            color="danger"
                            onPress={() => handleDelete(org.organisationId)}
                          >
                            supprimer {org?.name}
                          </Button>
                          <Button
                            className="bg-[#0070f0]"
                            onPress={() => openEditModal(org)}
                          >
                            Modifier les informations
                          </Button>
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <p>Aucune organisation affiliée trouvée.</p>
                )}
              </CardBody>
            </Card>
          </Tab>
          <Tab key="add" title="Ajouter une nouvelle organisation">
            <Card>
              <CardBody>
                <div className="flex flex-col gap-4">
                  <label className="font-semibold">Nom de l'organisation</label>
                  <Input
                    value={newOrganisationName}
                    onChange={(e) => setNewOrganisationName(e.target.value)}
                    placeholder="Nom de l'entreprise"
                  />

                  <label className="font-semibold">
                    Numéro de l'organisation
                  </label>
                  <Input
                    value={newOrganisationPhone}
                    onChange={(e) => setNewOrganisationPhone(e.target.value)}
                    placeholder="Numéro de téléphone"
                  />

                  <Button
                    className="bg-[#0070f0] mt-2"
                    onClick={handleAddOrganisation}
                    isLoading={addOrganisationLoading}
                  >
                    Ajouter l'organisation
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>

        {/*
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
                        <strong>Rôle utilisateur :</strong>{" "}
                        {org.meta.pivot_role}
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
                    </div> */}
      </div>

      {/* Modal de modification */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Modifier l'organisation</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <label className="font-semibold">Nom de l'organisation</label>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />

              <label className="font-semibold">Status</label>
              <select
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value)}
                className="px-2 py-1 rounded-xl cursor-pointer"
              >
                <option key="active" value="active">
                  Active
                </option>
                <option key="inactive" value="inactive">
                  Inactive
                </option>
              </select>

              <label className="font-semibold">Numéro de l'organisation</label>
              <Input
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onOpenChange}>Annuler</Button>
            <Button className="bg-[#0070f0]" onClick={handleEdit}>
              Modifier
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de réponse */}
      <Modal isOpen={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <ModalContent>
          <ModalHeader>Information</ModalHeader>
          <ModalBody>
            <p>{modalMessage}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                setIsSuccessModalOpen(false);
              }}
            >
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserPage;
