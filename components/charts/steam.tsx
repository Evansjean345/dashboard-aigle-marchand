import React, { useEffect, useState } from "react";
import Chart, { Props } from "react-apexcharts";

type SeriesData = {
  name: string;
  data: number[];
};

export const Steam = () => {
  const [series, setSeries] = useState<SeriesData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // Filtrage par période
  const [statusFilter, setStatusFilter] = useState("all"); // Filtrage par statut
  const [theme, setTheme] = useState("dark"); // Thème clair/sombre
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null); // Détails d'une transaction
  const [totals, setTotals] = useState({
    withdrawal: 0,
    payout: 0,
    airtime: 0,
  }); // Totaux
  const [activeFilter, setActiveFilter] = useState<string | null>(null); // Bouton actif (période)
  const [activeStatus, setActiveStatus] = useState<string | null>(null); // Bouton actif (statut)

  // Récupération des données de l'API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/transactions`
        );
        const data = await res.json();

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
  const options: Props["options"] = {
    chart: {
      type: "area",
      animations: {
        enabled: true,
        easing: "easeinout",
        dynamicAnimation: { speed: 800 },
      },
      id: "basic-bar",
      foreColor: theme === "dark" ? "#FFF" : "#000",
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
      labels: { style: { colors: theme === "dark" ? "#FFF" : "#000" } },
    },
    yaxis: {
      labels: { style: { colors: theme === "dark" ? "#FFF" : "#000" } },
    },
    grid: {
      show: true,
      borderColor: theme === "dark" ? "#444" : "#CCC",
    },
    stroke: { curve: "smooth" },
    colors: ["#007BFF", "#28A745", "#FF5733"], // Couleurs pour withdrawal, payout, airtime
  };

  // Export CSV
  const exportCSV = () => {
    const csvData = series
      .flatMap((s) =>
        s.data.map((amount, index) =>
          [s.name, categories[index], amount].join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
  };

  return (
    <div
      className={`w-full z-20 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
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
                  ? "bg-[#002d61] text-xs p-2 rounded-lg  "
                  : "hover:bg-[#002d61] hover:p-2 hover:text-xs hover:rounded-lg transition-all ease-in-out "
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
                  ? "bg-[#002d61] text-xs p-2 rounded-lg"
                  : "hover:bg-[#002d61] hover:p-2 hover:text-xs hover:rounded-lg transition-all ease-in-out"
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
          className="hover:bg-[#002d61] hover:p-2 hover:text-xs hover:rounded-lg transition-all ease-in-out"
        >
          Exporter CSV
        </button>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="hover:bg-[#002d61] hover:p-2 hover:text-xs hover:rounded-lg transition-all ease-in-out"
        >
          {theme === "dark" ? "Mode Clair" : "Mode Sombre"}
        </button>
      </div>

      <div className="text-center mb-4">
        <p>Total Withdrawal: {totals.withdrawal} XOF</p>
        <p>Total Payout: {totals.payout} XOF</p>
        <p>Total Airtime: {totals.airtime} XOF</p>
      </div>

      {loading ? (
        <p className="text-center text-default-500">Chargement...</p>
      ) : (
        <div id="chart">
          <Chart options={options} series={series} type="area" height={425} />
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
  );
};