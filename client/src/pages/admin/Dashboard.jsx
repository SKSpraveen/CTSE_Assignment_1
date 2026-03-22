import { useEffect, useState } from "react";
import {
  getAllUsers, verifyUser, deactivateUser,
  getAllProviders, activateProvider, deactivateProvider, deleteProvider,
  getAllAppointments
} from "../../api/axios";
import { Spinner } from "../../components/Spinner";
import { Users, Briefcase, Calendar, CheckCircle, XCircle, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users",        val: users.length,  color: "bg-blue-500" },
          { label: "Total Providers",    val: provs.length,  color: "bg-purple-500" },
          { label: "Total Appointments", val: appts.length,  color: "bg-green-500" },
        ].map(s => (
          <div key={s.label} className={`${s.color} text-white rounded-xl p-4`}>
            <p className="text-3xl font-bold">{s.val}</p>
            <p className="text-sm opacity-80 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t ? "bg-blue-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}>
            {tabIcon[t]} {t}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-xl border overflow-hidden">

          {/* Users Table */}
          {tab === "Users" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>{["Name","Email","Phone","Verified","Active","Actions"].map(h =>
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.phone || "—"}</td>
                    <td className="px-4 py-3">
                      {u.isVerified
                        ? <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Yes</span>
                        : <span className="text-gray-400">No</span>}
                    </td>
                    <td className="px-4 py-3">
                      {u.isActive
                        ? <span className="text-green-600">Active</span>
                        : <span className="text-red-500">Inactive</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {!u.isVerified && (
                          <button onClick={() => action(verifyUser, u._id)}
                            className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-lg hover:bg-green-100">
                            Verify
                          </button>
                        )}
                        {u.isActive && (
                          <button onClick={() => action(deactivateUser, u._id)}
                            className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-100">
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Providers Table */}
          {tab === "Providers" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>{["Name","Email","Specialty","Status","Actions"].map(h =>
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {provs.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.email}</td>
                    <td className="px-4 py-3">{p.specialty}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {p.isActive ? (
                          <button onClick={() => action(deactivateProvider, p._id)}
                            className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-lg flex items-center gap-1">
                            <ToggleLeft size={12}/> Deactivate
                          </button>
                        ) : (
                          <button onClick={() => action(activateProvider, p._id)}
                            className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-lg flex items-center gap-1">
                            <ToggleRight size={12}/> Activate
                          </button>
                        )}
                        <button onClick={() => { if(confirm("Delete this provider?")) action(deleteProvider, p._id); }}
                          className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-lg flex items-center gap-1">
                          <Trash2 size={12}/> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Appointments Table */}
          {tab === "Appointments" && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>{["User","Provider","Date","Time","Status"].map(h =>
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {appts.map(a => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{a.userName || a.userId}</td>
                    <td className="px-4 py-3 text-gray-500">{a.providerId}</td>
                    <td className="px-4 py-3">{a.date}</td>
                    <td className="px-4 py-3">{a.startTime} – {a.endTime}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        a.status === "confirmed" ? "bg-green-100 text-green-700" :
                        a.status === "cancelled" ? "bg-red-100 text-red-600" :
                        "bg-yellow-100 text-yellow-700"}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}