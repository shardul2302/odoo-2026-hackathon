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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { dealsApi, contactsApi, companiesApi } from "@/lib/api";

const STAGES = ["New", "Qualified", "Proposition", "Won", "Lost"];

const EMPTY = {
  title: "",
  value: "",
  stage: "New",
  contact: "",
  company: "",
  expectedCloseDate: "",
  probability: "20",
  notes: "",
};

export default function DealFormDialog({ open, onOpenChange, deal, initialStage, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY, stage: initialStage || "New" });
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    contactsApi.getAll().then(({ data }) => setContacts(data.data || [])).catch(() => {});
    companiesApi.getAll().then(({ data }) => setCompanies(data.data || [])).catch(() => {});
  }, [open]);

  useEffect(() => {
    if (deal) {
      setForm({
        title: deal.title || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "New",
        contact: deal.contact?._id || deal.contact || "",
        company: deal.company?._id || deal.company || "",
        expectedCloseDate: deal.expectedCloseDate
          ? new Date(deal.expectedCloseDate).toISOString().split("T")[0]
          : "",
        probability: deal.probability?.toString() || "20",
        notes: deal.notes || "",
      });
    } else {
      setForm({ ...EMPTY, stage: initialStage || "New" });
    }
  }, [deal, open, initialStage]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        value: parseFloat(form.value) || 0,
        probability: parseInt(form.probability) || 20,
        contact: form.contact || null,
        company: form.company || null,
        expectedCloseDate: form.expectedCloseDate || undefined,
      };
      if (deal?._id) {
        await dealsApi.update(deal._id, payload);
        toast.success("Deal updated");
      } else {
        await dealsApi.create(payload);
        toast.success("Deal created");
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
          <DialogTitle>{deal ? "Edit Deal" : "New Deal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Deal Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Acme Corp – Enterprise Plan"
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label>Deal Value (₹)</Label>
              <Input
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => set("value", e.target.value)}
                placeholder="50000"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Probability (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={form.probability}
                onChange={(e) => set("probability", e.target.value)}
                placeholder="20"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Stage</Label>
              <Select value={form.stage} onValueChange={(v) => set("stage", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Expected Close</Label>
              <Input
                type="date"
                value={form.expectedCloseDate}
                onChange={(e) => set("expectedCloseDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Contact</Label>
              <Select value={form.contact} onValueChange={(v) => set("contact", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {contacts.map((c) => (
                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Select value={form.company} onValueChange={(v) => set("company", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Deal context, next steps…"
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
              {deal ? "Save changes" : "Create deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
