"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Plus, Upload, Download, Eye, Edit, RefreshCw, ArrowLeft } from "lucide-react";

const progressData = [
  { name: "幸福新村安置房建设", type: "安置点建设", project: "幸福新村", planStart: "2026-01-01", planEnd: "2026-06-30", actual: 75, status: "进行中", owner: "王工" },
  { name: "张三户搬迁安置", type: "移民搬迁", project: "张三户", planStart: "2026-02-01", planEnd: "2026-03-15", actual: 100, status: "已完成", owner: "李经理" },
  { name: "主干道硬化工程", type: "基础设施", project: "主干道", planStart: "2026-01-15", planEnd: "2026-04-30", actual: 45, status: "进行中", owner: "张工" },
  { name: "李四户生产安置", type: "生产安置", project: "李四户", planStart: "2026-03-01", planEnd: "2026-05-31", actual: 0, status: "未开始", owner: "赵主任" },
  { name: "供水管网铺设", type: "基础设施", project: "供水工程", planStart: "2026-02-15", planEnd: "2026-05-15", actual: 30, status: "延期", owner: "刘工" },
];

export default function ProgressPage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成": return "text-accent";
      case "进行中": return "text-primary";
      case "延期": return "text-danger";
      case "未开始": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "已完成": return "bg-accent";
      case "进行中": return "bg-primary";
      case "延期": return "bg-danger";
      case "未开始": return "bg-warning";
      default: return "bg-muted-foreground";
    }
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

      {/* Header */}
      <div className="h-14 flex items-center px-4 bg-background">
        <button onClick={() => router.push("/work")} className="mr-3">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">进度管理</h1>
      </div>

      {/* Search & Filter */}
      <div className="px-4 py-3 bg-card space-y-3 border-b border-border">
        <div className="h-11 bg-input rounded-xl flex items-center px-3 gap-2.5 border border-border">
          <Search className="w-[18px] h-[18px] text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索项目名称、安置点、进度名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
          />
        </div>
        <div className="flex gap-2.5">
          {["进度类型", "进度状态", "更多筛选"].map((filter, index) => (
            <button key={index} className="h-9 bg-input rounded-lg flex items-center px-3 gap-1.5 border border-border">
              <span className="text-[13px] text-secondary-foreground">{filter}</span>
              <ChevronDown className="w-2.5 h-2.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 flex gap-2.5">
        <button onClick={() => setShowAddModal(true)} className="h-10 bg-primary rounded-lg flex items-center justify-center px-4">
          <span className="text-[13px] text-white font-semibold">新增进度</span>
        </button>
        <button className="h-10 bg-input rounded-lg flex items-center justify-center px-4 border border-border">
          <Upload className="w-4 h-4 text-accent mr-1.5" />
          <span className="text-[13px] text-accent">批量导入</span>
        </button>
        <button className="h-10 bg-input rounded-lg flex items-center justify-center px-4 border border-border">
          <Download className="w-4 h-4 text-warning mr-1.5" />
          <span className="text-[13px] text-warning">导出</span>
        </button>
      </div>

      {/* Progress List */}
      <div className="flex-1 px-4 py-2 space-y-2.5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">进度列表</h2>
          <span className="text-xs text-muted-foreground">共 86 条</span>
        </div>

        {progressData.map((item, index) => (
          <div key={index} className="bg-card rounded-xl p-3.5 space-y-3 border border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] text-foreground font-medium">{item.name}</h3>
              <span className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-primary">{item.type}</span>
              <span className="w-[3px] h-[3px] bg-muted-foreground rounded-full" />
              <span className="text-secondary-foreground">{item.project}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary-foreground">完成进度</span>
                <span className="text-foreground font-semibold">{item.actual}%</span>
              </div>
              <div className="h-1.5 bg-input rounded-full overflow-hidden">
                <div className={`h-full ${getProgressColor(item.status)} rounded-full`} style={{ width: `${item.actual}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>计划: {item.planStart} ~ {item.planEnd}</span>
              <span>{item.owner}</span>
            </div>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 h-8 bg-input rounded-md flex items-center justify-center border border-border">
                <Eye className="w-4 h-4 text-secondary-foreground mr-1" />
                <span className="text-xs text-secondary-foreground">查看</span>
              </button>
              <button className="flex-1 h-8 bg-input rounded-md flex items-center justify-center border border-border">
                <Edit className="w-4 h-4 text-secondary-foreground mr-1" />
                <span className="text-xs text-secondary-foreground">编辑</span>
              </button>
              {item.status === "进行中" && (
                <button className="flex-1 h-8 bg-input rounded-md flex items-center justify-center border border-border">
                  <RefreshCw className="w-4 h-4 text-primary mr-1" />
                  <span className="text-xs text-primary">更新</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <div className="h-14 flex items-center justify-between px-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">新增进度记录</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground">✕</button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "进度名称", placeholder: "请输入进度名称", required: true },
                { label: "进度编号", placeholder: "系统自动生成", required: false },
                { label: "进度类型", placeholder: "请选择进度类型", required: true, select: true },
                { label: "关联项目", placeholder: "请选择关联项目", required: true, select: true },
                { label: "计划开始日期", placeholder: "请选择开始日期", required: true, select: true },
                { label: "计划结束日期", placeholder: "请选择结束日期", required: true, select: true },
                { label: "计划完成量", placeholder: "请输入计划完成量", required: true },
                { label: "负责人", placeholder: "请选择负责人", required: true, select: true },
              ].map((field, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-foreground">{field.label}</span>
                    {field.required && <span className="text-sm text-danger">*</span>}
                  </div>
                  <div className="bg-input rounded-lg flex items-center px-3 h-11 border border-border">
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
                    />
                    {field.select && <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 h-11 bg-input rounded-lg text-secondary-foreground border border-border">取消</button>
              <button className="flex-1 h-11 bg-primary rounded-lg text-white font-semibold">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
