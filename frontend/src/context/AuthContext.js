import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getStoredSession().then((session) => {
      setUser(session?.user || null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const clearUser = () => {
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", clearUser);
    return () => window.removeEventListener("auth:unauthorized", clearUser);
  }, []);

  const loginWithGoogle = useCallback(async (idToken) => {
    const data = await authService.loginWithGoogle(idToken);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
