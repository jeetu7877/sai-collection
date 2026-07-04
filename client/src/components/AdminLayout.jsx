import { NavLink, Outlet } from "react-router-dom";
import {
  FiGrid, FiBox, FiShoppingCart, FiUsers, FiTag, FiTrendingUp, FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Overview", icon: FiGrid, end: true },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: FiUsers },
  { to: "/admin/coupons", label: "Coupons", icon: FiTag },
  { to: "/admin/analytics", label: "Analytics", icon: FiTrendingUp },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-base-950">
      <aside className="hidden md:flex md:w-64 shrink-0 flex-col border-r border-white/10 bg-base-900/60 p-5">
        <div className="mb-8">
          <span className="font-display text-2xl text-white">
            MenStyle<span className="text-accent">Pro</span>
          </span>
          <p className="text-xs text-gray-500 mt-1">Admin Console</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-accent/15 text-accent" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4">
          <p className="text-sm text-white">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          <button onClick={logout} className="mt-3 flex items-center gap-2 text-sm text-gray-500 hover:text-accent">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
