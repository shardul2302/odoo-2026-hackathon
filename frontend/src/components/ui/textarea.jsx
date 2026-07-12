import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 outline-none transition-colors",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
