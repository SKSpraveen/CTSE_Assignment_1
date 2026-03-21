import { Calendar } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-[#020817]/85 backdrop-blur-sm mt-auto">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/25 text-blue-400">
            <Calendar size={14} />
          </span>
          <span className="font-semibold text-white">
            Appoint<span className="text-blue-400">Ease</span>
          </span>
        </div>
        <div className="text-xs text-slate-300 font-mono">© {year} AppointEase. All rights reserved.</div>
      </div>
    </footer>
  );
}