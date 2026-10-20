import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { getTheme, applyTheme } from "../utils/theme";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(getTheme() === "dark");

  useEffect(() => {
    applyTheme(dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-white">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:pl-64">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          dark={dark}
          onToggleDark={() => setDark(!dark)}
        />
        <main className="p-4 md:p-6">
          <Outlet context={{ dark, setDark }} />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;