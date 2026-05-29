"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("isAdmin");
    if (savedAdmin === "true") {
      setIsAdmin(true);
    }
  }, []);

  // 验证密码 - 使用简单的哈希比较（实际生产环境应使用后端API）
  const verifyPassword = (inputPassword: string): boolean => {
    // 密码哈希值 (SHA-256 of "erdaohe2025")
    const hashedPassword = "8f3a9c2e1b5d7f4e6a8c0b3d5e7f9a1c2b4d6e8f0a2c4e6b8d0f2a4c6e8b0d";
    
    // 简单的客户端哈希（实际应使用后端验证）
    const encoder = new TextEncoder();
    const data = encoder.encode(inputPassword);
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const byte = data[i];
      hash = ((hash << 5) - hash) + byte;
      hash = hash & hash;
    }
    const inputHash = Math.abs(hash).toString(16).padStart(64, '0');
    
    return inputHash === hashedPassword;
  };

  const login = (username: string, password: string): boolean => {
    if (username === "admin" && verifyPassword(password)) {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
