"use client";

import React, { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type SeriesData = {
  name: string;
  data: number[];
};

export const Steam = () => {
  const { resolvedTheme } = useNextTheme();
  const [series, setSeries] = useState<SeriesData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // Filtrage par période
  const [statusFilter, setStatusFilter] = useState("all"); // Filtrage par statut
  const [theme, setTheme] = useState("white"); // Thème clair/sombre
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null); // Détails d'une transaction
  const [totals, setTotals] = useState({
    withdrawal: 0,
    payout: 0,
    airtime: 0,
  }); // Totaux
  const [activeFilter, setActiveFilter] = useState<string | null>(null); // Bouton actif (période)
  const [activeStatus, setActiveStatus] = useState<string | null>(null); // Bouton actif (statut)
  //for csv
  const [transactions, setTransactions] = useState<any[]>([]);

  // Récupération des données de l'API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/transactions`
        );
        const data = await res.json();

        setTransactions(data);

        // Filtrer les données selon la période
        const now = new Date();
        const filteredData = data.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          if (filter === "7days") {
            return (
              now.getTime() - transactionDate.getTime() <=
              7 * 24 * 60 * 60 * 1000
            );
          }
          if (filter === "30days") {
            return (
              now.getTime() - transactionDate.getTime() <=
              30 * 24 * 60 * 60 * 1000
            );
          }
          return true; // "all"
        });

        // Filtrer par statut
        const finalData = filteredData.filter((transaction) =>
          statusFilter === "all" ? true : transaction.status === statusFilter
        );

        // Regrouper les montants par transactionType
        const groupedData = finalData.reduce(
          (acc: Record<string, { dates: string[]; amounts: number[] }>, t) => {
            const { transactionType, amount, createdAt } = t;
            if (!acc[transactionType])
              acc[transactionType] = { dates: [], amounts: [] };
            acc[transactionType].dates.push(
              new Date(createdAt).toLocaleDateString()
            );
            acc[transactionType].amounts.push(amount);
            return acc;
          },
          {}
        );

        // Calculer les totaux
        setTotals({
          withdrawal:
            groupedData.withdrawal?.amounts.reduce((sum, a) => sum + a, 0) || 0,
          payout:
            groupedData.payout?.amounts.reduce((sum, a) => sum + a, 0) || 0,
          airtime:
            groupedData.airtime?.amounts.reduce((sum, a) => sum + a, 0) || 0,
        });

        // Calculer les totaux
        const totalWithdrawal =
          groupedData.withdrawal?.amounts.reduce((sum, a) => sum + a, 0) || 0;
        const totalPayout =
          groupedData.payout?.amounts.reduce((sum, a) => sum + a, 0) || 0;
        const totalAirtime =
          groupedData.airtime?.amounts.reduce((sum, a) => sum + a, 0) || 0;

        setTotals({
          withdrawal: totalWithdrawal,
          payout: totalPayout,
          airtime: totalAirtime,
        });
        // Convertir les données pour ApexCharts
        const formattedSeries = Object.entries(groupedData).map(
          ([key, values]) => ({
            name: key,
            data: (values as { dates: string[]; amounts: number[] }).amounts,
          })
        );

        setSeries(formattedSeries);
        setCategories(groupedData.airtime?.dates || []);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des transactions :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filter, statusFilter]);

  // Options du graphique
  const areaOptions: ApexOptions = {
    chart: {
      type: "area",
      animations: {
        enabled: true,
        easing: "easeinout",
        dynamicAnimation: { speed: 800 },
      },
      id: "basic-bar",
      foreColor: resolvedTheme === "dark" ? "#FFF" : "#000",
      stacked: true,
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, { dataPointIndex }) => {
          if (series[0] && Array.isArray(series[0].data)) {
            const transaction = series[0].data[dataPointIndex]; // Exemple avec "withdrawal"
            setSelectedTransaction(transaction);
          } else {
            console.error("Données de série non valides.");
          }
        },
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: { colors: resolvedTheme === "dark" ? "#FFF" : "#000" },
        rotate: -45,
      },
      tickPlacement: "on",
    },
    yaxis: {
      labels: { style: { colors: resolvedTheme === "dark" ? "#FFF" : "#000" } },
    },
    grid: {
      show: true,
      borderColor: resolvedTheme === "dark" ? "#444" : "#CCC",
    },
    stroke: { curve: "smooth" },
    colors: ["#007BFF", "#28A745", "#FF5733"], // Couleurs pour withdrawal, payout, airtime
  };

  /*
  const donutOptions: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: donutLabels,
    colors: ["#007BFF", "#28A745", "#FF5733"], // Couleurs distinctes pour withdrawal, payout et airtime
    legend: {
      position: "bottom",
      labels: {
        colors: resolvedTheme === "dark" ? "#FFF" : "#000",
      },
    },
  }; */

  const exportCSV = () => {
    if (transactions.length === 0) {
      console.error("Aucune transaction à exporter !");
      return;
    }

    const headers = [
      "ID",
      "Date",
      "Heure",
      "Reference",
      "Nom Compagnie",
      "Numero",
      "Type de Compte",
      "Currency",
      "Type Transaction",
      "Montant",
    ].join(",");

    const csvData = transactions
      .map((transaction) => {
        return [
          transaction.id,
          new Date(transaction.createdAt)?.toLocaleDateString(), // Date
          new Date(transaction.createdAt)?.toLocaleTimeString(), // Heure
          transaction.reference,
          transaction.organisation?.name || "N/A",
          transaction.organisation?.phone || "N/A",
          transaction.organisation?.accountType || "N/A",
          transaction.currency,
          transaction.transactionType,
          transaction.amount,
        ]
          .map((field) => `"${field}"`) // Ajout de guillemets pour éviter les problèmes avec les virgules
          .join(",");
      })
      .join("\n");

    const finalCsv = headers + "\n" + csvData;
    const blob = new Blob([finalCsv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
  };

  return (
    <>
      {/* Graphique Donut */}
      {/**
         <div className="mt-8">
        <Chart
          options={donutOptions}
          series={donutSeries || [0]}
          type="donut"
          width="380"
        />
      </div>
     */}
      <div
        className={`w-full z-20 ${
          resolvedTheme === "dark"
            ? "bg-black text-white border-2 border-[#aaaaaa]"
            : "bg-white text-black border-2 border-[#f2f3f5]"
        }`}
      >
        <div className="flex justify-between items-center pt-2 mb-4 px-4">
          <div className="flex gap-4">
            {["7days", "30days", "all"].map((key) => (
              <button
                key={key}
                onClick={() => {
                  setFilter(key);
                  setActiveFilter(key);
                }}
                className={`${
                  activeFilter === key
                    ? "bg-[white] text-[#002d61] border-[#002d61] border-2 text-xs p-2 rounded-lg"
                    : "bg-[#002d61] text-white  p-2 text-xs rounded-lg transition-all ease-in-out hover:border-2 hover:bg-[white] hover:text-[#002d61] hover:border-[#002d61]"
                }`}
              >
                {key === "7days"
                  ? "7 jours"
                  : key === "30days"
                  ? "30 jours"
                  : "Tout"}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            {["all", "success", "failed"].map((key) => (
              <button
                key={key}
                onClick={() => {
                  setStatusFilter(key);
                  setActiveStatus(key);
                }}
                className={`${
                  activeStatus === key
                    ? "bg-[white] text-[#002d61] border-[#002d61] border-2 text-xs p-2 rounded-lg"
                    : "bg-[#002d61] text-white  p-2 text-xs rounded-lg transition-all ease-in-out hover:border-2 hover:bg-[white] hover:text-[#002d61] hover:border-[#002d61]"
                }`}
              >
                {key === "all"
                  ? "Tous"
                  : key === "success"
                  ? "Succès"
                  : "Échoués"}
              </button>
            ))}
          </div>
          <button
            onClick={exportCSV}
            className="bg-[#002d61] p-2 text-xs rounded-lg transition-all ease-in-out text-white hover:border-2 hover:bg-[white] hover:text-[#002d61] hover:border-[#002d61]"
          >
            Exporter CSV
          </button>
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="bg-[#002d61] p-2 text-xs text-white rounded-lg hover:border-2 transition-all ease-in-out hover:bg-[white] hover:text-[#002d61] hover:border-[#002d61]"
          >
            {resolvedTheme === "dark" ? "Mode Clair" : "Mode Sombre"}
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="text-red-600 font-semibold dark:text-white">
            Total Withdrawal: {totals.withdrawal} XOF
          </p>
          <p className="text-green-600 font-semibold">
            Total Payout: {totals.payout} XOF
          </p>
          <p className="text-blue-700 font-semibold">
            Total Airtime: {totals.airtime} XOF
          </p>
        </div>

        {loading ? (
          <p className="text-center text-default-500">Chargement...</p>
        ) : (
          <div id="chart" className="overflow-x-scroll">
            <div className="max-w-full">
              <Chart
                options={areaOptions}
                series={series}
                type="area"
                height={525}
              />
            </div>
          </div>
        )}

        {selectedTransaction && (
          <div className="modal">
            <h3>Détails de la transaction</h3>
            <p>Type : {selectedTransaction.name}</p>
            <p>Montant : {selectedTransaction.amount} XOF</p>
            <button onClick={() => setSelectedTransaction(null)}>Fermer</button>
          </div>
        )}
      </div>
    </>
  );
};
