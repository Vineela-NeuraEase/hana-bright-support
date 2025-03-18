
import { Outlet } from "react-router-dom";
import { MainNavBar } from "./MainNavBar";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
