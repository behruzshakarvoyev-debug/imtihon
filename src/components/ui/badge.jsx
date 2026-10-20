import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-blue-600 text-white",
  secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  destructive: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400",
  outline: "text-gray-700 border border-gray-300 dark:text-gray-300 dark:border-gray-700",
  success: "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-400",
};

function Badge({ className, variant = "default", ...props }) {
  const vClass = badgeVariants[variant] || badgeVariants.default;
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
        vClass,
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
