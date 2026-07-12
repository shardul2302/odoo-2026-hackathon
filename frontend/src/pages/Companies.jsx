import React, { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Building2,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { companiesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import CompanyFormDialog from "@/components/companies/CompanyFormDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import EmptyState from "@/components/EmptyState";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

function initials(name = "") {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      const { data } = await companiesApi.getAll(params);
      setCompanies(data.data || []);
    } catch {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchCompanies, 300);
    return () => clearTimeout(t);
  }, [fetchCompanies]);

  const handleEdit = (company) => {
    setEditTarget(company);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await companiesApi.remove(deleteTarget._id);
      toast.success("Company deleted");
      setDeleteTarget(null);
      fetchCompanies();
    } catch {
      toast.error("Failed to delete company");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchCompanies}
          className="shrink-0"
        >
          <RefreshCw className="size-4" />
        </Button>
        <Button
          className="shrink-0"
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
        >
          <Plus className="size-4" /> New Company
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Building2}
              title="No companies found"
              description={search ? "Try a different search." : "Add your first company to get started."}
              actionLabel="New Company"
              onAction={() => { setEditTarget(null); setFormOpen(true); }}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {initials(company.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {company.industry ? (
                      <Badge variant="secondary" className="font-normal">
                        {company.industry}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {company.email || "—"}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {company.phone || "—"}
                  </TableCell>
                  <TableCell>
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary text-sm hover:underline"
                      >
                        <Globe className="size-3" />
                        {company.website.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(company.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(company)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(company)}
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

      <CompanyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        company={editTarget}
        onSaved={fetchCompanies}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This will permanently remove the company."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
