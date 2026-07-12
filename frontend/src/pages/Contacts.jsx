import React, { useEffect, useState, useCallback } from "react";
import { Plus, Search, RefreshCw, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { contactsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LeadStatusBadge } from "@/components/StatusBadges";
import ContactFormDialog from "@/components/contacts/ContactFormDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import EmptyState from "@/components/EmptyState";
import { formatDate } from "@/lib/format";

const STATUSES = ["All", "New", "Contacted", "Qualified", "Lost", "Won"];

function initials(name = "") {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (status !== "All") params.status = status;
      const { data } = await contactsApi.getAll(params);
      setContacts(data.data || []);
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(fetchContacts, 300);
    return () => clearTimeout(t);
  }, [fetchContacts]);

  const handleEdit = (contact) => {
    setEditTarget(contact);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await contactsApi.remove(deleteTarget._id);
      toast.success("Contact deleted");
      setDeleteTarget(null);
      fetchContacts();
    } catch {
      toast.error("Failed to delete contact");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchContacts}
          className="shrink-0"
        >
          <RefreshCw className="size-4" />
        </Button>
        <Button
          className="shrink-0"
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
        >
          <Plus className="size-4" /> New Contact
        </Button>
      </div>

      {/* table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Users}
              title="No contacts found"
              description={search || status !== "All" ? "Try adjusting your filters." : "Add your first contact to get started."}
              actionLabel="New Contact"
              onAction={() => { setEditTarget(null); setFormOpen(true); }}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">
                          {initials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.email || "—"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {contact.company?.name || "—"}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {contact.phone || "—"}
                  </TableCell>
                  <TableCell>
                    <LeadStatusBadge status={contact.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {contact.source || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(contact.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(contact)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(contact)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <ContactFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        contact={editTarget}
        onSaved={fetchContacts}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This will permanently remove the contact and all linked records."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
