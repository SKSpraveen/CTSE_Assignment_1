import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginProvider } from "../../api/axios";
import { Briefcase, Mail, Lock } from "lucide-react";
import { Alert } from "../../components/Alert";

export default function ProviderLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err,  setErr]  = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setLoading(true);
    try {
      const { data } = await loginProvider(form);
      login(data.token, data.provider, "provider");
      nav("/provider/dashboard");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-1">
          <Briefcase size={22} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Provider Login</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Sign in to your provider account</p>
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Not registered? <Link to="/provider/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}