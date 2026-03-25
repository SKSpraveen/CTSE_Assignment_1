import { createElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginAdmin } from "../../api/axios";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { Alert } from "../../components/Alert";
import { Page, PageContainer } from "../../components/ui/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function AdminLogin() {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [err,  setErr]      = useState("");
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
    <Page>
      <PageContainer>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md animate-fade-up">
            {/* Glow accent */}
            <div className="absolute -z-10 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />

            <Card className="border-white/10 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_20px_60px_rgba(0,0,0,0.6)]">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Admin Portal</CardTitle>
                    <CardDescription>Sign in with admin credentials</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Alert type="error" msg={err} />

                <form onSubmit={submit} className="space-y-5">
                  {[
                    { label: "Email",    field: "email",    type: "email",    icon: Mail, ph: "admin@email.com" },
                    { label: "Password", field: "password", type: "password", icon: Lock, ph: "••••••••" },
                  ].map(({ label, field, type, icon: Icon, ph }) => (
                    <div key={field} className="space-y-1.5">
                      <Label htmlFor={field}>{label}</Label>
                      <div className="relative">
                        {createElement(Icon, { size: 15, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" })}
                        <Input
                          id={field} type={type} required placeholder={ph}
                          className="pl-9"
                          value={form[field]}
                          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        />
                      </div>
                    </div>
                  ))}

                  <Button type="submit" disabled={loading} className="w-full mt-2 h-11">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Signing in...
                      </span>
                    ) : "Sign In as Admin"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </Page>
  );
}