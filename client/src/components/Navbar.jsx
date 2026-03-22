import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Calendar, LayoutDashboard, User } from "lucide-react";

export default function Navbar() {
  const { isLoggedIn, role, user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav("/login"); };

  const dashPath = role === "admin" ? "/admin/dashboard"
                 : role === "provider" ? "/provider/dashboard"
                 : "/dashboard";

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg">
        <Calendar size={22} /> AppointEase
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {isLoggedIn ? (
          <>
            <Link to={dashPath} className="flex items-center gap-1 hover:text-blue-200">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <span className="flex items-center gap-1 text-blue-200">
              <User size={16} /> {user?.name || user?.email}
              <span className="ml-1 bg-blue-500 px-2 py-0.5 rounded-full text-xs capitalize">{role}</span>
            </span>
            <button onClick={handleLogout}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg">
              <LogOut size={15} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"           className="hover:text-blue-200">User Login</Link>
            <Link to="/admin/login"     className="hover:text-blue-200">Admin</Link>
            <Link to="/provider/login"  className="hover:text-blue-200">Provider</Link>
          </>
        )}
      </div>
    </nav>
  );
}