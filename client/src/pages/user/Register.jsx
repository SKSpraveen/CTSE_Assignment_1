import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/axios";
import { UserPlus, Mail, Lock, Phone, User } from "lucide-react";
import { Alert } from "../../components/Alert";

export default function UserRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [msg,  setMsg]  = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setMsg({ type: "", text: "" }); setLoading(true);
    try {
      await registerUser(form);
      setMsg({ type: "success", text: "Registered! Please wait for admin verification before logging in." });
      setTimeout(() => nav("/login"), 3000);
    } catch (e) {
      setMsg({ type: "error", text: e.response?.data?.message || "Registration failed" });
    } finally { setLoading(false); }
  };

  const f = (field) => ({ value: form[field], onChange: e => setForm({...form, [field]: e.target.value}) });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create account</h1>
        <p className="text-gray-500 text-sm mb-6">Register to book appointments</p>
        <Alert type={msg.type} msg={msg.text} />
        <form onSubmit={submit} className="space-y-4">
          {[
            { label: "Full Name",  field: "name",     type: "text",     icon: User,  ph: "John Doe" },
            { label: "Email",      field: "email",    type: "email",    icon: Mail,  ph: "you@email.com" },
            { label: "Password",   field: "password", type: "password", icon: Lock,  ph: "Min 8 characters" },
            { label: "Phone",      field: "phone",    type: "tel",      icon: Phone, ph: "0771234567" },
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60">
            <UserPlus size={16} /> {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}