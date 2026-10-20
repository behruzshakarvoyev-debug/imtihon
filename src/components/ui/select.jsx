import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const SelectContext = React.createContext(null);

function Select({ value, defaultValue, onValueChange, children }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const [open, setOpen] = React.useState(false);
  const [labels, setLabels] = React.useState({});
  const selectRef = React.useRef(null);

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = React.useCallback(
    (newVal) => {
      if (value === undefined) setInternalValue(newVal);
      if (onValueChange) onValueChange(newVal);
      setOpen(false);
    },
    [value, onValueChange]
  );

  const registerLabel = React.useCallback((val, label) => {
    setLabels((prev) => (prev[val] === label ? prev : { ...prev, [val]: label }));
  }, []);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        labels,
        registerLabel,
      }}
    >
      <div ref={selectRef} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200" />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

function SelectValue({ placeholder }) {
  const { value, labels } = React.useContext(SelectContext);
  const displayLabel = labels[value];
  const hasValue = value !== undefined && value !== null && value !== "";

  return (
    <span className={cn("block truncate text-left", !hasValue && "text-gray-400 dark:text-gray-500")}>
      {hasValue ? displayLabel || value : placeholder}
    </span>
  );
}

function SelectContent({ className, children, ...props }) {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute left-0 top-full z-50 mt-1 max-h-60 w-full min-w-[8rem] overflow-auto rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SelectItem({ value, children, className, ...props }) {
  const { value: selectedValue, onValueChange, registerLabel } = React.useContext(SelectContext);

  React.useEffect(() => {
    if (typeof children === "string" || typeof children === "number") {
      registerLabel(value, String(children));
    }
  }, [value, children, registerLabel]);

  const isSelected = String(selectedValue) === String(value);

  return (
    <div
      onClick={() => onValueChange(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        isSelected && "bg-blue-50 font-medium text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
