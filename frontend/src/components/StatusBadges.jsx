import React from "react";
import { Badge } from "@/components/ui/badge";

const LEAD_STATUS_STYLES = {
  New: "secondary",
  Contacted: "accent",
  Qualified: "default",
  Won: "success",
  Lost: "destructive",
};

const DEAL_STAGE_STYLES = {
  New: "secondary",
  Qualified: "accent",
  Proposition: "default",
  Won: "success",
  Lost: "destructive",
};

const ACTIVITY_STATUS_STYLES = {
  Pending: "warning",
  Completed: "success",
  Cancelled: "destructive",
};

export function LeadStatusBadge({ status }) {
  return <Badge variant={LEAD_STATUS_STYLES[status] || "outline"}>{status}</Badge>;
}

export function DealStageBadge({ stage }) {
  return <Badge variant={DEAL_STAGE_STYLES[stage] || "outline"}>{stage}</Badge>;
}

export function ActivityStatusBadge({ status }) {
  return (
    <Badge variant={ACTIVITY_STATUS_STYLES[status] || "outline"}>{status}</Badge>
  );
}
