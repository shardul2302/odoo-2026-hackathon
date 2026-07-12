import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Pencil, Trash2, Building2, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function DealCard({ deal, index, onEdit, onDelete }) {
  const isLate =
    deal.expectedCloseDate &&
    new Date(deal.expectedCloseDate) < new Date() &&
    !["Won", "Lost"].includes(deal.stage);

  return (
    <Draggable draggableId={deal._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card
            className={cn(
              "p-3 cursor-grab active:cursor-grabbing gap-2 transition-shadow",
              snapshot.isDragging ? "shadow-xl ring-2 ring-primary/30 rotate-1" : "hover:shadow-md"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-sm leading-tight flex-1">{deal.title}</p>
              <div className="flex items-center gap-0.5 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); onEdit(deal); }}
                >
                  <Pencil className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); onDelete(deal); }}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold text-primary">
                {formatCurrency(deal.value)}
              </span>
              <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                {deal.probability}%
              </span>
            </div>

            {(deal.company?.name || deal.contact?.name) && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {deal.company?.name ? (
                  <>
                    <Building2 className="size-3 shrink-0" />
                    <span className="truncate">{deal.company.name}</span>
                  </>
                ) : (
                  <>
                    <User className="size-3 shrink-0" />
                    <span className="truncate">{deal.contact.name}</span>
                  </>
                )}
              </div>
            )}

            {deal.expectedCloseDate && (
              <p
                className={cn(
                  "text-[11px] font-medium",
                  isLate ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {isLate ? "⚠ Overdue · " : "Close · "}
                {formatDate(deal.expectedCloseDate)}
              </p>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
}
