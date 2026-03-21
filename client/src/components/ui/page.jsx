import { cn } from "../../lib/utils";

export function Page({ className, ...props }) {
  return (
    <div
      className={cn("min-h-screen w-full bg-[#020817]", className)}
      {...props}
    />
  );
}

export function PageContainer({ className, ...props }) {
  return (
    <div
      className={cn("mx-auto w-full max-w-5xl p-4 sm:p-6 animate-fade-up", className)}
      {...props}
    />
  );
}