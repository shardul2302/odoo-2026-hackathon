import React, { useEffect, useState } from "react";
import { Plus, Leaf, TrendingUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { carbonTransactionsApi, categoriesApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function CarbonTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ category: "", activity: "", quantity: "", unit: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        carbonTransactionsApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setTransactions(transactionsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch {
      toast.error("Failed to load carbon transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await carbonTransactionsApi.create({
        ...form,
        quantity: Number(form.quantity),
      });
      toast.success("Carbon transaction recorded");
      setForm({ category: "", activity: "", quantity: "", unit: "" });
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save transaction");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/80 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-slate-900/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="size-4 text-primary" /> Carbon Accounting
          </CardTitle>
          <CardDescription>Track operational emissions and derive sustainability metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-end">
            <div className="space-y-2">
              <Label>Activity</Label>
              <Input value={form.activity} onChange={(e) => setForm((prev) => ({ ...prev, activity: e.target.value }))} placeholder="Fleet usage" required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} required>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" step="0.01" value={form.quantity} onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))} placeholder="120" required />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input value={form.unit} onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))} placeholder="kWh" required />
            </div>
            <div className="xl:col-span-4">
              <Button type="submit" disabled={submitting}>
                <Plus className="mr-2 size-4" /> {submitting ? "Saving..." : "Record Transaction"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          : transactions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-6 text-sm text-emerald-700">
                No carbon transactions recorded yet. Add one above to start tracking impact.
              </div>
            ) : (
              transactions.map((transaction) => (
                <Card key={transaction._id} className="border-0 bg-white/80 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-slate-900/70">
                  <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">{transaction.activity}</p>
                      <p className="text-sm text-muted-foreground">{transaction.category?.name || "Unassigned"}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700"><TrendingUp className="size-4" /> {transaction.quantity} {transaction.unit}</span>
                      <span className="flex items-center gap-2 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700"><CheckCircle2 className="size-4" /> {transaction.carbonAmount?.toFixed(2)} kg CO₂e</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
      </div>
    </div>
  );
}
