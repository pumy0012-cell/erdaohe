"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Plus, Upload, Download, Eye, Edit, Wallet, ArrowLeft } from "lucide-react";

const stats = [
  { label: "计划总额", value: "2.8亿", color: "text-primary" },
  { label: "已拨付", value: "1.6亿", color: "text-accent" },
  { label: "未拨付", value: "1.2亿", color: "text-warning" },
];

const investData = [
  { name: "幸福新村征地补偿", type: "征地补偿", plan: "5000万", paid: "5000万", unpaid: "0", status: "已拨付", contract: "HT-2026-001" },
  { name: "安置房建设工程款", type: "房屋补偿", plan: "8000万", paid: "4800万", unpaid: "3200万", status: "部分拨付", contract: "HT-2026-002" },
  { name: "基础设施配套费用", type: "基础设施", plan: "3000万", paid: "0", unpaid: "3000万", status: "计划", contract: "HT-2026-003" },
  { name: "生产安置补助", type: "生产安置", plan: "2000万", paid: "1200万", unpaid: "800万", status: "部分拨付", contract: "HT-2026-004" },
  { name: "搬迁运输费用", type: "搬迁费", plan: "500万", paid: "500万", unpaid: "0", status: "已拨付", contract: "HT-2026-005" },
];

export default function InvestmentPage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已拨付": return "text-accent";
      case "部分拨付": return "text-primary";
      case "计划": return "text-warning";
      case "未支付": return "text-danger";
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
        <h1 className="text-lg font-semibold text-foreground">投资管理</h1>
      </div>

      {/* Stats Overview */}
      <div className="px-4 py-3 bg-card">
        <div className="flex gap-2.5">
          {stats.map((stat, index) => (
            <div key={index} className="flex-1 bg-input rounded-xl p-3 flex flex-col items-center">
              <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-[11px] text-muted-foreground mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-4 py-3 bg-card space-y-3">
        <div className="h-11 bg-input rounded-xl flex items-center px-3 gap-2.5">
          <Search className="w-[18px] h-[18px] text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索投资项目、合同编号..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm placeholder:text-[#475569] outline-none"
          />
        </div>
        <div className="flex gap-2.5">
          {["投资类型", "支付状态", "更多筛选"].map((filter, index) => (
            <button key={index} className="h-9 bg-input rounded-lg flex items-center px-3 gap-1.5">
              <span className="text-[13px] text-secondary-foreground">{filter}</span>
              <ChevronDown className="w-2.5 h-2.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 flex gap-2.5">
        <button onClick={() => setShowAddModal(true)} className="h-10 bg-primary rounded-lg flex items-center justify-center px-4">
          <span className="text-[13px] text-white font-semibold">新增投资</span>
        </button>
        <button className="h-10 bg-input rounded-lg flex items-center justify-center px-4">
          <Upload className="w-4 h-4 text-accent mr-1.5" />
          <span className="text-[13px] text-accent">导入数据</span>
        </button>
        <button className="h-10 bg-input rounded-lg flex items-center justify-center px-4">
          <Download className="w-4 h-4 text-warning mr-1.5" />
          <span className="text-[13px] text-warning">导出报表</span>
        </button>
      </div>

      {/* Investment List */}
      <div className="flex-1 px-4 py-2 space-y-2.5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-white">投资记录</h2>
          <span className="text-xs text-muted-foreground">共 156 条</span>
        </div>

        {investData.map((item, index) => (
          <div key={index} className="bg-card rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] text-white font-medium">{item.name}</h3>
              <span className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-primary">{item.type}</span>
              <span className="w-[3px] h-[3px] bg-[#475569] rounded-full" />
              <span className="text-secondary-foreground">{item.contract}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-sm text-secondary-foreground">{item.plan}</div>
                  <div className="text-[10px] text-muted-foreground">计划</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-accent">{item.paid}</div>
                  <div className="text-[10px] text-muted-foreground">已付</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-warning">{item.unpaid}</div>
                  <div className="text-[10px] text-muted-foreground">未付</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 h-8 bg-input rounded-md flex items-center justify-center">
                <Eye className="w-4 h-4 text-secondary-foreground mr-1" />
                <span className="text-xs text-secondary-foreground">查看</span>
              </button>
              <button className="flex-1 h-8 bg-input rounded-md flex items-center justify-center">
                <Edit className="w-4 h-4 text-secondary-foreground mr-1" />
                <span className="text-xs text-secondary-foreground">编辑</span>
              </button>
              {item.status !== "已拨付" && (
                <button className="flex-1 h-8 bg-input rounded-md flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-accent mr-1" />
                  <span className="text-xs text-accent">拨付</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <div className="h-14 flex items-center justify-between px-5 border-b border-border">
              <h2 className="text-lg font-semibold text-white">新增投资记录</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground">✕</button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "投资项目名称", placeholder: "请输入项目名称", required: true },
                { label: "投资编号", placeholder: "系统自动生成", required: false },
                { label: "投资类型", placeholder: "请选择投资类型", required: true, select: true },
                { label: "所属安置点", placeholder: "请选择安置点", required: true, select: true },
                { label: "合同编号", placeholder: "请选择关联合同", required: false, select: true },
                { label: "计划金额", placeholder: "请输入计划金额", required: true },
                { label: "资金来源", placeholder: "请选择资金来源", required: true, select: true },
                { label: "经办人", placeholder: "请选择经办人", required: true, select: true },
              ].map((field, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-white">{field.label}</span>
                    {field.required && <span className="text-sm text-danger">*</span>}
                  </div>
                  <div className="bg-input rounded-lg flex items-center px-3 h-11">
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-[#475569] outline-none"
                    />
                    {field.select && <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 h-11 bg-input rounded-lg text-secondary-foreground">取消</button>
              <button className="flex-1 h-11 bg-primary rounded-lg text-white font-semibold">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
