import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/8 bg-[#0d1f3c]/70 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-slate-100",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("p-6 pb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return (
    <h3 className={cn("text-base font-semibold leading-none text-white tracking-tight", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p className={cn("text-sm text-slate-400 mt-1.5", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div className={cn("p-6 pt-0 flex items-center", className)} {...props} />
  );
}