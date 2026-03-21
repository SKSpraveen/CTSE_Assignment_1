export function Spinner() {
  return (
    <div className="flex flex-col justify-center items-center h-40 gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 animate-spin" />
        <div className="absolute inset-[6px] rounded-full border-2 border-transparent border-t-blue-300/60 animate-spin [animation-duration:0.7s]" />
      </div>
      <span className="text-xs text-slate-500 tracking-widest uppercase">Loading</span>
    </div>
  );
}