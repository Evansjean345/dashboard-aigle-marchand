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
import React, { useState, useEffect } from "react";

export const AddUser = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [countrycode, setCountryCode] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  //list des pays
  const [countries, setCountries] = useState([]);
  //message erreur ou success
  const [modalMessage, setModalMessage] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_SECONDARY}/api/countries`
        );
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des pays", error);
      }
    };
    fetchCountries();
  }, [isOpen]);

  const handleSubmit = async () => {
    const userData = {
      fullname,
      phone: phone,
      email,
      country_code: countrycode,
      password,
      company_name: companyName,
      company_phone_number: companyPhoneNumber,
      account_type: accountType,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        setModalMessage("✅ Nouveau compte créé avec succès !");
      } else {
        const errorData = await response.json();
        setModalMessage(
          `❌ Erreur : ${errorData.message || "Échec de l'enregistrement"}`
        );
      }
    } catch (error) {
      setModalMessage("❌ Erreur lors de la création du compte");
    } finally {
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <div>
      <>
        <Button onPress={onOpen} color="primary">
          Ajouter un client
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
          size="3xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Créer un compte
                </ModalHeader>
                <ModalBody>
                  <div className="flex justify-between gap-3 w-full">
                    <div className="w-1/2 flex flex-col gap-2">
                      {/*Select country */}
                      <div className="mt-1 flex flex-col">
                        <label>Selectionnez un pays :</label>
                        <select
                          className="w-full cursor-pointer rounded-xl mt-1 border-2 border-[#b7b5b5] px-2 py-2"
                          value={countrycode}
                          onChange={(e) => setCountryCode(e.target.value)}
                        >
                          <option value="">Sélectionnez un pays</option>
                          {countries?.map((country) => (
                            <option
                              key={country.isoTwo}
                              value={country.isoTwo.toLowerCase()}
                            >
                              {country.flag} {country.isoThree}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="Nom de l'entreprise"
                        variant="bordered"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                      <Input
                        label="Nom du gérant"
                        variant="bordered"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                      />
                      <Input
                        label="Numéro du gérant"
                        variant="bordered"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="w-1/2 flex flex-col gap-2">
                      {/*Select country */}
                      <div className="mt-1 flex flex-col">
                        <label>Type de compte :</label>
                        <select
                          className="w-full cursor-pointer rounded-xl mt-1 border-2 border-[#b7b5b5] px-2 py-2"
                          value={accountType}
                          onChange={(e) => setAccountType(e.target.value)}
                        >
                          <option value="">Sélectionnez un type</option>
                          <option value="pdv">Point de Vente (PDV)</option>
                          <option value="marchand">Marchand</option>
                        </select>
                      </div>
                      <Input
                        label="Numero de l'entreprise"
                        variant="bordered"
                        value={companyPhoneNumber}
                        onChange={(e) => setCompanyPhoneNumber(e.target.value)}
                      />
                      <Input
                        label="Email du gérant"
                        variant="bordered"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        label="code pin"
                        type="password"
                        variant="bordered"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    fermer
                  </Button>
                  <Button color="primary" onPress={handleSubmit}>
                    Valider
                  </Button>
                </ModalFooter>
              </>
            )}
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
                  setTimeout(() => window.location.reload(), 2000);
                }}
              >
                Fermer
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
