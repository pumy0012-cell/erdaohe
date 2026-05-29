"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Status Bar */}
      <div className="status-bar-height flex items-center justify-between px-4 bg-background">
        <span className="text-foreground font-semibold text-[15px]">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="w-[18px] h-3 bg-foreground rounded-sm" />
          <div className="w-4 h-3 bg-foreground rounded-sm" />
          <div className="w-6 h-3 bg-green-500 rounded-[3px]" />
        </div>
      </div>

      {/* Login Content */}
      <div className="flex-1 flex flex-col px-6 pt-10 pb-6">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-[20px] flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-1">二道河水库</h1>
            <p className="text-[15px] text-muted-foreground">移民安置信息管理系统</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Username Input */}
          <div className="h-14 bg-input rounded-xl flex items-center px-4 gap-3 border border-border">
            <User className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 bg-transparent text-foreground text-[15px] placeholder:text-muted-foreground outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="h-14 bg-input rounded-xl flex items-center px-4 gap-3 border border-border">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-foreground text-[15px] placeholder:text-muted-foreground outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between h-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-[18px] h-[18px] rounded flex items-center justify-center ${
                  rememberMe ? "bg-primary" : "bg-input border border-border"
                }`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && <div className="w-2 h-2 bg-white rounded-sm" />}
              </div>
              <span className="text-[13px] text-secondary-foreground">记住密码</span>
            </label>
            <button type="button" className="text-[13px] text-primary">
              忘记密码？
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="h-[52px] bg-primary rounded-xl flex items-center justify-center text-white text-[17px] font-semibold mt-2"
          >
            登 录
          </button>
        </form>

        {/* Version Info */}
        <div className="mt-auto flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground">版本 V2.1.0</span>
          <span className="text-[11px] text-muted-foreground">© 2026 房山水务局</span>
        </div>
      </div>
    </div>
  );
}
