import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";

export const AddCommercials = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // États pour les champs du formulaire
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Fonction pour gérer la soumission du formulaire
  const handleAddUser = async () => {
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/commercials`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullname, phone, password }),
        }
      );

      if (response.ok) {
        alert("Utilisateur ajouté avec succès !");
        setFullname("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        onOpenChange(); // Fermer le modal
        await window.location.reload();
      } else {
        const data = await response.json();
        setError(data.message || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Impossible de se connecter au serveur.");
    }
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Ajouter des comptes
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ajout d'un nouveau compte
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Nom complet"
                  variant="bordered"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
                <Input
                  label="Numéro de téléphone"
                  variant="bordered"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label="Mot de passe"
                  type="password"
                  variant="bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  label="Confirmez le mot de passe"
                  type="password"
                  variant="bordered"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onClick={onClose}>
                  Fermer
                </Button>
                <Button color="primary" onPress={handleAddUser}>
                  Ajouter l'utilisateur
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
