"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Plus, Upload, Download, Eye, Edit, FileDown, ArrowLeft } from "lucide-react";

const filters = [
  { label: "档案类型", options: ["个人档案", "工程档案", "文书档案", "财务档案"] },
  { label: "归档状态", options: ["未归档", "已归档", "暂存"] },
];

const archiveData = [
  { no: "DA-2026-001", name: "张三移民安置档案", type: "个人档案", status: "已归档", date: "2026-01-15", owner: "李经理" },
  { no: "DA-2026-002", name: "幸福新村工程档案", type: "工程档案", status: "已归档", date: "2026-01-20", owner: "王工" },
  { no: "DA-2026-003", name: "征地补偿协议", type: "文书档案", status: "暂存", date: "2026-02-01", owner: "张主任" },
  { no: "DA-2026-004", name: "2026年Q1财务报表", type: "财务档案", status: "未归档", date: "2026-02-10", owner: "刘会计" },
  { no: "DA-2026-005", name: "李四搬迁安置档案", type: "个人档案", status: "已归档", date: "2026-02-15", owner: "李经理" },
];

export default function ArchivePage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已归档": return "text-accent";
      case "暂存": return "text-warning";
      case "未归档": return "text-danger";
      default: return "text-muted-foreground";
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
        <h1 className="text-lg font-semibold text-foreground">档案管理</h1>
      </div>

      {/* Search & Filter */}
      <div className="px-4 py-3 bg-card space-y-3 border-b border-border">
        <div className="h-11 bg-input rounded-xl flex items-center px-3 gap-2.5 border border-border">
          <Search className="w-[18px] h-[18px] text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索档案名称、编号、姓名..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
          />
        </div>
        <div className="flex gap-2.5">
          {filters.map((filter, index) => (
            <button
              key={index}
              className="h-9 bg-input rounded-lg flex items-center px-3 gap-1.5 border border-border"
            >
              <span className="text-[13px] text-secondary-foreground">{filter.label}</span>
              <ChevronDown className="w-2.5 h-2.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 flex gap-2.5">
        <button
          onClick={() => setShowAddModal(true)}
          className="h-10 bg-primary rounded-lg flex items-center justify-center px-4"
        >
          <span className="text-[13px] text-white font-semibold">新增档案</span>
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

      {/* Archive List */}
      <div className="flex-1 px-4 py-2 space-y-2.5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">档案列表</h2>
          <span className="text-xs text-muted-foreground">共 128 条</span>
        </div>

        {archiveData.map((item, index) => (
          <div key={index} className="bg-card rounded-xl p-3.5 space-y-2.5 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-primary font-medium">{item.no}</span>
              <span className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</span>
            </div>
            <h3 className="text-[15px] text-foreground font-medium">{item.name}</h3>
            <div className="flex items-center justify-between text-xs text-secondary-foreground">
              <div className="flex items-center gap-3">
                <span>{item.type}</span>
                <span className="w-[3px] h-[3px] bg-muted-foreground rounded-full" />
                <span>{item.date}</span>
              </div>
              <span className="text-muted-foreground">{item.owner}</span>
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
              <button className="flex-1 h-8 bg-input rounded-md flex items-center justify-center border border-border">
                <FileDown className="w-4 h-4 text-secondary-foreground mr-1" />
                <span className="text-xs text-secondary-foreground">下载</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <div className="h-14 flex items-center justify-between px-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">新增档案</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground">
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "档案名称", placeholder: "请输入档案名称", required: true },
                { label: "档案编号", placeholder: "系统自动生成", required: false },
                { label: "档案类型", placeholder: "请选择档案类型", required: true, select: true },
                { label: "关联对象", placeholder: "请选择关联对象", required: false, select: true },
                { label: "负责人", placeholder: "请选择负责人", required: true, select: true },
                { label: "档案描述", placeholder: "请输入档案描述", required: false, textarea: true },
              ].map((field, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-foreground">{field.label}</span>
                    {field.required && <span className="text-sm text-danger">*</span>}
                  </div>
                  <div className={`bg-input rounded-lg flex items-center px-3 border border-border ${field.textarea ? "py-2 h-20" : "h-11"}`}>
                    {field.textarea ? (
                      <textarea
                        placeholder={field.placeholder}
                        className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none resize-none"
                      />
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
                        />
                        {field.select && <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div className="space-y-2">
                <span className="text-sm text-foreground">附件上传</span>
                <div className="h-20 bg-input rounded-lg flex flex-col items-center justify-center gap-2 border border-border">
                  <Upload className="w-8 h-8 text-primary" />
                  <span className="text-[13px] text-muted-foreground">点击上传附件</span>
                </div>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-11 bg-input rounded-lg text-secondary-foreground border border-border"
              >
                取消
              </button>
              <button className="flex-1 h-11 bg-primary rounded-lg text-white font-semibold">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
