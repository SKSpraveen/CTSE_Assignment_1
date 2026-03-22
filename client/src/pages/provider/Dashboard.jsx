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

  // Availability slot form
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
        specialty: profile.specialty, availability: profile.availability
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
        <div className="mb-6">
          <Card className="overflow-hidden">
            <div className="bg-blue-700">
              <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{profile?.name}</h1>
                  <p className="text-blue-100 text-sm mt-1">
                    {profile?.specialty} · {profile?.email}
                  </p>
                </div>
                {profile?.isActive ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="warning">Pending activation</Badge>
                )}
              </div>
            </div>
          </Card>
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
              {t === "Profile & Availability" ? <User size={16} /> : <Bell size={16} />}
              {t}
              {t === "Notifications" && unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <Alert type={msg.type} msg={msg.text} />

        {tab === "Profile & Availability" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your details and availability.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Full Name", field: "name" },
                    { label: "Specialty", field: "specialty" },
                    { label: "Phone", field: "phone" },
                  ].map(({ label, field }) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{label}</Label>
                      <Input
                        id={field}
                        type="text"
                        value={profile?.[field] || ""}
                        onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <div className="font-semibold text-slate-900">Availability Slots</div>
                      <div className="text-sm text-slate-600">Add and manage your free slots.</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {(profile?.availability || []).length === 0 ? (
                      <div className="text-sm text-slate-500">No slots added yet.</div>
                    ) : (
                      (profile?.availability || []).map((s) => (
                        <div
                          key={s._id}
                          className={
                            "flex items-center justify-between gap-3 rounded-2xl border p-4 " +
                            (s.isBooked
                              ? "border-slate-200 bg-slate-50"
                              : "border-blue-200 bg-blue-50")
                          }
                        >
                          <div className="text-sm text-slate-900">
                            <span className="font-medium">{s.date}</span> · {s.startTime} – {s.endTime}
                          </div>
                          <div className="flex items-center gap-2">
                            {s.isBooked ? (
                              <Badge variant="neutral">Booked</Badge>
                            ) : (
                              <Badge>Available</Badge>
                            )}
                            {!s.isBooked && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="border-red-200 text-red-700 hover:bg-red-50"
                                onClick={() => removeSlot(s._id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="slot-date">Date</Label>
                      <Input
                        id="slot-date"
                        type="date"
                        value={newSlot.date}
                        onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slot-start">Start</Label>
                      <Input
                        id="slot-start"
                        type="time"
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slot-end">End</Label>
                      <Input
                        id="slot-end"
                        type="time"
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <Button type="button" variant="secondary" onClick={addSlot}>
                      <Plus size={16} /> Add Slot
                    </Button>
                  </div>
                </div>

                <Button onClick={saveProfile} disabled={saving} className="w-full">
                  <Save size={16} /> {saving ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "Notifications" && (
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Messages from users and the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifs.length === 0 ? (
                <div className="text-sm text-slate-500">No notifications yet.</div>
              ) : (
                notifs.map((n) => (
                  <div
                    key={n._id}
                    className={
                      "rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 " +
                      (!n.isRead ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white")
                    }
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900">{n.message}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        From: {n.userName} · {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {!n.isRead ? (
                      <Button type="button" variant="outline" size="sm" onClick={() => readNotif(n._id)}>
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