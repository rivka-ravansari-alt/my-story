import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getStoredUser().then((stored) => {
      setUser(stored);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await authService.login(username, password);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const data = await authService.register(username, email, password);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
