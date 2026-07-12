import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Layers3,
  Flame,
  Leaf,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/categories", label: "Categories", icon: Layers3 },
  { to: "/emission-factors", label: "Emission Factors", icon: Flame },
  { to: "/carbon-transactions", label: "Carbon Transactions", icon: Leaf },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-72 shrink-0 flex-col rounded-[28px] border border-emerald-200/70 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 p-3 text-sidebar-foreground shadow-[0_25px_60px_-25px_rgba(4,120,87,0.65)] dark:border-emerald-900/70">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-100">
          <Sparkles className="size-4" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-display font-bold text-sm tracking-tight text-white">
            Eco<span className="text-emerald-300">Sphere</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.24em] text-emerald-100/70">
            ESG Workspace
          </span>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-emerald-400/20 text-white shadow-inner"
                  : "text-emerald-50/80 hover:bg-white/10 hover:text-white"
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-1 pb-1 pt-4">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-xs text-emerald-50/85 backdrop-blur">
          <p className="mb-1 font-semibold text-white">EcoSphere ESG Platform</p>
          <p>Track environmental impact, governance actions, and sustainability performance.</p>
        </div>
      </div>
    </aside>
  );
}
