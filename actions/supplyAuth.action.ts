"use server";

import { cookies } from "next/headers";

export const createSupplyAuthCookie = async (authToken: string) => {
  cookies().set("supplyAuth", authToken, {
    secure: true,
    path: "/supply",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const deleteSupplyAuthCookie = async () => {
  cookies().delete("supplyAuth");
};
