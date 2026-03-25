import { cn } from "../../lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default:     "bg-blue-500/15 text-blue-300 border border-blue-500/30",
    success:     "bg-emerald-500/12 text-emerald-300 border border-emerald-500/25",
    warning:     "bg-amber-500/12 text-amber-300 border border-amber-500/25",
    destructive: "bg-red-500/12 text-red-300 border border-red-500/25",
    neutral:     "bg-white/6 text-slate-300 border border-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}