import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({ icon: Icon, label, value, accent, sub }) {
  return (
    <Card className="border-0 bg-white/80 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-slate-900/70">
      <CardContent className="px-5 py-4 flex items-center gap-4">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm",
            accent || "bg-secondary text-secondary-foreground"
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-foreground">
            {value}
          </p>
          {sub && <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
