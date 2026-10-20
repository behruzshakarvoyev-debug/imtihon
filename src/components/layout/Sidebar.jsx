import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Layers, Wallet, CalendarCheck, Settings } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Bosh panel", icon: LayoutDashboard, end: true },
  { to: "/dashboard/students", label: "Talabalar", icon: Users },
  { to: "/dashboard/groups", label: "Guruhlar", icon: Layers },
  { to: "/dashboard/payments", label: "To'lovlar", icon: Wallet },
  { to: "/dashboard/attendance", label: "Davomat", icon: CalendarCheck },
  { to: "/dashboard/settings", label: "Sozlamalar", icon: Settings },
];

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-white transition-transform dark:bg-gray-900 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 text-xl font-bold text-blue-600">EduPanel</div>

        <nav className="flex flex-col gap-1 px-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;