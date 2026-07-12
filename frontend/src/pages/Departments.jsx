import React, { useEffect, useState } from "react";
import { Plus, Building2, CheckCircle2, CircleOff } from "lucide-react";
import { toast } from "sonner";
import { departmentsApi } from "@/lib/api";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", isActive: true });

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const { data } = await departmentsApi.getAll();
      setDepartments(data.data || []);
    } catch {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await departmentsApi.create(form);
      toast.success("Department created");
      setForm({ name: "", description: "", isActive: true });
      fetchDepartments();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to create department");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/80 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-slate-900/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-4 text-primary" /> Departments
          </CardTitle>
          <CardDescription>Assign ownership for ESG initiatives across the organization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1.1fr_0.9fr_auto] items-end">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Operations"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Responsible for field operations"
              />
            </div>
            <div className="flex items-center gap-3 rounded-md border px-3 py-2">
              <Checkbox
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: Boolean(checked) }))}
              />
              <span className="text-sm">Active</span>
            </div>
            <div className="md:col-span-3">
              <Button type="submit" disabled={submitting}>
                <Plus className="mr-2 size-4" /> {submitting ? "Saving..." : "Add Department"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          : departments.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 p-6 text-sm text-emerald-700">
                No departments have been created yet. Add one above to start organizing your ESG teams.
              </div>
            ) : (
              departments.map((department) => (
                <Card key={department._id} className="border-0 bg-white/80 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-slate-900/70">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">{department.name}</CardTitle>
                        <CardDescription>{department.description || "No description yet"}</CardDescription>
                      </div>
                      <Badge className={department.isActive ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}>
                        {department.isActive ? <CheckCircle2 className="mr-1 size-3" /> : <CircleOff className="mr-1 size-3" />}
                        {department.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
      </div>
    </div>
  );
}
