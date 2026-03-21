import { useEffect, useState } from "react";
import { getProviderProfile, updateProviderProfile, getNotifications, markNotifRead } from "../../api/axios";
import { Spinner } from "../../components/Spinner";
import { Alert } from "../../components/Alert";
import { Bell, Plus, Trash2, Save, User } from "lucide-react";
import { Page, PageContainer } from "../../components/ui/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

const TABS = ["Profile & Availability", "Notifications"];

export default function ProviderDashboard() {
  const [tab,     setTab]    = useState("Profile & Availability");
  const [profile, setProfile] = useState(null);
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState({ type: "", text: "" });
  const [newSlot, setNewSlot] = useState({ date: "", startTime: "", endTime: "" });

  const load = async () => {
    try {
      const [p, n] = await Promise.all([getProviderProfile(), getNotifications()]);
      setProfile(p.data); setNotifs(n.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const addSlot = () => {
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime)
      return setMsg({ type: "error", text: "Fill all slot fields" });
    setProfile(prev => ({
      ...prev,
      availability: [...(prev.availability || []), { ...newSlot, _id: Date.now().toString(), isBooked: false }]
    }));
    setNewSlot({ date: "", startTime: "", endTime: "" });
    setMsg({ type: "", text: "" });
  };

  const removeSlot = (id) => {
    setProfile(prev => ({ ...prev, availability: prev.availability.filter(s => s._id !== id) }));
  };

  const saveProfile = async () => {
    setSaving(true); setMsg({ type: "", text: "" });
    try {
      await updateProviderProfile({
        name: profile.name, phone: profile.phone,
        specialty: profile.specialty, availability: profile.availability,
      });
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (e) {
      setMsg({ type: "error", text: e.response?.data?.message || "Update failed" });
    } finally { setSaving(false); }
  };

  const readNotif = async (id) => { await markNotifRead(id); load(); };

  if (loading) return <Spinner />;

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <Page>
      <PageContainer>
        {/* Hero Banner */}
        <div className="mb-8 animate-fade-up">
          <div className="rounded-2xl overflow-hidden border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="relative bg-gradient-to-br from-[#112244] via-[#1a3260] to-[#0d1f3c] px-6 py-8">
              {/* Background grid */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
              {/* Glow orb */}
              <div className="absolute top-0 right-16 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs text-blue-300/70 font-mono uppercase tracking-widest mb-1">Provider</p>
                  <h1 className="text-2xl font-bold text-white tracking-tight">{profile?.name}</h1>
                  <p className="text-blue-200/70 text-sm mt-1">{profile?.specialty} · {profile?.email}</p>
                </div>
                {profile?.isActive
                  ? <Badge variant="success" className="text-sm px-3 py-1.5 self-start sm:self-auto">Active</Badge>
                  : <Badge variant="warning" className="text-sm px-3 py-1.5 self-start sm:self-auto">Pending activation</Badge>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <Button
              key={t}
              type="button"
              variant={tab === t ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t)}
            >
              {t === "Profile & Availability" ? <User size={14} /> : <Bell size={14} />}
              {t}
              {t === "Notifications" && unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 text-[10px] px-1.5 py-0 min-w-[18px] justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <Alert type={msg.type} msg={msg.text} />

        {/* Profile & Availability */}
        {tab === "Profile & Availability" && (
          <div className="space-y-6 animate-fade-up">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your details and availability.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Full Name",  field: "name"      },
                    { label: "Specialty",  field: "specialty" },
                    { label: "Phone",      field: "phone"     },
                  ].map(({ label, field }) => (
                    <div key={field} className="space-y-1.5">
                      <Label htmlFor={field}>{label}</Label>
                      <Input
                        id={field} type="text"
                        value={profile?.[field] || ""}
                        onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Availability */}
                <div>
                  <div className="mb-4">
                    <p className="font-semibold text-white text-sm">Availability Slots</p>
                    <p className="text-xs text-slate-500 mt-0.5">Add and manage your free slots.</p>
                  </div>

                  <div className="space-y-2 mb-5">
                    {(profile?.availability || []).length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
                        No slots added yet.
                      </div>
                    ) : (
                      (profile?.availability || []).map((s) => (
                        <div
                          key={s._id}
                          className={
                            "flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors " +
                            (s.isBooked
                              ? "border-white/8 bg-white/3"
                              : "border-blue-500/20 bg-blue-500/6")
                          }
                        >
                          <div className="text-sm">
                            <span className="font-medium text-white font-mono">{s.date}</span>
                            <span className="text-slate-400 mx-1">·</span>
                            <span className="text-slate-300 font-mono text-xs">{s.startTime} – {s.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {s.isBooked
                              ? <Badge variant="neutral">Booked</Badge>
                              : <Badge variant="default">Available</Badge>}
                            {!s.isBooked && (
                              <Button type="button" variant="destructive" size="icon"
                                className="h-7 w-7" onClick={() => removeSlot(s._id)}>
                                <Trash2 size={13} />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Slot */}
                  <div className="rounded-xl border border-dashed border-blue-500/20 bg-blue-500/4 p-4">
                    <p className="text-xs text-blue-400 font-mono uppercase tracking-widest mb-3">New Slot</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "slot-date",  label: "Date",  type: "date", key: "date",      val: newSlot.date      },
                        { id: "slot-start", label: "Start", type: "time", key: "startTime", val: newSlot.startTime },
                        { id: "slot-end",   label: "End",   type: "time", key: "endTime",   val: newSlot.endTime   },
                      ].map(({ id, label, type, key, val }) => (
                        <div key={id} className="space-y-1.5">
                          <Label htmlFor={id}>{label}</Label>
                          <Input id={id} type={type} value={val}
                            onChange={(e) => setNewSlot({ ...newSlot, [key]: e.target.value })} />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Button type="button" variant="secondary" size="sm" onClick={addSlot}>
                        <Plus size={14} /> Add Slot
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={saveProfile} disabled={saving} className="w-full h-11">
                  <Save size={15} /> {saving ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications */}
        {tab === "Notifications" && (
          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Messages from users and the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
                  No notifications yet.
                </div>
              ) : (
                notifs.map((n) => (
                  <div
                    key={n._id}
                    className={
                      "rounded-xl border p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 transition-colors " +
                      (!n.isRead ? "border-blue-500/25 bg-blue-500/6" : "border-white/8 bg-white/3")
                    }
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{n.message}</div>
                      <div className="text-xs text-slate-500 mt-1 font-mono">
                        From: {n.userName} · {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {!n.isRead ? (
                      <Button type="button" variant="secondary" size="sm" onClick={() => readNotif(n._id)}>
                        Mark read
                      </Button>
                    ) : (
                      <Badge variant="neutral">Read</Badge>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}
      </PageContainer>
    </Page>
  );
}