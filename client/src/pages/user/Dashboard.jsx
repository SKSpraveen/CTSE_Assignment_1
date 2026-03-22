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
  const [profile, setProfile]   = useState(null);
  const [appts,   setAppts]     = useState([]);
  const [loading, setLoading]   = useState(true);

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
    ? <CheckCircle size={14} className="text-green-500" />
    : s === "cancelled"
    ? <XCircle size={14} className="text-red-500" />
    : <Clock size={14} className="text-yellow-500" />;

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
          <Card className="overflow-hidden">
            <div className="bg-blue-700">
              <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-white">
                  <h1 className="text-2xl font-bold">Welcome, {profile?.name}</h1>
                  <p className="text-blue-100 text-sm mt-1">{profile?.email}</p>
                  <div className="mt-3">
                    {profile?.isVerified ? (
                      <Badge variant="success">
                        <CheckCircle size={14} /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        <Clock size={14} /> Pending verification
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/profile">
                    <Button variant="secondary" className="w-full sm:w-auto">
                      <IdCard size={16} /> View profile
                    </Button>
                  </Link>
                  <Link to="/book">
                    <Button className="w-full sm:w-auto">
                      <CalendarPlus size={16} /> Book appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600">Signed in as</div>
                  <div className="font-medium text-slate-900">{user?.email || profile?.email}</div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Calendar size={18} className="text-blue-700" /> My Appointments
              </h2>
              <p className="text-sm text-slate-600 mt-1">Manage upcoming and past bookings.</p>
            </div>
          </div>

          {appts.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No appointments yet</CardTitle>
                <CardDescription>Book a time slot with a provider.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/book">
                  <Button>
                    <CalendarPlus size={16} /> Book appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Your latest bookings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {appts.map((a, idx) => (
                  <div key={a._id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="font-medium text-slate-900">
                          {a.date} · {a.startTime} – {a.endTime}
                        </div>
                        <div className="text-sm text-slate-600 mt-1">Provider ID: {a.providerId}</div>
                        {a.notes && (
                          <div className="text-xs text-slate-500 mt-1">Note: {a.notes}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={statusBadge(a.status)} className="capitalize">
                          {statusIcon(a.status)} {a.status}
                        </Badge>
                        {a.status !== "cancelled" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => cancel(a._id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                    {idx !== appts.length - 1 && <Separator className="mt-4" />}
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