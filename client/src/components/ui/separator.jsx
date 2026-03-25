import { cn } from "../../lib/utils";

export function Separator({ className, ...props }) {
  return (
    <div
      role="separator"
      className={cn("h-px w-full bg-white/8", className)}
      {...props}
    />
  );
}