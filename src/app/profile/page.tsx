"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Settings, Shield, FileText, HelpCircle, ChevronRight, LogOut, 
  Lock, Bell, Moon, Sun, ChevronDown, ChevronUp, Phone, Camera,
  Check, X, AlertCircle, Clock, BookOpen
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import BottomNav from "@/components/BottomNav";

interface OperationLog {
  id: number;
  action: string;
  time: string;
  status: "success" | "failed";
}

interface FAQ {
  question: string;
  answer: string;
}

const defaultLogs: OperationLog[] = [
  { id: 1, action: "登录系统", time: "2026-05-29 09:15:23", status: "success" },
  { id: 2, action: "查看项目概况", time: "2026-05-29 09:16:45", status: "success" },
  { id: 3, action: "查看通讯录", time: "2026-05-29 09:20:11", status: "success" },
  { id: 4, action: "修改个人信息", time: "2026-05-28 14:30:22", status: "success" },
  { id: 5, action: "导出进度报告", time: "2026-05-28 16:45:08", status: "success" },
  { id: 6, action: "查看资金台账", time: "2026-05-27 10:12:35", status: "success" },
  { id: 7, action: "登录系统", time: "2026-05-27 08:30:00", status: "success" },
];

const faqs: FAQ[] = [
  { question: "如何修改登录密码？", answer: "进入「我的」→「安全中心」→「修改密码」，输入原密码和新密码后确认修改。" },
  { question: "如何查看操作日志？", answer: "进入「我的」→「操作日志」，可以查看近期的登录记录和操作历史。" },
  { question: "如何联系技术支持？", answer: "您可以通过「帮助中心」查看常见问题，或拨打技术支持热线：010-12345678。" },
  { question: "如何更新个人信息？", answer: "进入「我的」→「个人信息」，点击编辑按钮修改您的个人资料。" },
  { question: "系统有哪些通知设置？", answer: "进入「系统设置」，可以开启或关闭消息通知、声音提醒等功能。" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { userInfo, logout, isAdmin } = useAdmin();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [localAvatar, setLocalAvatar] = useState<string>("");
  const [userProfile, setUserProfile] = useState({
    name: "管理员",
    role: "系统管理员",
    email: "admin@erdaohe.gov.cn",
    phone: "138****1234",
    department: "房山区水务局",
  });
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    darkMode: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setUserProfile(parsed);
      if (parsed.localAvatar) {
        setLocalAvatar(parsed.localAvatar);
      }
    }
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const toggleItem = (item: string) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  const saveProfile = () => {
    const profileToSave = {
      ...userProfile,
      localAvatar: localAvatar
    };
    localStorage.setItem("userProfile", JSON.stringify(profileToSave));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  };

  const changePassword = () => {
    if (passwordForm.oldPassword === "") {
      setPasswordError("请输入原密码");
      return;
    }
    if (passwordForm.newPassword === "") {
      setPasswordError("请输入新密码");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("新密码长度至少6位");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("两次输入的密码不一致");
      return;
    }
    setPasswordError("");
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }, 2000);
  };

  const menuItems = [
    { 
      icon: User, 
      label: "个人信息", 
      desc: "查看和编辑个人资料",
      key: "profile"
    },
    { 
      icon: Settings, 
      label: "系统设置", 
      desc: "应用偏好设置",
      key: "settings"
    },
    { 
      icon: Shield, 
      label: "安全中心", 
      desc: "密码修改、账号安全",
      key: "security"
    },
    { 
      icon: FileText, 
      label: "操作日志", 
      desc: "查看操作记录",
      key: "logs"
    },
    { 
      icon: HelpCircle, 
      label: "帮助中心", 
      desc: "使用指南、常见问题",
      key: "help"
    },
  ];

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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* User Info Card */}
        <div className="bg-card rounded-2xl p-5">
          <div className="flex items-center gap-4">
            {localAvatar ? (
              <img 
                src={localAvatar} 
                alt="头像" 
                className="w-16 h-16 rounded-2xl object-cover"
              />
            ) : userInfo?.avatar ? (
              <img 
                src={userInfo.avatar} 
                alt="头像" 
                className="w-16 h-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{userInfo?.username || userProfile.name}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{userProfile.role}</p>
              <p className="text-xs text-secondary-foreground mt-1">{userProfile.email}</p>
            </div>
          </div>
        </div>

        {/* Admin Management Card - Only visible to admin */}
        {isAdmin && (
          <button
            onClick={() => router.push("/admin")}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-5 flex items-center gap-4 shadow-lg"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-base font-semibold text-white">后台管理</h3>
              <p className="text-xs text-white/70 mt-0.5">管理项目概述、工作简报等核心内容</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70" />
          </button>
        )}

        {/* Menu Items with Expandable Content */}
        {menuItems.map((item) => (
          <div key={item.key}>
            <button
              onClick={() => toggleItem(item.key)}
              className="w-full bg-card rounded-xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-input rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm text-foreground font-medium">{item.label}</h3>
                <p className="text-xs text-secondary-foreground mt-0.5">{item.desc}</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedItem === item.key ? 'rotate-180' : ''}`} />
            </button>

            {/* Expanded Content */}
            {expandedItem === item.key && (
              <div className="bg-card rounded-xl mt-2 p-4 space-y-3">
                {/* Profile Content */}
                {item.key === "profile" && (
                  <>
                    <div className="flex justify-center">
                      <div className="relative">
                        {localAvatar ? (
                          <img src={localAvatar} alt="头像" className="w-16 h-16 rounded-full object-cover" />
                        ) : userInfo?.avatar ? (
                          <img src={userInfo.avatar} alt="头像" className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer">
                          <Camera className="w-3 h-3 text-white" />
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">姓名</label>
                        <input
                          type="text"
                          value={userProfile.name}
                          onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                          className="w-full mt-1 px-3 py-2 bg-input rounded-lg border border-border text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">职位</label>
                        <input
                          type="text"
                          value={userProfile.role}
                          onChange={(e) => setUserProfile({...userProfile, role: e.target.value})}
                          className="w-full mt-1 px-3 py-2 bg-input rounded-lg border border-border text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">邮箱</label>
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                          className="w-full mt-1 px-3 py-2 bg-input rounded-lg border border-border text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">电话</label>
                        <input
                          type="text"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                          className="w-full mt-1 px-3 py-2 bg-input rounded-lg border border-border text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">部门</label>
                        <input
                          type="text"
                          value={userProfile.department}
                          onChange={(e) => setUserProfile({...userProfile, department: e.target.value})}
                          className="w-full mt-1 px-3 py-2 bg-input rounded-lg border border-border text-sm"
                        />
                      </div>
                    </div>
                    <button
                      onClick={saveProfile}
                      className="w-full h-10 bg-primary rounded-lg text-white text-sm font-medium"
                    >
                      保存修改
                    </button>
                  </>
                )}

                {/* Settings Content */}
                {item.key === "settings" && (
                  <>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">消息通知</p>
                          <p className="text-xs text-muted-foreground">接收系统推送通知</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                        className={`w-10 h-5 rounded-full transition-colors ${settings.notifications ? 'bg-primary' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${settings.notifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">声音提醒</p>
                          <p className="text-xs text-muted-foreground">接收操作提示音</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, sound: !settings.sound})}
                        className={`w-10 h-5 rounded-full transition-colors ${settings.sound ? 'bg-primary' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${settings.sound ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        {settings.darkMode ? (
                          <Moon className="w-5 h-5 text-primary" />
                        ) : (
                          <Sun className="w-5 h-5 text-primary" />
                        )}
                        <div>
                          <p className="text-sm font-medium">深色模式</p>
                          <p className="text-xs text-muted-foreground">切换深色/浅色主题</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, darkMode: !settings.darkMode})}
                        className={`w-10 h-5 rounded-full transition-colors ${settings.darkMode ? 'bg-primary' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${settings.darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <button
                      onClick={saveSettings}
                      className="w-full h-10 bg-primary rounded-lg text-white text-sm font-medium"
                    >
                      保存设置
                    </button>
                  </>
                )}

                {/* Security Content */}
                {item.key === "security" && (
                  <>
                    {passwordSuccess ? (
                      <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center">
                        <Check className="w-10 h-10 text-green-500 mb-2" />
                        <p className="text-green-600 text-sm font-medium">密码修改成功</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-muted-foreground">原密码</label>
                          <input
                            type="password"
                            value={passwordForm.oldPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                            placeholder="请输入原密码"
                            className="w-full mt-1 px-3 py-2 bg-input rounded-lg border border-border text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">新密码</label>
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            placeholder="请输入新密码"
                            className="w-full mt-1 px-3 py-2 bg-input rounded-lg border border-border text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">确认新密码</label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            placeholder="请再次输入新密码"
                            className="w-full mt-1 px-3 py-2 bg-input rounded-lg border border-border text-sm"
                          />
                        </div>
                      </div>
                    )}
                    {passwordError && (
                      <div className="bg-red-50 rounded-lg p-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-xs text-red-600">{passwordError}</p>
                      </div>
                    )}
                    {!passwordSuccess && (
                      <button
                        onClick={changePassword}
                        className="w-full h-10 bg-primary rounded-lg text-white text-sm font-medium"
                      >
                        修改密码
                      </button>
                    )}
                    <div className="flex items-center justify-between py-2 border-t">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        <span className="text-sm">两步验证</span>
                      </div>
                      <span className="text-xs text-muted-foreground">未开启</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-sm">登录设备管理</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </>
                )}

                {/* Logs Content */}
                {item.key === "logs" && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {defaultLogs.map((log) => (
                      <div key={log.id} className="flex items-center gap-3 py-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${log.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {log.status === 'success' ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${log.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {log.status === 'success' ? '成功' : '失败'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Help Content */}
                {item.key === "help" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-sm">使用手册</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-sm">客服热线</span>
                      </div>
                      <span className="text-xs text-muted-foreground">010-12345678</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-xs text-muted-foreground mb-2">常见问题</p>
                      {faqs.map((faq, index) => (
                        <div key={index} className="border rounded-lg mb-1">
                          <button
                            onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                            className="w-full p-2 flex items-center justify-between text-left"
                          >
                            <span className="text-xs flex-1 pr-2">{faq.question}</span>
                            {expandedFAQ === index ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>
                          {expandedFAQ === index && (
                            <div className="px-2 pb-2">
                              <p className="text-xs text-muted-foreground">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full h-12 bg-danger/10 rounded-xl flex items-center justify-center gap-2 mb-4"
        >
          <LogOut className="w-5 h-5 text-danger" />
          <span className="text-danger font-medium">退出登录</span>
        </button>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">版本 V2.1.0</p>
          <p className="text-[11px] text-secondary-foreground mt-1">
            © 2026 房山水务局
          </p>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
