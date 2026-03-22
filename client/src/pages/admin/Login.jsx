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
    <Page>
      <PageContainer>
        <div className="flex items-center justify-center py-10">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                  <ShieldCheck size={18} />
                </span>
                Admin Portal
              </CardTitle>
              <CardDescription>Sign in with admin credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert type="error" msg={err} />

              <form onSubmit={submit} className="space-y-4">
                {[
                  { label: "Email", field: "email", type: "email", icon: Mail, ph: "admin@email.com" },
                  { label: "Password", field: "password", type: "password", icon: Lock, ph: "••••••••" },
                ].map(({ label, field, type, icon: Icon, ph }) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{label}</Label>
                    <div className="relative">
                      {createElement(Icon, {
                        size: 16,
                        className: "absolute left-3 top-3 text-slate-400",
                      })}
                      <Input
                        id={field}
                        type={type}
                        required
                        placeholder={ph}
                        className="pl-9"
                        value={form[field]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      />
                    </div>
                  </div>
                ))}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Signing in..." : "Sign In as Admin"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </Page>
  );
}