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
  const [tab,    setTab]    = useState("Users");
  const [users,  setUsers]  = useState([]);
  const [provs,  setProvs]  = useState([]);
  const [appts,  setAppts]  = useState([]);
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

  const tabIcon = { Users: <Users size={16}/>, Providers: <Briefcase size={16}/>, Appointments: <Calendar size={16}/> };

  const statusBadge = (s) => {
    if (s === "confirmed") return "success";
    if (s === "cancelled") return "destructive";
    return "warning";
  };

  return (
    <Page>
      <PageContainer>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Manage users, providers and appointments.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Total Users",
              val: users.length,
              icon: Users,
              tone: "bg-blue-50 text-blue-700 border-blue-100",
            },
            {
              label: "Total Providers",
              val: provs.length,
              icon: Briefcase,
              tone: "bg-slate-50 text-slate-700 border-slate-200",
            },
            {
              label: "Total Appointments",
              val: appts.length,
              icon: Calendar,
              tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
            },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader className="pb-3">
                <CardDescription>{s.label}</CardDescription>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl">{s.val}</CardTitle>
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${s.tone}`}>
                    <s.icon size={18} />
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {TABS.map((t) => (
            <Button
              key={t}
              type="button"
              variant={tab === t ? "default" : "outline"}
              onClick={() => setTab(t)}
              className={tab === t ? "" : "border-slate-200"}
            >
              {tabIcon[t]} {t}
            </Button>
          ))}
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <Card className="overflow-hidden">
            {tab === "Users" && (
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        {["Name", "Email", "Phone", "Verified", "Active", "Actions"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                          <td className="px-4 py-3 text-slate-600">{u.email}</td>
                          <td className="px-4 py-3 text-slate-600">{u.phone || "—"}</td>
                          <td className="px-4 py-3">
                            {u.isVerified ? (
                              <Badge variant="success">
                                <CheckCircle size={14} /> Verified
                              </Badge>
                            ) : (
                              <Badge variant="neutral">No</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {u.isActive ? (
                              <Badge variant="success">Active</Badge>
                            ) : (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {!u.isVerified && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-200 text-green-700 hover:bg-green-50"
                                  onClick={() => action(verifyUser, u._id)}
                                >
                                  Verify
                                </Button>
                              )}
                              {u.isActive && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-200 text-red-700 hover:bg-red-50"
                                  onClick={() => action(deactivateUser, u._id)}
                                >
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

            {tab === "Providers" && (
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        {["Name", "Email", "Specialty", "Status", "Actions"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {provs.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                          <td className="px-4 py-3 text-slate-600">{p.email}</td>
                          <td className="px-4 py-3 text-slate-700">{p.specialty}</td>
                          <td className="px-4 py-3">
                            {p.isActive ? (
                              <Badge variant="success">Active</Badge>
                            ) : (
                              <Badge variant="neutral">Inactive</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {p.isActive ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-amber-200 text-amber-800 hover:bg-amber-50"
                                  onClick={() => action(deactivateProvider, p._id)}
                                >
                                  <ToggleLeft size={14} /> Deactivate
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-200 text-green-700 hover:bg-green-50"
                                  onClick={() => action(activateProvider, p._id)}
                                >
                                  <ToggleRight size={14} /> Activate
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  if (confirm("Delete this provider?")) action(deleteProvider, p._id);
                                }}
                              >
                                <Trash2 size={14} /> Delete
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

            {tab === "Appointments" && (
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        {["User", "Provider", "Date", "Time", "Status"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {appts.map((a) => (
                        <tr key={a._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-900">{a.userName || a.userId}</td>
                          <td className="px-4 py-3 text-slate-600">{a.providerId}</td>
                          <td className="px-4 py-3 text-slate-700">{a.date}</td>
                          <td className="px-4 py-3 text-slate-700">
                            {a.startTime} – {a.endTime}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={statusBadge(a.status)} className="capitalize">
                              {a.status}
                            </Badge>
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