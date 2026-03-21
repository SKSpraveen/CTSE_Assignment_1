import * as React from "react";
import { cn } from "../../lib/utils";

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variants = {
      default:
        "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.4),0_4px_12px_rgba(37,99,235,0.35)] hover:shadow-[0_0_0_1px_rgba(59,130,246,0.6),0_4px_20px_rgba(37,99,235,0.5)]",
      secondary:
        "bg-blue-500/12 text-blue-300 border border-blue-500/25 hover:bg-blue-500/20 hover:border-blue-400/40",
      outline:
        "border border-white/10 bg-white/4 text-slate-200 hover:bg-white/8 hover:border-white/20",
      ghost:
        "text-slate-300 hover:bg-white/6 hover:text-white",
      destructive:
        "bg-red-500/15 text-red-300 border border-red-500/25 hover:bg-red-500/25 hover:border-red-400/40",
    };

    const sizes = {
      default: "h-10 px-4",
      sm:      "h-8 px-3 text-xs",
      lg:      "h-11 px-6",
      icon:    "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";