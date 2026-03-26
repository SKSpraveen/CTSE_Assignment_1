import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";


import UserLogin        from "./pages/user/Login";
import UserRegister     from "./pages/user/Register";
import UserDashboard    from "./pages/user/Dashboard";
import BookAppointment  from "./pages/user/BookAppointment";
import UserProfile      from "./pages/user/Profile";

import AdminLogin       from "./pages/admin/Login";
import AdminDashboard   from "./pages/admin/Dashboard";

import ProviderLogin    from "./pages/provider/Login";
import ProviderRegister from "./pages/provider/Register";
import ProviderDashboard from "./pages/provider/Dashboard";

import ProtectedRoute   from "./components/ProtectedRoute";
import Navbar           from "./components/Navbar";
import Footer           from "./components/Footer";
import LaunchPage       from "./pages/LaunchPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Launch page as root */}
              <Route path="/" element={<LaunchPage />} />
              <Route path="/login"              element={<UserLogin />} />
              <Route path="/register"           element={<UserRegister />} />
              <Route path="/admin/login"        element={<AdminLogin />} />
              <Route path="/provider/login"     element={<ProviderLogin />} />
              <Route path="/provider/register"  element={<ProviderRegister />} />

              {/* User protected */}
              <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                <Route path="/dashboard"        element={<UserDashboard />} />
                <Route path="/book"             element={<BookAppointment />} />
                <Route path="/profile"          element={<UserProfile />} />
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
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}