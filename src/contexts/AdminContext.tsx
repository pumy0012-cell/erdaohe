"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserInfo {
  username: string;
  avatar?: string;
}

interface AdminContextType {
  isAdmin: boolean;
  userInfo: UserInfo | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("isAdmin");
    const savedUser = localStorage.getItem("userInfo");
    if (savedAdmin === "true") {
      setIsAdmin(true);
      if (savedUser) {
        setUserInfo(JSON.parse(savedUser));
      }
    }
  }, []);

  const verifyPassword = (inputPassword: string): boolean => {
    return inputPassword === "";
  };

  const login = (username: string, password: string): boolean => {
    if (username === "admin" && password === "") {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      
      const newUserInfo: UserInfo = {
        username,
        avatar: `https://ui-avatars.com/api/?name=${username}&background=2c4a6e&color=fff`,
      };
      setUserInfo(newUserInfo);
      localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setUserInfo(null);
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userInfo");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, userInfo, login, logout }}>
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
