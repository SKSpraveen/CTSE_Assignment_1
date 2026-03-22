import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerProvider } from "../../api/axios";
import { Briefcase, Mail, Lock, Phone, User } from "lucide-react";
import { Alert } from "../../components/Alert";

export default function ProviderRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "", specialty: "", phone: "" });
  const [msg,  setMsg]  = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setMsg({ type: "", text: "" }); setLoading(true);
    try {
      await registerProvider(form);
      setMsg({ type: "success", text: "Registered! Await admin activation before logging in." });
      setTimeout(() => nav("/provider/login"), 3000);
    } catch (e) {
      setMsg({ type: "error", text: e.response?.data?.message || "Registration failed" });
    } finally { setLoading(false); }
  };

  const f = (field) => ({ value: form[field], onChange: e => setForm({...form, [field]: e.target.value}) });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-1">
          <Briefcase size={22} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Provider Registration</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Register as a service provider</p>
        <Alert type={msg.type} msg={msg.text} />
        <form onSubmit={submit} className="space-y-4">
          {[
            { label: "Full Name",  field: "name",      type: "text",     icon: User,      ph: "Dr. John Doe" },
            { label: "Specialty",  field: "specialty", type: "text",     icon: Briefcase, ph: "e.g. Dentist, Consultant" },
            { label: "Email",      field: "email",     type: "email",    icon: Mail,      ph: "you@email.com" },
            { label: "Password",   field: "password",  type: "password", icon: Lock,      ph: "Min 8 characters" },
            { label: "Phone",      field: "phone",     type: "tel",      icon: Phone,     ph: "0771234567" },
          ].map(({ label, field, type, icon: Icon, ph }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <div className="relative">
                <Icon size={16} className="absolute left-3 top-3 text-gray-400" />
                <input type={type} required={field !== "phone"} placeholder={ph}
                  className="w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...f(field)} />
              </div>
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium disabled:opacity-60">
            {loading ? "Registering..." : "Register as Provider"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Already registered? <Link to="/provider/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}