import { cn } from "../../lib/utils";

export function Label({ className, ...props }) {
  return (
    <label
      className={cn("text-xs font-medium text-slate-400 uppercase tracking-widest", className)}
      {...props}
    />
  );
}