import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import { Community } from "../icons/community";

export const CardBalance4 = () => {
  return (
    <Card className=" bg-gradient-to-br from-[#696969] to-[#000000]  rounded-2xl shadow-2xl  px-1 py-2 w-full relative overflow-hidden">
      <CardBody>
        <div className="flex justify-between items-center">
          <div className="flex flex-col font-semibold text-white">
            <span>00 XOF</span>
            <span>solde mastercard</span>
          </div>
          <img src="/mastercard.svg" alt="" className="w-16 h-16" />
        </div>
      </CardBody>
    </Card>
  );
};
