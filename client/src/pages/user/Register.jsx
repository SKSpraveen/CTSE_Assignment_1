import { createElement, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/axios";
import { UserPlus, Mail, Lock, Phone, User } from "lucide-react";
import { Alert } from "../../components/Alert";
import { Page, PageContainer } from "../../components/ui/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

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
    <Page>
      <PageContainer>
        <div className="flex items-center justify-center py-10">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">Create account</CardTitle>
              <CardDescription>Register to book appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert type={msg.type} msg={msg.text} />
              <form onSubmit={submit} className="space-y-4">
                {[
                  { label: "Full Name", field: "name", type: "text", icon: User, ph: "John Doe" },
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
                  <UserPlus size={16} /> {loading ? "Registering..." : "Register"}
                </Button>
              </form>

              <p className="text-sm text-center text-slate-600 mt-5">
                Have an account?{" "}
                <Link to="/login" className="text-blue-700 hover:underline">
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