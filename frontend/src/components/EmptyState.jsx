import React from "react";
import { Button } from "@/components/ui/button";

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-border rounded-xl bg-muted/30">
      {Icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground mb-4">
          <Icon className="size-5" />
        </div>
      )}
      <h3 className="font-display font-semibold text-base mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
