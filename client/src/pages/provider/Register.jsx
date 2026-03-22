import { createElement, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerProvider } from "../../api/axios";
import { Briefcase, Mail, Lock, Phone, User } from "lucide-react";
import { Alert } from "../../components/Alert";
import { Page, PageContainer } from "../../components/ui/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

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
    <Page>
      <PageContainer>
        <div className="flex items-center justify-center py-10">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                  <Briefcase size={18} />
                </span>
                Provider Registration
              </CardTitle>
              <CardDescription>Register as a service provider</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert type={msg.type} msg={msg.text} />
              <form onSubmit={submit} className="space-y-4">
                {[
                  { label: "Full Name", field: "name", type: "text", icon: User, ph: "Dr. John Doe" },
                  {
                    label: "Specialty",
                    field: "specialty",
                    type: "text",
                    icon: Briefcase,
                    ph: "e.g. Dentist, Consultant",
                  },
                  { label: "Email", field: "email", type: "email", icon: Mail, ph: "you@email.com" },
                  {
                    label: "Password",
                    field: "password",
                    type: "password",
                    icon: Lock,
                    ph: "Min 8 characters",
                  },
                  { label: "Phone", field: "phone", type: "tel", icon: Phone, ph: "0771234567" },
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
                        required={field !== "phone"}
                        placeholder={ph}
                        className="pl-9"
                        {...f(field)}
                      />
                    </div>
                  </div>
                ))}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Registering..." : "Register as Provider"}
                </Button>
              </form>
              <p className="text-sm text-center text-slate-600 mt-5">
                Already registered?{" "}
                <Link to="/provider/login" className="text-blue-700 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </Page>
  );
}