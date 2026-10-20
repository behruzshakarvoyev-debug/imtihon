import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    ghost: "hover:bg-gray-100 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800",
    link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
  },
  size: {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9 p-0 flex items-center justify-center",
  },
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
    const vClass = buttonVariants.variant[variant] || buttonVariants.variant.default;
    const sClass = buttonVariants.size[size] || buttonVariants.size.default;

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          vClass,
          sClass,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
