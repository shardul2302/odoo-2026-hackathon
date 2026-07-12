import React from "react";
import { NavLink } from "react-router-dom";
import {
  Search,
  Sun,
  Moon,
  LogOut,
  Menu,
  LayoutDashboard,
  Building2,
  Layers3,
  Flame,
  Leaf,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/categories", label: "Categories", icon: Layers3 },
  { to: "/emission-factors", label: "Emission Factors", icon: Flame },
  { to: "/carbon-transactions", label: "Carbon Transactions", icon: Leaf },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="mb-4 flex h-16 shrink-0 items-center gap-3 rounded-[24px] border border-emerald-200/70 bg-white/80 px-4 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur md:px-6 dark:border-emerald-900/70 dark:bg-slate-900/70">
      {/* mobile nav trigger */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-sidebar text-sidebar-foreground border-sidebar-border p-0 w-64">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle className="flex items-center gap-2 text-sidebar-foreground">
              <div className="flex size-7 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              EcoSphere
            </SheetTitle>
          </SheetHeader>
          <nav className="px-3 py-4 space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60"
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        <h1 className="font-display text-base font-semibold text-foreground md:text-lg">
          {title}
        </h1>
      </div>

      <div className="relative hidden sm:block w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Search departments, categories…" className="pl-8 rounded-full border-emerald-200/70 bg-emerald-50/70 dark:bg-slate-800/70" />
      </div>

      <Button variant="ghost" size="icon" onClick={toggleTheme}>
        {theme === "dark" ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full outline-none ring-2 ring-transparent transition hover:ring-emerald-200">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {getInitials(user?.fullName)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium text-foreground">
              {user?.fullName}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={logout}>
            <LogOut className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
