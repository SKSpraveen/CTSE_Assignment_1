import { cn } from "../../lib/utils";

export function Page({ className, ...props }) {
  return (
    <div
      className={cn("h-full w-full bg-slate-50", className)}
      {...props}
    />
  );
}

export function PageContainer({ className, ...props }) {
  return <div className={cn("mx-auto w-full max-w-5xl p-4 sm:p-6", className)} {...props} />;
}
