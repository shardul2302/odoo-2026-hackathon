import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DealCard from "./DealCard";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";

const STAGE_STYLES = {
  New: "border-t-[3px] border-t-chart-3",
  Qualified: "border-t-[3px] border-t-chart-2",
  Proposition: "border-t-[3px] border-t-chart-5",
  Won: "border-t-[3px] border-t-chart-1",
  Lost: "border-t-[3px] border-t-chart-4",
};

export default function KanbanColumn({ stage, deals, onAdd, onEdit, onDelete }) {
  const total = deals.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className={cn("flex flex-col rounded-xl bg-muted/40 min-w-[260px] max-w-[280px] w-full overflow-hidden", STAGE_STYLES[stage])}>
      {/* column header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-sm">{stage}</span>
            <span className="inline-flex items-center justify-center size-5 rounded-full bg-background text-xs font-mono font-medium shadow-sm">
              {deals.length}
            </span>
          </div>
          {deals.length > 0 && (
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {formatCurrency(total)}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={() => onAdd(stage)}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* droppable zone */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 px-2 pb-2 space-y-2 min-h-[120px] transition-colors",
              snapshot.isDraggingOver && "bg-primary/5"
            )}
          >
            {deals.map((deal, index) => (
              <div key={deal._id} className="group">
                <DealCard
                  deal={deal}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            ))}
            {provided.placeholder}
            {deals.length === 0 && !snapshot.isDraggingOver && (
              <div
                className="flex items-center justify-center h-16 rounded-lg border-2 border-dashed border-border/60 cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => onAdd(stage)}
              >
                <span className="text-xs text-muted-foreground">Drop here or add deal</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
