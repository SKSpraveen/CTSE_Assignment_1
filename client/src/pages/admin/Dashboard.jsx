import { useEffect, useState } from "react";
import {
  getAllUsers, verifyUser, deactivateUser,
  getAllProviders, activateProvider, deactivateProvider, deleteProvider,
  getAllAppointments
} from "../../api/axios";
import { Spinner } from "../../components/Spinner";
import { Page, PageContainer } from "../../components/ui/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Users, Briefcase, Calendar, CheckCircle, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const TABS = ["Users", "Providers", "Appointments"];

export default function AdminDashboard() {
  const [tab,     setTab]    = useState("Users");
  const [users,   setUsers]  = useState([]);
  const [provs,   setProvs]  = useState([]);
  const [appts,   setAppts]  = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [u, p, a] = await Promise.all([getAllUsers(), getAllProviders(), getAllAppointments()]);
      setUsers(u.data); setProvs(p.data); setAppts(a.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const action = async (fn, ...args) => { await fn(...args); load(); };

  const tabIcon = {
    Users:        <Users size={15}/>,
    Providers:    <Briefcase size={15}/>,
    Appointments: <Calendar size={15}/>,
  };

  const statusBadge = (s) => {
    if (s === "confirmed") return "success";
    if (s === "cancelled") return "destructive";
    return "warning";
  };

  const statCards = [
    { label: "Total Users",        val: users.length, icon: Users,    color: "text-blue-400",    ring: "bg-blue-500/12 border-blue-500/25" },
    { label: "Total Providers",    val: provs.length, icon: Briefcase,color: "text-slate-300",   ring: "bg-white/6 border-white/12" },
    { label: "Total Appointments", val: appts.length, icon: Calendar, color: "text-emerald-400", ring: "bg-emerald-500/12 border-emerald-500/25" },
  ];

  const thClass = "text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-widest bg-white/3 border-b border-white/8";
  const tdClass = "px-4 py-3.5";

  return (
    <Page>
      <PageContainer>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 animate-fade-up">
          <div>
            <p className="text-xs text-blue-400 font-mono uppercase tracking-widest mb-1">Control Panel</p>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Manage users, providers and appointments.</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/8 bg-[#0d1f3c]/60 backdrop-blur-sm p-5 flex items-center justify-between group hover:border-blue-500/25 transition-all duration-300"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white font-mono">{s.val}</p>
              </div>
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${s.ring} ${s.color}`}>
                <s.icon size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          {TABS.map((t) => (
            <Button
              key={t}
              type="button"
              variant={tab === t ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t)}
            >
              {tabIcon[t]} {t}
            </Button>
          ))}
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <Card className="overflow-hidden animate-fade-up">
            {/* ── Users ───────────────────────────────────────── */}
            {tab === "Users" && (
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {["Name", "Email", "Phone", "Verified", "Active", "Actions"].map(h => (
                          <th key={h} className={thClass}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-white/3 transition-colors">
                          <td className={`${tdClass} font-medium text-white`}>{u.name}</td>
                          <td className={`${tdClass} text-slate-400 font-mono text-xs`}>{u.email}</td>
                          <td className={`${tdClass} text-slate-400`}>{u.phone || "—"}</td>
                          <td className={tdClass}>
                            {u.isVerified
                              ? <Badge variant="success"><CheckCircle size={11} /> Verified</Badge>
                              : <Badge variant="neutral">No</Badge>}
                          </td>
                          <td className={tdClass}>
                            {u.isActive
                              ? <Badge variant="success">Active</Badge>
                              : <Badge variant="destructive">Inactive</Badge>}
                          </td>
                          <td className={tdClass}>
                            <div className="flex flex-wrap gap-2">
                              {!u.isVerified && (
                                <Button size="sm" variant="secondary" onClick={() => action(verifyUser, u._id)}>
                                  Verify
                                </Button>
                              )}
                              {u.isActive && (
                                <Button size="sm" variant="destructive" onClick={() => action(deactivateUser, u._id)}>
                                  Deactivate
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}

            {/* ── Providers ──────────────────────────────────── */}
            {tab === "Providers" && (
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {["Name", "Email", "Specialty", "Status", "Actions"].map(h => (
                          <th key={h} className={thClass}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {provs.map((p) => (
                        <tr key={p._id} className="hover:bg-white/3 transition-colors">
                          <td className={`${tdClass} font-medium text-white`}>{p.name}</td>
                          <td className={`${tdClass} text-slate-400 font-mono text-xs`}>{p.email}</td>
                          <td className={`${tdClass} text-slate-300`}>{p.specialty}</td>
                          <td className={tdClass}>
                            {p.isActive
                              ? <Badge variant="success">Active</Badge>
                              : <Badge variant="neutral">Inactive</Badge>}
                          </td>
                          <td className={tdClass}>
                            <div className="flex flex-wrap gap-2">
                              {p.isActive ? (
                                <Button size="sm" variant="outline" className="text-amber-300 border-amber-500/25 hover:bg-amber-500/10"
                                  onClick={() => action(deactivateProvider, p._id)}>
                                  <ToggleLeft size={13} /> Deactivate
                                </Button>
                              ) : (
                                <Button size="sm" variant="secondary" onClick={() => action(activateProvider, p._id)}>
                                  <ToggleRight size={13} /> Activate
                                </Button>
                              )}
                              <Button size="sm" variant="destructive"
                                onClick={() => { if (confirm("Delete this provider?")) action(deleteProvider, p._id); }}>
                                <Trash2 size={13} /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}

            {/* ── Appointments ──────────────────────────────── */}
            {tab === "Appointments" && (
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {["User", "Provider", "Date", "Time", "Status"].map(h => (
                          <th key={h} className={thClass}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {appts.map((a) => (
                        <tr key={a._id} className="hover:bg-white/3 transition-colors">
                          <td className={`${tdClass} text-white font-medium`}>{a.userName || a.userId}</td>
                          <td className={`${tdClass} text-slate-400`}>{a.providerId}</td>
                          <td className={`${tdClass} text-slate-300 font-mono text-xs`}>{a.date}</td>
                          <td className={`${tdClass} text-slate-400 font-mono text-xs`}>{a.startTime} – {a.endTime}</td>
                          <td className={tdClass}>
                            <Badge variant={statusBadge(a.status)} className="capitalize">{a.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}

            <Separator />
          </Card>
        )}
      </PageContainer>
    </Page>
  );
}