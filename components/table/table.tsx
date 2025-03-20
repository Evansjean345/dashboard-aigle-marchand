import React, { useEffect, useState } from "react";
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
} from "@nextui-org/react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { AddUser } from "@/components/accounts/add-user";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  cn,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

//select Icon

const AddNoteIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M7.37 22h9.25a4.87 4.87 0 0 0 4.87-4.87V8.37a4.87 4.87 0 0 0-4.87-4.87H7.37A4.87 4.87 0 0 0 2.5 8.37v8.75c0 2.7 2.18 4.88 4.87 4.88Z"
        fill="currentColor"
        opacity={0.4}
      />
      <path
        d="M8.29 6.29c-.42 0-.75-.34-.75-.75V2.75a.749.749 0 1 1 1.5 0v2.78c0 .42-.33.76-.75.76ZM15.71 6.29c-.42 0-.75-.34-.75-.75V2.75a.749.749 0 1 1 1.5 0v2.78c0 .42-.33.76-.75.76ZM12 14.75h-1.69V13c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1.75H7c-.41 0-.75.34-.75.75s.34.75.75.75h1.81V18c0 .41.34.75.75.75s.75-.34.75-.75v-1.75H12c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Z"
        fill="currentColor"
      />
    </svg>
  );
};

const CopyDocumentIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M15.5 13.15h-2.17c-1.78 0-3.23-1.44-3.23-3.23V7.75c0-.41-.33-.75-.75-.75H6.18C3.87 7 2 8.5 2 11.18v6.64C2 20.5 3.87 22 6.18 22h5.89c2.31 0 4.18-1.5 4.18-4.18V13.9c0-.42-.34-.75-.75-.75Z"
        fill="currentColor"
        opacity={0.4}
      />
      <path
        d="M17.82 2H11.93C9.67 2 7.84 3.44 7.76 6.01c.06 0 .11-.01.17-.01h5.89C16.13 6 18 7.5 18 10.18V16.83c0 .06-.01.11-.01.16 2.23-.07 4.01-1.55 4.01-4.16V6.18C22 3.5 20.13 2 17.82 2Z"
        fill="currentColor"
      />
      <path
        d="M11.98 7.15c-.31-.31-.84-.1-.84.33v2.62c0 1.1.93 2 2.07 2 .71.01 1.7.01 2.55.01.43 0 .65-.5.35-.8-1.09-1.09-3.03-3.04-4.13-4.16Z"
        fill="currentColor"
      />
    </svg>
  );
};

const EditDocumentIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M15.48 3H7.52C4.07 3 2 5.06 2 8.52v7.95C2 19.94 4.07 22 7.52 22h7.95c3.46 0 5.52-2.06 5.52-5.52V8.52C21 5.06 18.93 3 15.48 3Z"
        fill="currentColor"
        opacity={0.4}
      />
      <path
        d="M21.02 2.98c-1.79-1.8-3.54-1.84-5.38 0L14.51 4.1c-.1.1-.13.24-.09.37.7 2.45 2.66 4.41 5.11 5.11.03.01.08.01.11.01.1 0 .2-.04.27-.11l1.11-1.12c.91-.91 1.36-1.78 1.36-2.67 0-.9-.45-1.79-1.36-2.71ZM17.86 10.42c-.27-.13-.53-.26-.77-.41-.2-.12-.4-.25-.59-.39-.16-.1-.34-.25-.52-.4-.02-.01-.08-.06-.16-.14-.31-.25-.64-.59-.95-.96-.02-.02-.08-.08-.13-.17-.1-.11-.25-.3-.38-.51-.11-.14-.24-.34-.36-.55-.15-.25-.28-.5-.4-.76-.13-.28-.23-.54-.32-.79L7.9 10.72c-.35.35-.69 1.01-.76 1.5l-.43 2.98c-.09.63.08 1.22.47 1.61.33.33.78.5 1.28.5.11 0 .22-.01.33-.02l2.97-.42c.49-.07 1.15-.4 1.5-.76l5.38-5.38c-.25-.08-.5-.19-.78-.31Z"
        fill="currentColor"
      />
    </svg>
  );
};

const DeleteDocumentIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.07 5.23c-1.61-.16-3.22-.28-4.84-.37v-.01l-.22-1.3c-.15-.92-.37-2.3-2.71-2.3h-2.62c-2.33 0-2.55 1.32-2.71 2.29l-.21 1.28c-.93.06-1.86.12-2.79.21l-2.04.2c-.42.04-.72.41-.68.82.04.41.4.71.82.67l2.04-.2c5.24-.52 10.52-.32 15.82.21h.08c.38 0 .71-.29.75-.68a.766.766 0 0 0-.69-.82Z"
        fill="currentColor"
      />
      <path
        d="M19.23 8.14c-.24-.25-.57-.39-.91-.39H5.68c-.34 0-.68.14-.91.39-.23.25-.36.59-.34.94l.62 10.26c.11 1.52.25 3.42 3.74 3.42h6.42c3.49 0 3.63-1.89 3.74-3.42l.62-10.25c.02-.36-.11-.7-.34-.95Z"
        fill="currentColor"
        opacity={0.399}
      />
      <path
        clipRule="evenodd"
        d="M9.58 17a.75.75 0 0 1 .75-.75h3.33a.75.75 0 0 1 0 1.5h-3.33a.75.75 0 0 1-.75-.75ZM8.75 13a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

const columns = [
  { name: "Fullname", uid: "fullname" },
  { name: "Email", uid: "email" },
  { name: "Phone", uid: "phone" },
  { name: "Total Organizations", uid: "total_organizations" },
  { name: "Code du Pays", uid: "countryCode" },
  { name: "Date de creation", uid: "createdAt" },
  { name: "Date de mise a jour", uid: "updatedAt" },
  { name: "Profile Image", uid: "profile_image" },
  { name: "Actions", uid: "actions" },
];

export const TableWrapper = () => {
  const [users, setUsers] = useState([]); // Liste complète des utilisateurs
  const [filteredUsers, setFilteredUsers] = useState([]); // Liste filtrée
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [modalMessage, setModalMessage] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  //
  const router = useRouter();
  //icons
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data); // Initialiser la liste filtrée
    };

    fetchUsers();
  }, []);
  console.log(users);

  // Gérer la recherche dynamique
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter(
      (user) =>
        user.fullname.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value) ||
        user.phone?.toLowerCase().includes(value)
    );

    setFilteredUsers(filtered);
    setCurrentPage(1); // Réinitialiser à la première page après une recherche
  };

  // Calculer les utilisateurs à afficher pour la page courante
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  //initialize code pin

  const initializeCodePin = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/reset-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok)
        throw new Error("Echec de la réinitialisation du code PIN");
      setModalMessage("Code PIN réinitialisé avec succès");
      console.log(response);
    } catch (error) {
      console.error(error);
      setModalMessage("Erreur lors de la réinitialisation du code PIN");
    } finally {
      setIsSuccessModalOpen(true);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/delete-user-with-org`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok)
        throw new Error("Echec de la suppression de l'utilisateur");
      setModalMessage("Utilisateur supprimé avec succès");
    } catch (error) {
      setModalMessage("Erreur lors de la suppression de l'utilisateur");
      console.error(error);
    } finally {
      setIsSuccessModalOpen(true);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Échec de la mise à jour du statut");

      setModalMessage(`Utilisateur ${newStatus} avec succès`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error(error);
      setModalMessage("Erreur lors de la mise à jour du statut");
    } finally {
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Barre de navigation */}
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <UsersIcon />
          <span>Users</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      {/* Titre de la section */}
      <h3 className="text-xl font-semibold">Tous les clients</h3>

      {/* Barre de recherche et options */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search users"
            value={searchTerm}
            onChange={handleSearch} // Gestionnaire d'événement
          />
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <AddUser />
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Table des utilisateurs */}
      <Table aria-label="Example table with user data">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={currentUsers}>
          {(item) => (
            <TableRow key={item?.id}>
              <TableCell>{item?.fullname}</TableCell>
              <TableCell>{item?.email || "Non spécifié"}</TableCell>
              <TableCell>{item?.phone}</TableCell>
              <TableCell>
                {item?.meta?.total_organizations === 0
                  ? "Aucune organisation"
                  : `${item?.meta?.total_organizations} organisation`}
              </TableCell>
              <TableCell>{item.countryCode}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Chip color={item.status === "active" ? "success" : "danger"}>
                  {item.status}
                </Chip>
              </TableCell>
              <TableCell>
                <img
                  src={item?.profileImage || "/user.png"}
                  alt={`${item?.fullname} profile`}
                  style={{ width: 30, height: 30, borderRadius: "50%" }}
                />
              </TableCell>
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
                      // key="new"
                      // shortcut="⌘N"
                      onClick={() => {
                        router.push(`/accounts/${item?.userUuid}`);
                      }}
                      startContent={<AddNoteIcon className={iconClasses} />}
                    >
                      Voir détails
                    </DropdownItem>
                    <DropdownItem
                      //  key="copy"
                      // shortcut="⌘C"
                      onClick={() => initializeCodePin(item?.userUuid)}
                      startContent={
                        <CopyDocumentIcon className={iconClasses} />
                      }
                    >
                      Initialiser code pin
                    </DropdownItem>
                    <DropdownItem
                      // key="edit"
                      // shortcut="⌘⇧E"
                      startContent={
                        <EditDocumentIcon className={iconClasses} />
                      }
                      onClick={() =>
                        toggleUserStatus(item?.userUuid, item.status)
                      }
                    >
                      {item.status === "active"
                        ? "desactiver le compte"
                        : item.status === "inactive"
                        ? "activer le compte"
                        : ""}
                    </DropdownItem>
                    <DropdownItem
                      // key="delete"
                      className="text-danger"
                      color="danger"
                      onClick={() => deleteUser(item?.userUuid)}
                      // shortcut="⌘⇧D"
                      startContent={
                        <DeleteDocumentIcon
                          className={cn(iconClasses, "text-danger")}
                        />
                      }
                    >
                      Supprimer
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
        {/* Modal de succès ou d'échec */}
        <Modal isOpen={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
          <ModalContent>
            <ModalHeader>Information</ModalHeader>
            <ModalBody>
              <p>{modalMessage}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={async () => {
                  await setIsSuccessModalOpen(false);
                  await window.location.reload();
                }}
              >
                Fermer
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
