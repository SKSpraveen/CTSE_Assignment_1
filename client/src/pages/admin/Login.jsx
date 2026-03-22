import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginAdmin } from "../../api/axios";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { Alert } from "../../components/Alert";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err,  setErr]  = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setLoading(true);
    try {
      const { data } = await loginAdmin(form);
      login(data.token, data.admin, "admin");
      nav("/admin/dashboard");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={24} className="text-blue-700" />
          <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Sign in with admin credentials</p>
        <Alert type="error" msg={err} />
        <form onSubmit={submit} className="space-y-4">
          {[
            { label: "Email",    field: "email",    type: "email",    icon: Mail },
            { label: "Password", field: "password", type: "password", icon: Lock },
          ].map(({ label, field, type, icon: Icon }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <div className="relative">
                <Icon size={16} className="absolute left-3 top-3 text-gray-400" />
                <input type={type} required
                  className="w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} />
              </div>
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}