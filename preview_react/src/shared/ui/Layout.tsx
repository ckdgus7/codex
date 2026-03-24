import { type ReactNode } from "react";
import { Outlet } from "react-router";

interface LayoutProps {
  children: ReactNode;
  activeGnb?: string;
  activeLnb?: string;
}

export function Layout() {
  return (
    <div className="flex h-screen w-full font-sans">
      <main className="relative flex-1 overflow-auto bg-[#f5f5f5]">
        <Outlet />
      </main>
    </div>
  );
}
