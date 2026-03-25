export function Alert({ type = "error", msg }) {
  if (!msg) return null;
 
  const styles = type === "success"
    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.12)]"
    : "bg-red-500/10 text-red-300 border border-red-500/25 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.12)]";
 
  const icon = type === "success"
    ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    : <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
 
  return (
    <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm mb-4 ${styles}`}>
      {icon}
      <span>{msg}</span>
    </div>
  );
}
 