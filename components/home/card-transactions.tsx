import { Avatar, Card, CardBody } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export const CardTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/transactions`
        );
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des transactions.");
        }
        const data = await res.json();

        // Parse et enrichit les transactions
        const formattedTransactions = data
          .slice(0, 5)
          .map((transaction: any) => {
            try {
              if (transaction.paymentDetails) {
                transaction.paymentDetails = JSON.parse(
                  transaction.paymentDetails
                );
              }
            } catch (error) {
              console.error(
                `Erreur lors du parsing de paymentDetails pour la transaction ID ${transaction.transactionId}`,
                error
              );
              transaction.paymentDetails = {};
            }
            return transaction;
          });

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error("Erreur:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Card className=" bg-default-50 rounded-xl shadow-md px-3">
      <CardBody className="py-5 gap-4">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">
              Dernières Transactions
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-default-500">Chargement...</p>
        ) : transactions.length > 0 ? (
          <div className="flex flex-col gap-6">
            {transactions.map((transaction: any, index: number) => (
              <div key={index} className="grid grid-cols-4 w-full">
                {/* Image basée sur le provider ou type */}
                <div className="w-full">
                  {transaction.paymentDetails?.provider === "wave" ? (
                    <img src="/wave.png" alt="Wave" className="h-8 w-8" />
                  ) : transaction.paymentDetails?.provider === "orange" ? (
                    <img src="/orange.jpg" alt="Orange" className="h-8 w-8" />
                  ) : transaction.paymentDetails?.provider === "mtn" ? (
                    <img src="/mtn.png" alt="MTN" className="h-8 w-8" />
                  ) : transaction.paymentDetails?.provider === "moov" ? (
                    <img src="/moov.png" alt="Moov" className="h-8 w-8" />
                  ) : transaction.transactionType === "airtime" ? (
                    <img src="/air.png" alt="Airtime" className="h-8 w-8" />
                  ) : (
                    <span className="text-default-500 text-sm">
                      Non spécifié
                    </span>
                  )}
                </div>

                {/* Nom de l'organisation */}
                <span className="text-default-900 font-semibold text-xs">
                  {transaction.organisation?.name || "Nom inconnu"}
                </span>

                {/* Montant */}
                <div>
                  <span className="text-success text-xs">
                    {`${transaction.amount} FCFA` || "0 FCFA"}
                  </span>
                </div>

                {/* Date de création */}
                <div>
                  <span className="text-default-500 text-xs">
                    {transaction.createdAt
                      ? new Date(transaction.createdAt).toUTCString()
                      : "Date inconnue"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-default-500">
            Aucune transaction disponible.
          </p>
        )}
      </CardBody>
    </Card>
  );
};
