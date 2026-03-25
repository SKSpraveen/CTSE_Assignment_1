import { useState as useS } from "react";
import { useNavigate as useNav2, Link as RLink2 } from "react-router-dom";
import { useAuth as useA2 } from "../../context/AuthContext";
import { loginUser } from "../../api/axios";
import { LogIn, Mail as MailIcon, Lock as LockIcon } from "lucide-react";
import { Alert as A2 } from "../../components/Alert";
import { Page as P2, PageContainer as PC2 } from "../../components/ui/page";
import { Card as C2, CardContent as CC2, CardDescription as CD2, CardHeader as CH2, CardTitle as CT2 } from "../../components/ui/card";
import { Button as B2 } from "../../components/ui/button";
import { Input as I2 } from "../../components/ui/input";
import { Label as L2 } from "../../components/ui/label";
 
export function UserLogin() {
  const [form, setForm] = useS({ email: "", password: "" });
  const [err,  setErr]  = useS("");
  const [loading, setLoading] = useS(false);
  const { login } = useA2();
  const nav = useNav2();
 
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
    <P2>
      <PC2>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md animate-fade-up">
            <div className="absolute -z-10 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
 
            <C2 className="border-white/10 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_20px_60px_rgba(0,0,0,0.6)]">
              <CH2 className="pb-6">
                <CT2 className="text-xl">Welcome back</CT2>
                <CD2>Sign in to your account</CD2>
              </CH2>
              <CC2>
                <A2 type="error" msg={err} />
                <form onSubmit={submit} className="space-y-5">
                  <div className="space-y-1.5">
                    <L2 htmlFor="email">Email</L2>
                    <div className="relative">
                      <MailIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      <I2 id="email" type="email" required placeholder="you@email.com" className="pl-9"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <L2 htmlFor="password">Password</L2>
                    <div className="relative">
                      <LockIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      <I2 id="password" type="password" required placeholder="••••••••" className="pl-9"
                        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    </div>
                  </div>
                  <B2 type="submit" disabled={loading} className="w-full h-11 mt-2">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Signing in...
                      </span>
                    ) : <><LogIn size={15} /> Sign In</>}
                  </B2>
                </form>
                <p className="text-sm text-center text-slate-500 mt-6">
                  No account?{" "}
                  <RLink2 to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Register</RLink2>
                </p>
              </CC2>
            </C2>
          </div>
        </div>
      </PC2>
    </P2>
  );
}
export default UserLogin;