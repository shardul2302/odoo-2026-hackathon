import React, { useEffect, useState } from "react";
import {
  Users,
  Building2,
  Wallet,
  Trophy,
  ListChecks,
  TrendingUp,
  Sparkles,
  Leaf,
  Flame,
  Layers3,
  CircleCheckBig,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { dashboardApi } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const CHART_COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await dashboardApi.getStats();
        setStats(data.data);
      } catch (error) {
        toast.error("Couldn't load dashboard stats");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  const monthlyTrend = (stats?.monthlyTrend || []).map((item) => ({
    month: item.month,
    value: item.value,
  }));

  const sustainabilityBreakdown = (stats?.sustainabilityBreakdown || []).map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-500 p-6 text-white shadow-[0_25px_60px_-25px_rgba(5,150,105,0.7)] dark:border-emerald-900/70">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur">
              <Sparkles className="size-4" /> EcoSphere Control Center
            </div>
            <h2 className="text-2xl font-semibold">Track sustainability performance at a glance.</h2>
            <p className="mt-2 max-w-2xl text-sm text-emerald-50/90">
              Review departments, emission factors, carbon activities, and ESG progress from one polished workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur">
            <div className="flex items-center gap-2 font-medium">
              <Leaf className="size-4" /> Live ESG monitoring
            </div>
            <p className="mt-1 text-emerald-50/80">Carbon impact and operations aligned</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Wallet}
          label="Total Carbon Impact"
          value={`${stats?.totalCarbon ?? 0} kg`}
          accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          sub="Tracked emissions"
        />
        <StatCard
          icon={Flame}
          label="Active Emission Factors"
          value={stats?.factors ?? 0}
          accent="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
          sub="Configured coefficients"
        />
        <StatCard
          icon={Users}
          label="Active Users"
          value={stats?.users ?? 0}
          accent="bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
          sub="Across departments"
        />
        <StatCard
          icon={Building2}
          label="Active Departments"
          value={stats?.departments ?? 0}
          accent="bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
          sub="Operational coverage"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-0 bg-white/80 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-600" /> Quarterly Emission Trend
            </CardTitle>
            <CardDescription>Monthly carbon tracking movement for the current reporting cycle</CardDescription>
          </CardHeader>
          <CardContent className="h-72 pb-4">
            {monthlyTrend.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 text-sm text-emerald-700">
                No trend data yet. Seeded analytics will appear here automatically.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers3 className="size-4 text-emerald-600" /> Impact Breakdown
            </CardTitle>
            <CardDescription>Current distribution across ESG categories</CardDescription>
          </CardHeader>
          <CardContent className="h-72 pb-4">
            {sustainabilityBreakdown.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 text-sm text-emerald-700">
                Category insights will appear here once data is available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sustainabilityBreakdown} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3}>
                    {sustainabilityBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={28} wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="border-0 bg-white/80 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="size-4 text-emerald-600" /> Latest Sustainability Actions
            </CardTitle>
            <CardDescription>Recent operational and environmental updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            {(stats?.recentTransactions || []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-700">
                No recent actions yet. Transactions will appear here once they are recorded.
              </div>
            ) : (
              stats.recentTransactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{transaction.activity}</p>
                    <p className="text-xs text-muted-foreground">{transaction.category?.name || "Unassigned category"}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-emerald-700 shadow-sm">
                    <CircleCheckBig className="size-3.5" /> {transaction.carbonAmount?.toFixed(1) || 0} kg
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="size-4 text-emerald-600" /> AI Insights
            </CardTitle>
            <CardDescription>Actionable recommendations from your ESG data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            {(stats?.insights || []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-700">
                Insights will be generated as your sustainability data grows.
              </div>
            ) : (
              stats.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-3 text-sm text-foreground">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <span>{insight}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
