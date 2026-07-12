import React, { useEffect, useState } from "react";
import { Plus, Layers3, CheckCircle2, CircleOff, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { categoriesApi } from "@/lib/api";
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

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", isActive: true });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await categoriesApi.getAll();
      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data?.data?.data) ? data.data.data : [];
      setCategories(items);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", description: "", isActive: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await categoriesApi.update(editingId, form);
        toast.success("Category updated");
      } else {
        await categoriesApi.create(form);
        toast.success("Category created");
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setForm({
      name: category.name || "",
      description: category.description || "",
      isActive: Boolean(category.isActive),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await categoriesApi.remove(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/80 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-slate-900/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers3 className="size-4 text-primary" /> Categories
          </CardTitle>
          <CardDescription>Group ESG initiatives such as energy, travel, waste, and community programs.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1.1fr_0.9fr_auto] items-end">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Energy"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Operational energy consumption"
              />
            </div>
            <div className="flex items-center gap-3 rounded-md border px-3 py-2">
              <Checkbox
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: Boolean(checked) }))}
              />
              <span className="text-sm">Active</span>
            </div>
            <div className="md:col-span-3 flex items-center gap-2">
              <Button type="submit" disabled={submitting}>
                <Plus className="mr-2 size-4" /> {submitting ? "Saving..." : editingId ? "Update Category" : "Add Category"}
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
          : categories.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-6 text-sm text-emerald-700">
                No categories have been created yet. Add one to group your sustainability activities.
              </div>
            ) : (
              categories.map((category) => (
                <Card key={category._id} className="border-0 bg-white/80 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-slate-900/70">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription>{category.description || "No description yet"}</CardDescription>
                      </div>
                      <Badge className={category.isActive ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}>
                        {category.isActive ? <CheckCircle2 className="mr-1 size-3" /> : <CircleOff className="mr-1 size-3" />}
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-end gap-2">
                    <Button type="button" variant="outline" size="icon" onClick={() => handleEdit(category)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button type="button" variant="destructive" size="icon" onClick={() => handleDelete(category._id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
      </div>
    </div>
  );
}
