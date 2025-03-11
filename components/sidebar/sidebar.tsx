import React from "react";
import { Sidebar } from "./sidebar.styles";
//import { Avatar, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
//import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { QrcodeIcon } from "../icons/sidebar/qr-code";
//import { DevIcon } from "../icons/sidebar/dev-icon";
//import { ViewIcon } from "../icons/sidebar/view-icon";
//import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
//import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
//import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { usePathname } from "next/navigation";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { ExportIcon } from "../icons/accounts/export-icon";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  fetch("https://api.wave.com/v1", {
    method: "GET",
    headers: {
      Authorization:
        "Bearer wave_ci_prod_AmGvx1kFkrzRkryC1dnBSgrslJneLfwXt_pNcqWZLsWV5AY7HwGgfyuv5-lIIk7DD7L4B-xxC285IExwhVSV2MstZitIZYPFyg",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Erreur :", error));

  return (
    <aside className="h-screen z-[20] sticky top-0 ">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full overflow-y-auto">
          <div className={Sidebar.Body()}>
            {/* Components/Home/Content folder  */}
            <SidebarItem
              title="Acceuil"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Main Menu">
              {/* Components/Account folder */}
              <SidebarItem
                isActive={pathname === "/accounts"}
                title="Master et pdv"
                icon={<AccountsIcon />}
                href="/accounts"
              />
              {/* Components/Payments folder */}
              <SidebarItem
                isActive={pathname === "/payments"}
                href="/payments"
                title="Transactions"
                icon={<PaymentsIcon />}
              />
              {/*
               <CollapseItems
                icon={<BalanceIcon />}
                items={["Wave", "Orange", "Moov", "Mtn"]}
                title="Soldes"
              /> */}
              {/*    <SidebarItem
                isActive={pathname === "/customers"}
                title="Customers"
                icon={<CustomersIcon />}
              /> */}
              {/* Components/Organisation folder */}
              <SidebarItem
                isActive={pathname === "/organisation"}
                title="Compte business"
                href="/organisation"
                icon={<ProductsIcon />}
              />
              <SidebarItem
                isActive={pathname === "/commercials"}
                title="Compte particulier"
                href="/commercials"
                icon={<ReportsIcon />}
              />
              <SidebarItem
                isActive={pathname === "/supply"}
                title="Approvisionnements"
                href="/supply"
                icon={<ViewIcon />}
              />
              <SidebarItem
                isActive={pathname === "/qr"}
                title="Qr code"
                href="/qr"
                icon={<QrcodeIcon />}
              />
              <SidebarItem
                isActive={pathname === "/stats"}
                title="Statistics"
                href="/stats"
                icon={<ExportIcon />}
              />
              <SidebarItem
                isActive={pathname === "/virement"}
                title="Ordre de virement"
                href="/virement"
                icon={<BalanceIcon />}
              />
            </SidebarMenu>
            {/*
  
            <SidebarMenu title="General">
              <SidebarItem
                isActive={pathname === "/developers"}
                title="Developers"
                icon={<DevIcon />}
              />
              <SidebarItem
                isActive={pathname === "/view"}
                title="View Test Data"
                icon={<ViewIcon />}
              />
              <SidebarItem
                isActive={pathname === "/settings"}
                title="Settings"
                icon={<SettingsIcon />}
              />
            </SidebarMenu>

            <SidebarMenu title="Updates">
              <SidebarItem
                isActive={pathname === "/changelog"}
                title="Changelog"
                icon={<ChangeLogIcon />}
              />
            </SidebarMenu> */}
          </div>
          {/*
           <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div> */}
        </div>
      </div>
    </aside>
  );
};
