import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(null);
  const [role,  setRole]  = useState(null); // "user" | "admin" | "provider"
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    const r = localStorage.getItem("role");
    if (t && u) { setToken(t); setUser(JSON.parse(u)); setRole(r); }
  }, []);

  const login = (tokenVal, userData, roleVal) => {
    localStorage.setItem("token", tokenVal);
    localStorage.setItem("user",  JSON.stringify(userData));
    localStorage.setItem("role",  roleVal);
    setToken(tokenVal); setUser(userData); setRole(roleVal);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null); setUser(null); setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);