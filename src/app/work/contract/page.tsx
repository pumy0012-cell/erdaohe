"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Plus, Upload, Download, Eye, Edit, FileUp, ArrowLeft } from "lucide-react";

const contractData = [
  { no: "HT-2026-001", name: "幸福新村安置房建设合同", type: "工程承包", partyB: "中建三局", amount: "8000万", signDate: "2026-01-10", status: "履行中", owner: "张主任" },
  { no: "HT-2026-002", name: "工程监理服务合同", type: "监理合同", partyB: "华建监理", amount: "200万", signDate: "2026-01-15", status: "履行中", owner: "李经理" },
  { no: "HT-2026-003", name: "勘察设计服务合同", type: "勘察设计", partyB: "省设计院", amount: "150万", signDate: "2026-01-20", status: "已完成", owner: "王工" },
  { no: "HT-2026-004", name: "张三户移民安置协议", type: "移民安置", partyB: "张三", amount: "85万", signDate: "2026-02-01", status: "已签订", owner: "赵主任" },
  { no: "HT-2026-005", name: "供水设备采购合同", type: "物资采购", partyB: "水务集团", amount: "500万", signDate: "2026-02-10", status: "未签订", owner: "刘工" },
];

export default function ContractPage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "履行中": return "text-primary";
      case "已完成":
      case "已签订": return "text-accent";
      case "未签订": return "text-warning";
      case "已终止": return "text-danger";
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
        <h1 className="text-lg font-semibold text-foreground">合同管理</h1>
      </div>

      {/* Search & Filter */}
      <div className="px-4 py-3 bg-card space-y-3">
        <div className="h-11 bg-input rounded-xl flex items-center px-3 gap-2.5">
          <Search className="w-[18px] h-[18px] text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索合同名称、编号、乙方单位..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm placeholder:text-[#475569] outline-none"
          />
        </div>
        <div className="flex gap-2.5">
          {["合同类型", "合同状态", "更多筛选"].map((filter, index) => (
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
          <span className="text-[13px] text-white font-semibold">新增合同</span>
        </button>
        <button className="h-10 bg-input rounded-lg flex items-center justify-center px-4">
          <Upload className="w-4 h-4 text-accent mr-1.5" />
          <span className="text-[13px] text-accent">导入合同</span>
        </button>
        <button className="h-10 bg-input rounded-lg flex items-center justify-center px-4">
          <Download className="w-4 h-4 text-warning mr-1.5" />
          <span className="text-[13px] text-warning">导出列表</span>
        </button>
      </div>

      {/* Contract List */}
      <div className="flex-1 px-4 py-2 space-y-2.5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-white">合同列表</h2>
          <span className="text-xs text-muted-foreground">共 64 条</span>
        </div>

        {contractData.map((item, index) => (
          <div key={index} className="bg-card rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-primary font-medium">{item.no}</span>
              <span className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</span>
            </div>
            <h3 className="text-[15px] text-white font-medium">{item.name}</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-primary">{item.type}</span>
              <span className="w-[3px] h-[3px] bg-[#475569] rounded-full" />
              <span className="text-secondary-foreground">乙方: {item.partyB}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-warning font-semibold">金额: {item.amount}</span>
              <span className="text-[11px] text-muted-foreground">签订: {item.signDate}</span>
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
              <button className="flex-1 h-8 bg-input rounded-md flex items-center justify-center">
                <FileUp className="w-4 h-4 text-secondary-foreground mr-1" />
                <span className="text-xs text-secondary-foreground">上传</span>
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
              <h2 className="text-lg font-semibold text-white">新增合同</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground">✕</button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "合同编号", placeholder: "系统自动生成", required: false },
                { label: "合同名称", placeholder: "请输入合同名称", required: true },
                { label: "合同类型", placeholder: "请选择合同类型", required: true, select: true },
                { label: "甲方代表", placeholder: "请选择甲方代表", required: true, select: true },
                { label: "乙方单位", placeholder: "请输入乙方单位名称", required: true },
                { label: "合同金额", placeholder: "请输入合同金额", required: true },
                { label: "签订日期", placeholder: "请选择签订日期", required: true, select: true },
                { label: "计划开始日期", placeholder: "请选择开始日期", required: true, select: true },
                { label: "计划结束日期", placeholder: "请选择结束日期", required: true, select: true },
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
