import React, { useEffect } from "react";
import NavbarOwner from "../../components/owner/NavbarOwner";
import Sidebar from "../../components/owner/Sidebar";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { isOwner, navigate, authLoading } = useAppContext();

  useEffect(() => {
    // Wait until auth is loaded
    if (!authLoading && !isOwner) {
      navigate("/");
    }
  }, [isOwner, authLoading, navigate]);

  // Prevent flicker / wrong UI render
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarOwner />

      <div className="flex flex-1">
        <Sidebar />

        {/* Prevent layout overflow */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
