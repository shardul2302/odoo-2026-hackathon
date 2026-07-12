import React, { useEffect, useState, useCallback } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { dealsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import KanbanColumn from "@/components/deals/KanbanColumn";
import DealFormDialog from "@/components/deals/DealFormDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { formatCurrency } from "@/lib/format";

const STAGES = ["New", "Qualified", "Proposition", "Won", "Lost"];

function groupByStage(deals) {
  const groups = {};
  STAGES.forEach((s) => (groups[s] = []));
  deals.forEach((d) => {
    if (groups[d.stage]) groups[d.stage].push(d);
  });
  return groups;
}

export default function Pipeline() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [initialStage, setInitialStage] = useState("New");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await dealsApi.getAll();
      setDeals(data.data || []);
    } catch {
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStage = destination.droppableId;

    // optimistic update
    setDeals((prev) =>
      prev.map((d) => (d._id === draggableId ? { ...d, stage: newStage } : d))
    );

    try {
      await dealsApi.updateStage(draggableId, newStage);
      toast.success(`Moved to ${newStage}`);
    } catch {
      toast.error("Failed to update stage — reverting");
      fetchDeals(); // revert
    }
  };

  const handleAddInStage = (stage) => {
    setEditTarget(null);
    setInitialStage(stage);
    setFormOpen(true);
  };

  const handleEdit = (deal) => {
    setEditTarget(deal);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await dealsApi.remove(deleteTarget._id);
      toast.success("Deal deleted");
      setDeleteTarget(null);
      fetchDeals();
    } catch {
      toast.error("Failed to delete deal");
    } finally {
      setDeleting(false);
    }
  };

  const grouped = groupByStage(deals);
  const pipelineTotal = deals
    .filter((d) => !["Won", "Lost"].includes(d.stage))
    .reduce((s, d) => s + (d.value || 0), 0);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            Open pipeline:{" "}
            <span className="font-mono font-semibold text-foreground">
              {formatCurrency(pipelineTotal)}
            </span>
            {" · "}
            <span className="font-mono">{deals.filter(d => !["Won","Lost"].includes(d.stage)).length}</span> active deals
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchDeals}>
          <RefreshCw className="size-4" />
        </Button>
        <Button onClick={() => { setEditTarget(null); setInitialStage("New"); setFormOpen(true); }}>
          <Plus className="size-4" /> New Deal
        </Button>
      </div>

      {/* Kanban board */}
      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((s) => (
            <div key={s} className="min-w-[260px] space-y-3">
              <Skeleton className="h-8 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4 flex-1">
            {STAGES.map((stage) => (
              <KanbanColumn
                key={stage}
                stage={stage}
                deals={grouped[stage] || []}
                onAdd={handleAddInStage}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      <DealFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        deal={editTarget}
        initialStage={initialStage}
        onSaved={fetchDeals}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This will permanently remove the deal."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
