import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/axios";
import { LogIn, Mail, Lock } from "lucide-react";
import { Alert } from "../../components/Alert";

export default function UserLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err,  setErr]  = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.token, data.user, data.user.role);
      nav("/dashboard");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>
        <Alert type="error" msg={err} />
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
              <input type="email" required placeholder="you@email.com"
                className="w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input type="password" required placeholder="••••••••"
                className="w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60">
            <LogIn size={16} /> {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          No account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}