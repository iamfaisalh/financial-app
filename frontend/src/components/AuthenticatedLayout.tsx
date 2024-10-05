import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "./Dropdown";
import { Navbar, NavbarItem, NavbarLabel, NavbarSection } from "./Navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "./Sidebar";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { logout } from "../redux/reducers/user";
import StockSearch from "./StockSearch";
import Brand from "./Brand";
import ThemeToggle from "./ThemeToggle";
import api from "../api";
import { useEffect } from "react";
import { initializeStocksThunk } from "../redux/reducers/stocks";

import * as Headless from "@headlessui/react";
import React, { useState } from "react";
import Content from "./Content";

function OpenMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  );
}

function CloseMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function MobileSidebar({
  open,
  close,
  children,
}: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  return (
    <Headless.Dialog open={open} onClose={close} className="lg:hidden">
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <Headless.DialogPanel
        transition
        className="fixed inset-y-0 w-full max-w-80 p-2 transition duration-300 ease-in-out data-[closed]:-translate-x-full"
      >
        <div className="flex h-full flex-col rounded-lg bg-white shadow-sm ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
          <div className="-mb-3 px-4 pt-3">
            <Headless.CloseButton as={NavbarItem} aria-label="Close navigation">
              <CloseMenuIcon />
            </Headless.CloseButton>
          </div>
          {children}
        </div>
      </Headless.DialogPanel>
    </Headless.Dialog>
  );
}

const navItems = [
  // { label: "Dashboard", url: "/dashboard" },
  { label: "Portfolio", url: "/portfolio" },
  // { label: "Settings", url: "/settings" },
];

export default function AuthenticatedLayout() {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.data);
  const stocks = useAppSelector((state) => state.stocks);
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}` : "";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!stocks.didLoad) {
      dispatch(initializeStocksThunk());
    }
  }, [stocks.didLoad, dispatch]);

  return (
    <div className="relative isolate flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Sidebar on mobile */}
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        <Sidebar>
          <SidebarHeader>
            <SidebarLabel className="flex items-center">
              <Brand />
            </SidebarLabel>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, url }) => (
                <SidebarItem
                  key={label}
                  to={url}
                  current={location.pathname === url}
                >
                  {label}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      </MobileSidebar>

      {/* Navbar */}
      <header className="flex items-center px-4">
        <div className="py-2.5 lg:hidden">
          <NavbarItem
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
          >
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">
          <Navbar className="mx-auto max-w-7xl">
            <NavbarLabel className="flex items-center max-lg:hidden">
              <Brand />
            </NavbarLabel>
            <NavbarSection className="relative flex-1 mx-auto max-lg:ml-2">
              <StockSearch />
            </NavbarSection>
            <NavbarSection className="max-lg:hidden">
              {navItems.map(({ label, url }) => (
                <NavbarItem
                  key={label}
                  to={url}
                  current={location.pathname === url}
                >
                  {label}
                </NavbarItem>
              ))}
            </NavbarSection>
            <NavbarSection>
              <ThemeToggle />
              <Dropdown>
                <DropdownButton as={NavbarItem}>
                  <Avatar initials={initials} square />
                </DropdownButton>
                <DropdownMenu className="min-w-64" anchor="bottom end">
                  <DropdownHeader>
                    <div className="pr-6">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Signed in as {user?.first_name} {user?.last_name}
                      </div>
                      <div className="text-sm/7 font-semibold text-zinc-800 dark:text-white">
                        {user?.email}
                      </div>
                    </div>
                  </DropdownHeader>
                  <DropdownDivider />
                  <DropdownItem onClick={handleLogout}>
                    <ArrowRightStartOnRectangleIcon />
                    <DropdownLabel>Sign out</DropdownLabel>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarSection>
          </Navbar>
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col pb-2 lg:px-2">
        <Content className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </Content>
      </main>
    </div>
  );
}
