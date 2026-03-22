import { useEffect, useMemo, useState } from "react";
import { getMyProfile, updateMyProfile } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../../components/Spinner";
import { Alert } from "../../components/Alert";
import { Page, PageContainer } from "../../components/ui/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Mail, Phone, Save, ShieldCheck, ShieldAlert, UserRound } from "lucide-react";

export default function UserProfile() {
  const { token, role, login, user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    let active = true;
    (async () => {
      setMsg({ type: "", text: "" });
      try {
        const r = await getMyProfile();
        if (!active) return;
        setProfile(r.data);
        setForm({ name: r.data?.name || "", phone: r.data?.phone || "" });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const dirty = useMemo(() => {
    if (!profile) return false;
    const phone = profile.phone || "";
    return form.name !== (profile.name || "") || form.phone !== phone;
  }, [form.name, form.phone, profile]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
      };

      const r = await updateMyProfile(payload);
      setProfile(r.data);
      setForm({ name: r.data?.name || "", phone: r.data?.phone || "" });
      setMsg({ type: "success", text: "Profile updated." });

      if (token) {
        // Keep navbar/user context in sync without changing backend behavior.
        login(token, { ...(user || {}), ...r.data }, role || r.data?.role || "user");
      }
    } catch (e2) {
      setMsg({ type: "error", text: e2.response?.data?.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    if (!profile) return;
    setForm({ name: profile.name || "", phone: profile.phone || "" });
  };

  if (loading) return <Spinner />;

  const verified = !!profile?.isVerified;

  return (
    <Page>
      <PageContainer>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-600 mt-1">
            View and update your personal details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound size={18} className="text-blue-700" /> Account
              </CardTitle>
              <CardDescription>Your current account status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Verification</span>
                {verified ? (
                  <Badge variant="success">
                    <ShieldCheck size={14} /> Verified
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <ShieldAlert size={14} /> Pending
                  </Badge>
                )}
              </div>
              <Separator />
              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-900">{profile?.name}</div>
                <div className="text-sm text-slate-600 flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" /> {profile?.email}
                </div>
                <div className="text-sm text-slate-600 flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" /> {profile?.phone || "—"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Edit Details</CardTitle>
              <CardDescription>
                Only your name and phone number can be updated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert type={msg.type} msg={msg.text} />

              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="07XXXXXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile?.email || ""} disabled />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={reset}
                    disabled={!dirty || saving}
                  >
                    Reset
                  </Button>
                  <Button type="submit" disabled={!dirty || saving}>
                    <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </Page>
  );
}
