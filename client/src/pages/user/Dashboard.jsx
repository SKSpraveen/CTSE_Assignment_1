import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyProfile, getMyAppointments, cancelAppointment } from "../../api/axios";
import { Spinner } from "../../components/Spinner";
import { Page, PageContainer } from "../../components/ui/page";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { CalendarPlus, CheckCircle, XCircle, Clock, Calendar, IdCard } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appts,   setAppts]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [p, a] = await Promise.all([getMyProfile(), getMyAppointments()]);
      setProfile(p.data); setAppts(a.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    await cancelAppointment(id); load();
  };

  const statusIcon = (s) => s === "confirmed"
    ? <CheckCircle size={12} className="text-emerald-400" />
    : s === "cancelled"
    ? <XCircle size={12} className="text-red-400" />
    : <Clock size={12} className="text-amber-400" />;

  const statusBadge = (s) => {
    if (s === "confirmed") return "success";
    if (s === "cancelled") return "destructive";
    return "warning";
  };

  if (loading) return <Spinner />;

  return (
    <Page>
      <PageContainer>
        <div className="flex flex-col gap-6">
          {/* Hero card */}
          <div className="animate-fade-up rounded-2xl overflow-hidden border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="relative bg-gradient-to-br from-[#112244] via-[#1a3260] to-[#0d1f3c] px-6 py-8">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
              <div className="absolute top-0 right-10 w-56 h-40 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div>
                  <p className="text-xs text-blue-300/60 font-mono uppercase tracking-widest mb-1">Welcome back</p>
                  <h1 className="text-2xl font-bold text-white tracking-tight">{profile?.name}</h1>
                  <p className="text-blue-200/70 text-sm mt-1">{profile?.email}</p>
                  <div className="mt-3">
                    {profile?.isVerified ? (
                      <Badge variant="success"><CheckCircle size={11} /> Verified</Badge>
                    ) : (
                      <Badge variant="warning"><Clock size={11} /> Pending verification</Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link to="/profile">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <IdCard size={14} /> View profile
                    </Button>
                  </Link>
                  <Link to="/book">
                    <Button size="sm" className="w-full sm:w-auto">
                      <CalendarPlus size={14} /> Book appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#0a1628]/80 border-t border-white/6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">Signed in as</div>
                  <div className="text-sm font-mono text-slate-300">{user?.email || profile?.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section header */}
          <div className="flex items-center justify-between animate-fade-up-delay-1">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" /> My Appointments
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage upcoming and past bookings.</p>
            </div>
          </div>

          {/* Appointments */}
          {appts.length === 0 ? (
            <Card className="animate-fade-up-delay-2">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <CalendarPlus size={22} className="text-blue-400" />
                </div>
                <CardTitle className="text-white mb-1">No appointments yet</CardTitle>
                <CardDescription className="mb-5">Book a time slot with a provider.</CardDescription>
                <Link to="/book">
                  <Button size="sm">
                    <CalendarPlus size={14} /> Book appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="animate-fade-up-delay-2">
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Your latest bookings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {appts.map((a, idx) => (
                  <div key={a._id} className="rounded-xl border border-white/8 bg-white/3 p-4 hover:bg-white/5 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="font-medium text-white text-sm font-mono">{a.date} · {a.startTime} – {a.endTime}</div>
                        <div className="text-xs text-slate-500 mt-1">Provider ID: {a.providerId}</div>
                        {a.notes && <div className="text-xs text-slate-500 mt-0.5 italic">"{a.notes}"</div>}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Badge variant={statusBadge(a.status)} className="capitalize">
                          {statusIcon(a.status)} {a.status}
                        </Badge>
                        {a.status !== "cancelled" && (
                          <Button variant="destructive" size="sm" onClick={() => cancel(a._id)}>
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </PageContainer>
    </Page>
  );
}