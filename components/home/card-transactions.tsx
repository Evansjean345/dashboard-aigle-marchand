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
        setTransactions(data.slice(0, 5)); // Limiter à 5 transactions
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
                <div className="w-full">
                  <Avatar
                    isBordered
                    color="secondary"
                    src={
                      transaction.transactionType === "withdrawal"
                        ? "withdrawal.png" // Remplacez "img" par l'URL de votre image pour le type "withdrawal"
                        : transaction.transactionType === "payout"
                        ? "payout.png" // Remplacez "a" par l'URL de votre image pour le type "payout"
                        : transaction.transactionType === "airtime"
                        ? "transfer.png"
                        : ""
                    }
                  />
                </div>
                <span className="text-default-900 font-semibold">
                  {transaction.organisation?.name || "Nom inconnu"}
                </span>
                <div>
                  &nbsp; &nbsp;
                  <span className="text-success text-xs">
                    {`${transaction.amount} FCFA` || "0 FCFA"}
                  </span>
                </div>
                <div>
                  <span className="text-default-500 text-xs">
                    {transaction.createdAt
                      ? new Date(transaction.createdAt).toLocaleDateString()
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
