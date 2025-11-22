import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Admin } from "@shared/schema";

interface AuthContextType {
  admin: Admin | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error("Failed to parse stored admin:", error);
        localStorage.removeItem("admin");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const admin = await response.json();
    setAdmin(admin);

    if (rememberMe) {
      localStorage.setItem("admin", JSON.stringify(admin));
    } else {
      sessionStorage.setItem("admin", JSON.stringify(admin));
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    sessionStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
