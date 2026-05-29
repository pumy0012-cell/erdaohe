"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, Users, FolderOpen, Map, User } from "lucide-react";

const navItems = [
  { id: "home", label: "首页", icon: Home, path: "/dashboard" },
  { id: "contacts", label: "通讯录", icon: Users, path: "/work" },
  { id: "archives", label: "档案", icon: FolderOpen, path: "/archives" },
  { id: "map", label: "地图", icon: Map, path: "/map" },
  { id: "profile", label: "我的", icon: User, path: "/profile" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom">
      <div className="max-w-md mx-auto h-20 flex items-start justify-around pt-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1.5 w-14"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isActive ? "bg-primary" : "bg-secondary"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-muted-foreground"}`} />
              </div>
              <span className={`text-[11px] ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
