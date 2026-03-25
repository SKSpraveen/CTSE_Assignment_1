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
import { Label } from "../../components/ui/label";
 
export function BookAppointment() {
  const [providers, setProviders]  = useState([]);
  const [selected,  setSelected]   = useState(null);
  const [slots,     setSlots]      = useState([]);
  const [slotId,    setSlotId]     = useState("");
  const [notes,     setNotes]      = useState("");
  const [loading,   setLoading]    = useState(true);
  const [slotsLoad, setSlotsLoad]  = useState(false);
  const [msg,       setMsg]        = useState({ type: "", text: "" });
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
        <div className="mb-8 animate-fade-up">
          <p className="text-xs text-blue-400 font-mono uppercase tracking-widest mb-1">New Booking</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Book an Appointment</h1>
          <p className="text-sm text-slate-400 mt-1">Choose a provider and pick an available slot.</p>
        </div>
 
        <Alert type={msg.type} msg={msg.text} />
 
        <div className="space-y-5">
          {/* Select Provider */}
          <Card className="animate-fade-up-delay-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={16} className="text-blue-400" /> Select Provider
              </CardTitle>
              <CardDescription>Pick the professional you want to meet.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {providers.map((p) => {
                  const active = selected?._id === p._id;
                  return (
                    <button
                      key={p._id} type="button"
                      onClick={() => selectProvider(p)}
                      className={
                        "text-left rounded-xl border p-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
                        (active
                          ? "border-blue-500/40 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]"
                          : "border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15")
                      }
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-white text-sm">{p.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{p.specialty}</div>
                        </div>
                        {active && <Badge variant="default" className="shrink-0">Selected</Badge>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
 
          {/* Select Slot */}
          {selected && (
            <Card className="animate-fade-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-400" /> Select Time Slot
                </CardTitle>
                <CardDescription>
                  Available slots for <span className="text-white font-medium">{selected?.name}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {slotsLoad ? (
                  <Spinner />
                ) : slots.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
                    No available slots for this provider.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {slots.map((s) => {
                      const active = slotId === s._id;
                      return (
                        <button
                          key={s._id} type="button"
                          onClick={() => setSlotId(s._id)}
                          className={
                            "rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
                            (active
                              ? "border-blue-500/40 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]"
                              : "border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15")
                          }
                        >
                          <div className="font-medium text-white text-sm font-mono">{s.date}</div>
                          <div className="text-xs text-slate-400 mt-0.5 font-mono">{s.startTime} – {s.endTime}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
 
          {/* Confirm */}
          {slotId && (
            <Card className="animate-fade-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck size={16} className="text-blue-400" /> Confirm Booking
                </CardTitle>
                <CardDescription>Optional notes can help the provider prepare.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Notes (optional)</Label>
                    <Textarea rows={3} placeholder="Any special requests..."
                      value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full h-11">
                    <CalendarCheck size={15} /> Confirm Booking
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
 
export default BookAppointment;