import * as React from "react";
import { cn } from "../../lib/utils";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[96px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:border-blue-500/50 focus-visible:bg-white/8",
        "hover:border-white/16 hover:bg-white/6",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "[color-scheme:dark]",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";