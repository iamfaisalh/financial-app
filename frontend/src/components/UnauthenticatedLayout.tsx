import { Outlet } from "react-router-dom";
import {
  Navbar,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from "./Navbar";
import Brand from "./Brand";
import ThemeToggle from "./ThemeToggle";
import Content from "./Content";

const navItems = [
  { label: "Login", url: "/login" },
  { label: "Sign Up", url: "/signup" },
];

export default function UnauthenticatedLayout() {
  return (
    <div className="relative isolate flex min-h-svh w-full flex-col bg-zinc-100 dark:bg-zinc-950">
      {/* Navbar */}
      <header className="flex items-center px-4">
        <div className="min-w-0 flex-1">
          <Navbar className="mx-auto max-w-7xl">
            <NavbarLabel className="flex items-center">
              <Brand />
            </NavbarLabel>
            <NavbarSpacer />
            <NavbarSection>
              {navItems.map(({ label, url }) => (
                <NavbarItem key={label} to={url}>
                  {label}
                </NavbarItem>
              ))}
            </NavbarSection>
            <NavbarSection>
              <ThemeToggle />
            </NavbarSection>
          </Navbar>
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col">
        <Content className="grow p-6 lg:p-10 shadow-sm ring-1 ring-zinc-950/5 dark:ring-white/10">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </Content>
      </main>
    </div>
  );
}
