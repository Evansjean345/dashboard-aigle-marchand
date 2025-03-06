"use client";

import { Steam } from "../charts/steam";

export const Table = () => {
  return (
    <div className="px-4 py-8">
      <h3 className="text-3xl font-semibold">Diagramme des transactions</h3>
      <br />
      <br />
      <Steam />
    </div>
  );
};
