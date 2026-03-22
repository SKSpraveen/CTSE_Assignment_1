import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProviders, getAvailability, bookAppointment } from "../../api/axios";
import { Spinner } from "../../components/Spinner";
import { Alert } from "../../components/Alert";
import { User, Clock, CalendarCheck } from "lucide-react";

export default function BookAppointment() {
  const [providers,  setProviders]  = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [slots,      setSlots]      = useState([]);
  const [slotId,     setSlotId]     = useState("");
  const [notes,      setNotes]      = useState("");
  const [loading,    setLoading]    = useState(true);
  const [slotsLoad,  setSlotsLoad]  = useState(false);
  const [msg,        setMsg]        = useState({ type: "", text: "" });
  const nav = useNavigate();

  useEffect(() => {
    getProviders().then(r => setProviders(r.data)).finally(() => setLoading(false));
  }, []);

  const selectProvider = async (p) => {
    setSelected(p); setSlotId(""); setSlots([]); setSlotsLoad(true);
    try {
      const r = await getAvailability(p._id);
      setSlots(r.data.freeSlots || []);
    } finally { setSlotsLoad(false); }
  };

  const submit = async (e) => {
    e.preventDefault(); setMsg({ type: "", text: "" });
    if (!slotId) return setMsg({ type: "error", text: "Please select a time slot" });
    try {
      await bookAppointment({ providerId: selected._id, slotId, notes });
      setMsg({ type: "success", text: "Appointment booked successfully!" });
      setTimeout(() => nav("/dashboard"), 2000);
    } catch (e) {
      setMsg({ type: "error", text: e.response?.data?.message || "Booking failed" });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h1>
      <Alert type={msg.type} msg={msg.text} />

      {/* Step 1 — Pick provider */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><User size={16}/> Select Provider</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {providers.map(p => (
            <button key={p._id} onClick={() => selectProvider(p)}
              className={`text-left p-4 rounded-xl border-2 transition ${
                selected?._id === p._id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
              <p className="font-medium text-gray-800">{p.name}</p>
              <p className="text-sm text-gray-500">{p.specialty}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — Pick slot */}
      {selected && (
        <div className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Clock size={16}/> Select Time Slot</h2>
          {slotsLoad ? <Spinner /> : slots.length === 0 ? (
            <p className="text-gray-400 text-sm">No available slots for this provider.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {slots.map(s => (
                <button key={s._id} onClick={() => setSlotId(s._id)}
                  className={`p-3 rounded-xl border-2 text-sm transition ${
                    slotId === s._id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
                  <p className="font-medium">{s.date}</p>
                  <p className="text-gray-500">{s.startTime} – {s.endTime}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Notes + confirm */}
      {slotId && (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea rows={3} placeholder="Any special requests..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <button type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2">
            <CalendarCheck size={16} /> Confirm Booking
          </button>
        </form>
      )}
    </div>
  );
}