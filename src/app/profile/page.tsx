"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, Shield, FileText, HelpCircle, ChevronRight, LogOut, Lock } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const menuItems = [
  { icon: User, label: "个人信息", desc: "查看和编辑个人资料" },
  { icon: Settings, label: "系统设置", desc: "应用偏好设置" },
  { icon: Shield, label: "安全中心", desc: "密码修改、账号安全" },
  { icon: FileText, label: "操作日志", desc: "查看操作记录" },
  { icon: HelpCircle, label: "帮助中心", desc: "使用指南、常见问题" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    setIsAdmin(adminLoggedIn === "true");
  }, []);

  const handleLogout = () => {
    router.push("/");
  };

  const goToAdmin = () => {
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Status Bar */}
      <div className="status-bar-height flex items-center justify-between px-4 bg-background">
        <span className="text-foreground font-semibold text-[15px]">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="w-[18px] h-3 bg-foreground rounded-sm" />
          <div className="w-4 h-3 bg-foreground rounded-sm" />
          <div className="w-6 h-3 bg-green-500 rounded-[3px]" />
        </div>
      </div>

      {/* Header */}
      <div className="h-14 flex items-center justify-center px-4 bg-background">
        <h1 className="text-lg font-semibold text-foreground">我的</h1>
      </div>

      {/* User Info Card */}
      <div className="px-4 py-4">
        <div className="bg-card rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">管理员</h2>
              <p className="text-sm text-muted-foreground mt-0.5">系统管理员</p>
              <p className="text-xs text-secondary-foreground mt-1">admin@erdaohe.gov.cn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 px-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-full bg-card rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-input rounded-xl flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-sm text-foreground font-medium">{item.label}</h3>
              <p className="text-xs text-secondary-foreground mt-0.5">{item.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-secondary-foreground" />
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div className="px-4 py-4">
        <button
          onClick={handleLogout}
          className="w-full h-12 bg-danger/10 rounded-xl flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5 text-danger" />
          <span className="text-danger font-medium">退出登录</span>
        </button>
      </div>

      {/* App Info */}
      <div className="text-center pb-4">
        <p className="text-xs text-muted-foreground">版本 V2.1.0</p>
        <p className="text-[11px] text-secondary-foreground mt-1">
          © 2026 房山水务局
        </p>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
