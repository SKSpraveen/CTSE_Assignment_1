import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyProfile, getMyAppointments, cancelAppointment } from "../../api/axios";
import { Spinner } from "../../components/Spinner";
import { CalendarPlus, CheckCircle, XCircle, Clock, Calendar } from "lucide-react";

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

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hello, {profile?.name} 👋</h1>
          <p className="text-blue-200 text-sm mt-1">{profile?.email}</p>
          <span className={`inline-flex items-center gap-1 mt-2 text-xs px-2 py-1 rounded-full font-medium ${
            profile?.isVerified ? "bg-green-500" : "bg-yellow-500"}`}>
            {profile?.isVerified ? <><CheckCircle size={12}/> Verified</> : <><Clock size={12}/> Pending Verification</>}
          </span>
        </div>
        <Link to="/book"
          className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-50">
          <CalendarPlus size={18} /> Book Appointment
        </Link>
      </div>

      {/* Appointments */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Calendar size={18} /> My Appointments
      </h2>
      {appts.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
          No appointments yet. <Link to="/book" className="text-blue-600 hover:underline">Book one now</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appts.map(a => (
            <div key={a._id} className="bg-white rounded-xl border p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{a.date} · {a.startTime} – {a.endTime}</p>
                <p className="text-sm text-gray-500 mt-0.5">Provider ID: {a.providerId}</p>
                {a.notes && <p className="text-xs text-gray-400 mt-0.5">Note: {a.notes}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm capitalize text-gray-600">
                  {statusIcon(a.status)} {a.status}
                </span>
                {a.status !== "cancelled" && (
                  <button onClick={() => cancel(a._id)}
                    className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-2 py-1 rounded-lg">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}