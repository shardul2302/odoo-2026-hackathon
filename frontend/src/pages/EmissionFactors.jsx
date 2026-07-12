import React, { useEffect, useState } from "react";
import { Plus, Flame, CheckCircle2, CircleOff, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { categoriesApi, emissionFactorsApi } from "@/lib/api";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function EmissionFactors() {
  const [factors, setFactors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", unit: "", factor: "", description: "", isActive: true });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [factorsRes, categoriesRes] = await Promise.all([
        emissionFactorsApi.getAll(),
        categoriesApi.getAll(),
      ]);
      const factorsList = Array.isArray(factorsRes?.data?.data) ? factorsRes.data.data : Array.isArray(factorsRes?.data?.data?.data) ? factorsRes.data.data.data : [];
      const categoriesList = Array.isArray(categoriesRes?.data?.data) ? categoriesRes.data.data : Array.isArray(categoriesRes?.data?.data?.data) ? categoriesRes.data.data.data : [];
      setFactors(factorsList);
      setCategories(categoriesList);
    } catch {
      toast.error("Failed to load ESG factors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", category: "", unit: "", factor: "", description: "", isActive: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        factor: Number(form.factor),
      };
      if (editingId) {
        await emissionFactorsApi.update(editingId, payload);
        toast.success("Emission factor updated");
      } else {
        await emissionFactorsApi.create(payload);
        toast.success("Emission factor created");
      }
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save emission factor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (factor) => {
    setEditingId(factor._id);
    setForm({
      name: factor.name || "",
      category: factor.category?._id || factor.category || "",
      unit: factor.unit || "",
      factor: factor.factor ?? "",
      description: factor.description || "",
      isActive: Boolean(factor.isActive),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this emission factor?")) return;
    try {
      await emissionFactorsApi.remove(id);
      toast.success("Emission factor deleted");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete emission factor");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-card shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="size-4 text-primary" /> Emission Factors
          </CardTitle>
          <CardDescription>Configure the carbon coefficients used for environmental calculations.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-end">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Electricity" required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input value={form.unit} onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))} placeholder="kWh" required />
            </div>
            <div className="space-y-2">
              <Label>Factor</Label>
              <Input type="number" step="0.01" value={form.factor} onChange={(e) => setForm((prev) => ({ ...prev, factor: e.target.value }))} placeholder="0.42" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Grid electricity emission factor" />
            </div>
            <div className="flex items-center gap-3 rounded-md border px-3 py-2">
              <Checkbox checked={form.isActive} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: Boolean(checked) }))} />
              <span className="text-sm">Active</span>
            </div>
            <div className="xl:col-span-4 flex items-center gap-2">
              <Button type="submit" disabled={submitting}>
                <Plus className="mr-2 size-4" /> {submitting ? "Saving..." : editingId ? "Update Factor" : "Add Factor"}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          : factors.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-amber-200 bg-amber-50/70 p-6 text-sm text-amber-700">
                No emission factors have been added yet. Create one to power your carbon calculations.
              </div>
            ) : (
              factors.map((factor) => (
                <Card key={factor._id} className="border-0 bg-card shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">{factor.name}</CardTitle>
                        <CardDescription>{factor.category?.name || "Unassigned"}</CardDescription>
                      </div>
                      <Badge className={factor.isActive ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}>
                        {factor.isActive ? <CheckCircle2 className="mr-1 size-3" /> : <CircleOff className="mr-1 size-3" />}
                        {factor.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">Unit: {factor.unit}</p>
                    <p className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Factor: {factor.factor}</p>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button type="button" variant="outline" size="icon" onClick={() => handleEdit(factor)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button type="button" variant="destructive" size="icon" onClick={() => handleDelete(factor._id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
      </div>
    </div>
  );
}
