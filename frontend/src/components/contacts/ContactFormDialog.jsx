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
import { contactsApi, companiesApi } from "@/lib/api";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  company: "",
  jobTitle: "",
  status: "New",
  source: "Website",
  notes: "",
};

const STATUSES = ["New", "Contacted", "Qualified", "Lost", "Won"];
const SOURCES = ["Website", "Referral", "Cold Call", "Email", "LinkedIn", "Event", "Other"];

export default function ContactFormDialog({ open, onOpenChange, contact, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [companies, setCompanies] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    companiesApi.getAll().then(({ data }) => setCompanies(data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (contact) {
      setForm({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company?._id || contact.company || "",
        jobTitle: contact.jobTitle || "",
        status: contact.status || "New",
        source: contact.source || "Website",
        notes: contact.notes || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [contact, open]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (contact?._id) {
        await contactsApi.update(contact._id, form);
        toast.success("Contact updated");
      } else {
        await contactsApi.create(form);
        toast.success("Contact created");
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
          <DialogTitle>{contact ? "Edit Contact" : "New Contact"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Full Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Jane Cooper"
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="jane@acme.com"
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
            <div className="space-y-1.5">
              <Label>Job Title</Label>
              <Input
                value={form.jobTitle}
                onChange={(e) => set("jobTitle", e.target.value)}
                placeholder="Marketing Manager"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Source</Label>
              <Select value={form.source} onValueChange={(v) => set("source", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {contact ? "Save changes" : "Create contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
