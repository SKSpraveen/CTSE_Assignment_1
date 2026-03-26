import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Calendar, LayoutDashboard, User, IdCard, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function Navbar() {
  const { isLoggedIn, role, user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav("/login"); };

  const dashPath = role === "admin"    ? "/admin/dashboard"
                 : role === "provider" ? "/provider/dashboard"
                 : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#020817]/85 backdrop-blur-xl">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 group-hover:bg-blue-600/30 group-hover:border-blue-400/50 transition-all duration-200">
            <Calendar size={16} />
          </span>
          <span className="font-semibold text-white tracking-tight">
            Appoint<span className="text-blue-400">Ease</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1.5">
          {isLoggedIn ? (
            <>
              <Link to={dashPath}>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-300 hover:text-white">
                  <LayoutDashboard size={15} /> Dashboard
                </Button>
              </Link>

              {role === "user" && (
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-300 hover:text-white">
                    <IdCard size={15} /> Profile
                  </Button>
                </Link>
              )}

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/8 mx-1">
                <div className="h-6 w-6 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center">
                  <User size={12} className="text-blue-300" />
                </div>
                <span className="text-sm text-slate-300 max-w-[160px] truncate">
                  {user?.name || user?.email}
                </span>
                <Badge variant="default" className="capitalize text-[10px] px-1.5 py-0">{role}</Badge>
              </div>

              <Button onClick={handleLogout} variant="outline" size="sm" className="text-slate-300">
                <LogOut size={15} /> Logout
              </Button>
            </>
          ) : (
            <>
              <a href="/#user-section">
                <Button size="sm" variant="outline" className="mx-1">User</Button>
              </a>
              <a href="/#doctor-section">
                <Button size="sm" variant="outline" className="mx-1">Doctor</Button>
              </a>
              <a href="/#admin-section">
                <Button size="sm" variant="outline" className="mx-1">Admin</Button>
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}