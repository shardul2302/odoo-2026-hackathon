import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { companiesApi } from "@/lib/api";

const EMPTY = {
  name: "",
  industry: "",
  website: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
};

export default function CompanyFormDialog({ open, onOpenChange, company, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name || "",
        industry: company.industry || "",
        website: company.website || "",
        phone: company.phone || "",
        email: company.email || "",
        address: company.address || "",
        notes: company.notes || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [company, open]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (company?._id) {
        await companiesApi.update(company._id, form);
        toast.success("Company updated");
      } else {
        await companiesApi.create(form);
        toast.success("Company created");
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{company ? "Edit Company" : "New Company"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Company Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Acme Corp"
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label>Industry</Label>
              <Input
                value={form.industry}
                onChange={(e) => set("industry", e.target.value)}
                placeholder="SaaS, Manufacturing…"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Website</Label>
              <Input
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://acme.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="info@acme.com"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="123 Main St, Mumbai"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Any additional notes…"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {company ? "Save changes" : "Create company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
