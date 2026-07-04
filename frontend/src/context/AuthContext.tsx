import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../api/client";
import type { AuthResponse, User } from "../types";

interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName?: string;
}

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

const readStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const persist = (auth: AuthResponse) => {
    localStorage.setItem("token", auth.token);
    localStorage.setItem("user", JSON.stringify(auth.user));
    setUser(auth.user);
  };

  const login = useCallback(async (username: string, password: string) => {
    persist(await api.post<AuthResponse>("/api/auth/login", { username, password }));
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    persist(await api.post<AuthResponse>("/api/auth/register", data));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  // Validate the stored token on startup; drop the session if it expired
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api.get<User>("/api/auth/me").catch((err) => {
      if (err?.status === 401) logout();
    });
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: user !== null, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
