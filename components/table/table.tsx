import React, { useEffect, useState } from "react";
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Input,
} from "@nextui-org/react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { AddUser } from "@/components/accounts/add-user";

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

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data); // Initialiser la liste filtrée
    };

    fetchUsers();
  }, []);

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
      <h3 className="text-xl font-semibold">Tous les utilisateurs</h3>

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
                {new Date(item.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <img
                  src={item?.profileImage || "/user.png"}
                  alt={`${item?.fullname} profile`}
                  style={{ width: 30, height: 30, borderRadius: "50%" }}
                />
              </TableCell>
              <TableCell>
                <Link href={`/accounts/${item.userUuid}`}>Voir</Link>
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
    </div>
  );
};
