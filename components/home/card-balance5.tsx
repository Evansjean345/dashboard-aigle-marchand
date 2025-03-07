import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import { Community } from "../icons/community";

export const CardBalance5 = () => {
  return (
    <Card className="bg-gradient-to-br from-[#ffd140] to-[#ffcb05]  rounded-2xl shadow-2xl  px-1 py-2 w-full relative overflow-hidden">
      <CardBody>
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-gray-() font-semibold">
            <span>00 XOF</span>
            <span>solde paypal</span>
          </div>
          <img src="/paypal.svg" alt="" className="w-16 h-16" />
        </div>
      </CardBody>
    </Card>
  );
};
