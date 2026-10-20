import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "../common/ConfirmDialog";
import { getStoredAdmin, clearAdmin } from "../../api/auth";

const titles = {
  "/dashboard": "Bosh panel",
  "/dashboard/students": "Talabalar",
  "/dashboard/groups": "Guruhlar",
  "/dashboard/payments": "To'lovlar",
  "/dashboard/attendance": "Davomat",
  "/dashboard/settings": "Sozlamalar",
};

function Topbar({ onMenuClick, dark, onToggleDark }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const admin = getStoredAdmin();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const title =
    titles[pathname] ||
    (pathname.startsWith("/dashboard/students/") ? "Talaba profili" : "") ||
    (pathname.startsWith("/dashboard/groups/") ? "Guruh sahifasi" : "");

  function logout() {
    clearAdmin();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-3 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="font-semibold">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleDark}>
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <img src={admin?.avatar} alt={admin?.fullName} className="h-8 w-8 rounded-full" />
        <span className="hidden text-sm sm:inline">{admin?.fullName}</span>

        <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
          <LogOut className="mr-1 h-4 w-4" />
          Chiqish
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Tizimdan chiqasizmi?"
        description="Qayta kirish uchun login va parol kerak bo'ladi."
        onConfirm={logout}
        onCancel={() => setConfirmOpen(false)}
      />
    </header>
  );
}

export default Topbar;