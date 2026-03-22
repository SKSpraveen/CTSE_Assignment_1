export function Alert({ type = "error", msg }) {
  if (!msg) return null;
  const s = type === "success"
    ? "bg-green-50 text-green-800 border border-green-300"
    : "bg-red-50 text-red-800 border border-red-300";
  return <div className={`rounded-lg px-4 py-3 text-sm mb-4 ${s}`}>{msg}</div>;
}