import { Calendar } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
            <Calendar size={18} />
          </span>
          <span className="font-semibold text-slate-900">AppointEase</span>
        </div>
        <div className="text-sm text-slate-600">© {year} AppointEase. All rights reserved.</div>
      </div>
    </footer>
  );
}
