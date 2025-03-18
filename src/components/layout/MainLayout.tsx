
import React from "react";
import { MainNavBar } from "./MainNavBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNavBar />
      <main className="flex-1 pt-2 pb-16">
        {children}
      </main>
    </div>
  );
};
