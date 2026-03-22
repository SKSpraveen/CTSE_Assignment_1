import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import UserLogin        from "./pages/user/Login";
import UserRegister     from "./pages/user/Register";
import UserDashboard    from "./pages/user/Dashboard";
import BookAppointment  from "./pages/user/BookAppointment";

import AdminLogin       from "./pages/admin/Login";
import AdminDashboard   from "./pages/admin/Dashboard";

import ProviderLogin    from "./pages/provider/Login";
import ProviderRegister from "./pages/provider/Register";
import ProviderDashboard from "./pages/provider/Dashboard";

import ProtectedRoute   from "./components/ProtectedRoute";
import Navbar           from "./components/Navbar";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/"                   element={<Navigate to="/login" />} />
          <Route path="/login"              element={<UserLogin />} />
          <Route path="/register"           element={<UserRegister />} />
          <Route path="/admin/login"        element={<AdminLogin />} />
          <Route path="/provider/login"     element={<ProviderLogin />} />
          <Route path="/provider/register"  element={<ProviderRegister />} />

          {/* User protected */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/dashboard"        element={<UserDashboard />} />
            <Route path="/book"             element={<BookAppointment />} />
          </Route>

          {/* Admin protected */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard"  element={<AdminDashboard />} />
          </Route>

          {/* Provider protected */}
          <Route element={<ProtectedRoute allowedRoles={["provider"]} />}>
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}