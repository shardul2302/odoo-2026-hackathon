import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const pageTitles = {
  "/": "Dashboard",
  "/departments": "Departments",
  "/categories": "Categories",
  "/emission-factors": "Emission Factors",
  "/carbon-transactions": "Carbon Transactions",
};

export default function AppLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "EcoSphere";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(240,253,244,0.96))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(135deg,_rgba(3,11,8,0.98),_rgba(5,20,13,0.98))]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-4 px-3 py-3 md:px-5 lg:px-6">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar title={title} />
          <main className="mt-4 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}