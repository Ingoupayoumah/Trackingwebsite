import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../api/client";

type Role = "admin" | "entreprise";

interface AuthState {
  token: string;
  role: Role;
  id: string;
  nom?: string;
}

interface AuthContextValue {
  auth: AuthState | null;
  login: (email: string, password: string) => Promise<AuthState>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const raw = localStorage.getItem("auth_state");
    return raw ? JSON.parse(raw) : null;
  });

  async function login(email: string, password: string) {
    const { data } = await api.post<AuthState>("/auth/login", { email, password });
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_state", JSON.stringify(data));
    setAuth(data);
    return data;
  }

  function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_state");
    setAuth(null);
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}
