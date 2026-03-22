import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProviders, getAvailability, bookAppointment } from "../../api/axios";
import { Spinner } from "../../components/Spinner";
import { Alert } from "../../components/Alert";
import { User, Clock, CalendarCheck } from "lucide-react";
import { Page, PageContainer } from "../../components/ui/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";

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
    <Page>
      <PageContainer>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Book an Appointment</h1>
          <p className="text-sm text-slate-600 mt-1">
            Choose a provider and pick an available slot.
          </p>
        </div>

        <Alert type={msg.type} msg={msg.text} />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={18} className="text-blue-700" /> Select Provider
              </CardTitle>
              <CardDescription>Pick the professional you want to meet.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {providers.map((p) => {
                  const active = selected?._id === p._id;
                  return (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => selectProvider(p)}
                      className={
                        "text-left rounded-2xl border p-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
                        (active
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 bg-white hover:bg-slate-50")
                      }
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-slate-900">{p.name}</div>
                          <div className="text-sm text-slate-600 mt-1">{p.specialty}</div>
                        </div>
                        {active && <Badge>Selected</Badge>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {selected && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={18} className="text-blue-700" /> Select Time Slot
                </CardTitle>
                <CardDescription>
                  Available slots for <span className="font-medium text-slate-900">{selected?.name}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {slotsLoad ? (
                  <Spinner />
                ) : slots.length === 0 ? (
                  <p className="text-slate-500 text-sm">No available slots for this provider.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {slots.map((s) => {
                      const active = slotId === s._id;
                      return (
                        <button
                          key={s._id}
                          type="button"
                          onClick={() => setSlotId(s._id)}
                          className={
                            "rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
                            (active
                              ? "border-blue-300 bg-blue-50"
                              : "border-slate-200 bg-white hover:bg-slate-50")
                          }
                        >
                          <div className="font-medium text-slate-900">{s.date}</div>
                          <div className="text-sm text-slate-600 mt-1">
                            {s.startTime} – {s.endTime}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {slotId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck size={18} className="text-blue-700" /> Confirm Booking
                </CardTitle>
                <CardDescription>Optional notes can help the provider prepare.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Notes (optional)</label>
                    <Textarea
                      rows={3}
                      placeholder="Any special requests..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <CalendarCheck size={16} /> Confirm Booking
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </PageContainer>
    </Page>
  );
}