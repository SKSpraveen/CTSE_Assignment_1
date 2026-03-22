import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn)               return <Navigate to="/login"    replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;
  return <Outlet />;
}