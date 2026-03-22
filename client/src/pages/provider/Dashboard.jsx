import { useEffect, useState } from "react";
import { getProviderProfile, updateProviderProfile, getNotifications, markNotifRead } from "../../api/axios";
import { Spinner } from "../../components/Spinner";
import { Alert } from "../../components/Alert";
import { Bell, Plus, Trash2, Save, User } from "lucide-react";

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-2xl text-white p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{profile?.name}</h1>
          <p className="text-purple-200 text-sm mt-1">{profile?.specialty} · {profile?.email}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          profile?.isActive ? "bg-green-500" : "bg-yellow-500"}`}>
          {profile?.isActive ? "Active" : "Pending Activation"}
        </span>
      </div>

      {/* Unread badge */}
      <div className="flex gap-2 mb-4">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t ? "bg-blue-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}>
            {t === "Notifications" && <Bell size={15}/>}
            {t === "Profile & Availability" && <User size={15}/>}
            {t}
            {t === "Notifications" && notifs.filter(n => !n.isRead).length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                {notifs.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <Alert type={msg.type} msg={msg.text} />

      {/* Profile & Availability Tab */}
      {tab === "Profile & Availability" && (
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name",  field: "name" },
              { label: "Specialty", field: "specialty" },
              { label: "Phone",     field: "phone" },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type="text"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile?.[field] || ""}
                  onChange={e => setProfile({ ...profile, [field]: e.target.value })} />
              </div>
            ))}
          </div>

          {/* Availability Slots */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Availability Slots</h3>
            <div className="space-y-2 mb-4">
              {(profile?.availability || []).map(s => (
                <div key={s._id} className={`flex items-center justify-between p-3 rounded-lg border ${
                  s.isBooked ? "bg-gray-50 text-gray-400" : "bg-blue-50"}`}>
                  <span className="text-sm">{s.date} · {s.startTime} – {s.endTime}
                    {s.isBooked && <span className="ml-2 text-xs bg-gray-200 px-1.5 py-0.5 rounded">Booked</span>}
                  </span>
                  {!s.isBooked && (
                    <button onClick={() => removeSlot(s._id)}
                      className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                  )}
                </div>
              ))}
            </div>

            {/* Add new slot */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <input type="date"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newSlot.date} onChange={e => setNewSlot({...newSlot, date: e.target.value})} />
              <input type="time"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newSlot.startTime} onChange={e => setNewSlot({...newSlot, startTime: e.target.value})} />
              <input type="time"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newSlot.endTime} onChange={e => setNewSlot({...newSlot, endTime: e.target.value})} />
            </div>
            <button onClick={addSlot}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1.5 rounded-lg">
              <Plus size={14}/> Add Slot
            </button>
          </div>

          <button onClick={saveProfile} disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60">
            <Save size={16}/> {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === "Notifications" && (
        <div className="space-y-3">
          {notifs.length === 0 ? (
            <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
              No notifications yet
            </div>
          ) : notifs.map(n => (
            <div key={n._id} className={`bg-white rounded-xl border p-4 flex justify-between items-start ${
              !n.isRead ? "border-l-4 border-l-blue-500" : ""}`}>
              <div>
                <p className="text-sm font-medium text-gray-800">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  From: {n.userName} · {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.isRead && (
                <button onClick={() => readNotif(n._id)}
                  className="text-xs text-blue-600 hover:underline ml-4 whitespace-nowrap">
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}