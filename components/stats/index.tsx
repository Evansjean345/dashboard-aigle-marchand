"use client";

import { Steam } from "../charts/steam";
import { SteamTwo } from "../charts/steamTwo";

export const Table = () => {
  return (
    <div className="px-4 py-8">
      <h3 className="text-3xl font-semibold">Statistics</h3>
      <br />
      <br />
      <Steam />
      <br />
      <br />
      <h3 className="text-3xl font-semibold">Diagramme en ligne</h3>
      <br />
      <br />
      <SteamTwo />
    </div>
  );
};
