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
import { activitiesApi, contactsApi, dealsApi } from "@/lib/api";

const TYPES = ["Call", "Meeting", "Email", "Task"];
const STATUSES = ["Pending", "Completed", "Cancelled"];

const EMPTY = {
  title: "",
  type: "Task",
  status: "Pending",
  dueDate: "",
  contact: "",
  deal: "",
  notes: "",
};

export default function ActivityFormDialog({ open, onOpenChange, activity, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    contactsApi.getAll().then(({ data }) => setContacts(data.data || [])).catch(() => {});
    dealsApi.getAll().then(({ data }) => setDeals(data.data || [])).catch(() => {});
  }, [open]);

  useEffect(() => {
    if (activity) {
      setForm({
        title: activity.title || "",
        type: activity.type || "Task",
        status: activity.status || "Pending",
        dueDate: activity.dueDate
          ? new Date(activity.dueDate).toISOString().split("T")[0]
          : "",
        contact: activity.contact?._id || activity.contact || "",
        deal: activity.deal?._id || activity.deal || "",
        notes: activity.notes || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [activity, open]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        contact: form.contact || null,
        deal: form.deal || null,
        dueDate: form.dueDate || undefined,
      };
      if (activity?._id) {
        await activitiesApi.update(activity._id, payload);
        toast.success("Activity updated");
      } else {
        await activitiesApi.create(payload);
        toast.success("Activity created");
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
          <DialogTitle>{activity ? "Edit Activity" : "Log Activity"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Follow-up call with Acme Corp"
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label>Due Date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Linked Contact</Label>
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
            <div className="col-span-2 space-y-1.5">
              <Label>Linked Deal</Label>
              <Select value={form.deal} onValueChange={(v) => set("deal", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select deal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {deals.map((d) => (
                    <SelectItem key={d._id} value={d._id}>{d.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Meeting agenda, call summary…"
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
              {activity ? "Save changes" : "Log activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
