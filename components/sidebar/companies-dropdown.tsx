import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import React from "react";
import { AcmeIcon } from "../icons/acme-icon";
import { AcmeLogo } from "../icons/acmelogo";
import { BottomIcon } from "../icons/sidebar/bottom-icon";

export const CompaniesDropdown = () => {
  return (
    <Dropdown classNames={{ base: "w-full" }}>
      <DropdownTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          <img src="/aigle.png" alt="Logo" className="h-44" />
          <BottomIcon />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Company Selection">
        <DropdownSection title="Companies">
          <DropdownItem
            key="1"
            startContent={<AcmeIcon />}
            description="San Francisco, CA"
            classNames={{ base: "py-4", title: "text-base font-semibold" }}
          >
            Facebook
          </DropdownItem>
          {/*
            <DropdownItem
            key="2"
            startContent={<AcmeLogo />}
            description="Austin, TX"
            classNames={{ base: "py-4", title: "text-base font-semibold" }}
          >
            Instagram
          </DropdownItem>
          <DropdownItem
            key="3"
            startContent={<AcmeIcon />}
            description="Brooklyn, NY"
            classNames={{ base: "py-4", title: "text-base font-semibold" }}
          >
            Twitter
          </DropdownItem>
          <DropdownItem
            key="4"
            startContent={<AcmeIcon />}
            description="Palo Alto, CA"
            classNames={{ base: "py-4", title: "text-base font-semibold" }}
          >
            Acme Co.
          </DropdownItem> */}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
