
import React from "react";
import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "default";

interface StatusBadgeProps {
  status: StatusType;
  text: string;
  className?: string;
}

export const StatusBadge = ({ status, text, className }: StatusBadgeProps) => {
  const statusStyles: Record<StatusType, string> = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    default: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      {text}
    </span>
  );
};

export const PulseBadge = ({ status, className }: { status: StatusType; className?: string }) => {
  const pulseColors: Record<StatusType, string> = {
    success: "bg-green-400",
    warning: "bg-yellow-400",
    error: "bg-red-400",
    info: "bg-blue-400",
    default: "bg-gray-400",
  };

  return (
    <span className={cn("relative flex h-3 w-3", className)}>
      <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", pulseColors[status])}></span>
      <span className={cn("relative inline-flex rounded-full h-3 w-3", pulseColors[status])}></span>
    </span>
  );
};
