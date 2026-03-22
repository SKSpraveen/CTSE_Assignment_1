import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Calendar, LayoutDashboard, User, IdCard, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function Navbar() {
  const { isLoggedIn, role, user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav("/login"); };

  const dashPath = role === "admin" ? "/admin/dashboard"
                 : role === "provider" ? "/provider/dashboard"
                 : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
            <Calendar size={18} />
          </span>
          <span className="font-semibold text-slate-900">AppointEase</span>
        </Link>

        <nav className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link to={dashPath}>
                <Button variant="ghost" className="hidden sm:inline-flex">
                  <LayoutDashboard size={16} /> Dashboard
                </Button>
              </Link>
              {role === "user" && (
                <Link to="/profile">
                  <Button variant="ghost" className="hidden sm:inline-flex">
                    <IdCard size={16} /> Profile
                  </Button>
                </Link>
              )}

              <div className="hidden md:flex items-center gap-2 px-2">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  <span className="max-w-[220px] truncate">{user?.name || user?.email}</span>
                </span>
                <Badge variant="neutral" className="capitalize">{role}</Badge>
              </div>

              <Button onClick={handleLogout} variant="outline" className="border-slate-200">
                <LogOut size={16} /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:inline-flex">User</Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Admin</Button>
              </Link>
              <Link to="/provider/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Provider</Button>
              </Link>
              <Link to="/login">
                <Button>
                  <LogIn size={16} /> Sign in
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}