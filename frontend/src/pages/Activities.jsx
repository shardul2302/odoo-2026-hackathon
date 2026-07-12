import React, { useEffect, useState, useCallback } from "react";
import {
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  ListChecks,
  Phone,
  Video,
  Mail,
  CheckSquare,
} from "lucide-react";
import { toast } from "sonner";
import { activitiesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { ActivityStatusBadge } from "@/components/StatusBadges";
import ActivityFormDialog from "@/components/activities/ActivityFormDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import EmptyState from "@/components/EmptyState";
import { formatDate } from "@/lib/format";

const TYPE_ICONS = {
  Call: Phone,
  Meeting: Video,
  Email: Mail,
  Task: CheckSquare,
};

const TYPE_COLORS = {
  Call: "bg-chart-1/15 text-chart-1",
  Meeting: "bg-chart-3/15 text-chart-3",
  Email: "bg-chart-2/15 text-chart-2",
  Task: "bg-chart-5/15 text-chart-5",
};

const STATUS_OPTS = ["All", "Pending", "Completed", "Cancelled"];
const TYPE_OPTS = ["All", "Call", "Meeting", "Email", "Task"];

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (status !== "All") params.status = status;
      if (type !== "All") params.type = type;
      const { data } = await activitiesApi.getAll(params);
      setActivities(data.data || []);
    } catch {
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  }, [status, type]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleEdit = (activity) => {
    setEditTarget(activity);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await activitiesApi.remove(deleteTarget._id);
      toast.success("Activity deleted");
      setDeleteTarget(null);
      fetchActivities();
    } catch {
      toast.error("Failed to delete activity");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTS.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchActivities}
          className="shrink-0"
        >
          <RefreshCw className="size-4" />
        </Button>
        <Button
          className="ml-auto shrink-0"
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
        >
          <Plus className="size-4" /> Log Activity
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={ListChecks}
              title="No activities found"
              description="Log calls, meetings, or tasks to track your follow-ups."
              actionLabel="Log Activity"
              onAction={() => { setEditTarget(null); setFormOpen(true); }}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Linked To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => {
                const Icon = TYPE_ICONS[activity.type] || CheckSquare;
                const colorClass = TYPE_COLORS[activity.type] || "bg-muted text-muted-foreground";
                const isLate =
                  activity.dueDate &&
                  new Date(activity.dueDate) < new Date() &&
                  activity.status === "Pending";

                return (
                  <TableRow key={activity._id}>
                    <TableCell>
                      <p className="font-medium text-sm">{activity.title}</p>
                      {activity.notes && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {activity.notes}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                        <Icon className="size-3" />
                        {activity.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ActivityStatusBadge status={activity.status} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {activity.contact?.name ? (
                        <span className="text-foreground">{activity.contact.name}</span>
                      ) : activity.deal?.title ? (
                        <span className="text-muted-foreground">{activity.deal.title}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-mono ${isLate ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                        {isLate ? "⚠ " : ""}{formatDate(activity.dueDate)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(activity)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(activity)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <ActivityFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        activity={editTarget}
        onSaved={fetchActivities}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This will permanently remove the activity."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
