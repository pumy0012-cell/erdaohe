"use client";

import { useState } from "react";
import { 
  Search, ChevronDown, Plus, Upload, Download, Eye, FileEdit, FileText, 
  Clock, User, FolderOpen, Calendar
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

const archiveData = [
  { no: "DA-2026-001", name: "张三移民安置档案", type: "个人档案", status: "已归档", date: "2026-01-15", owner: "李经理", desc: "包含身份证明、搬迁协议、补偿明细等相关材料" },
  { no: "DA-2026-002", name: "幸福新村工程档案", type: "工程档案", status: "已归档", date: "2026-01-20", owner: "王工", desc: "工程建设全过程资料，包括设计图纸、施工记录、验收报告" },
  { no: "DA-2026-003", name: "征地补偿协议", type: "文书档案", status: "暂存", date: "2026-02-01", owner: "张主任", desc: "征地补偿相关协议文件，待补充签字页" },
  { no: "DA-2026-004", name: "2026年Q1财务报表", type: "财务档案", status: "未归档", date: "2026-02-10", owner: "刘会计", desc: "第一季度财务报表，需审计后归档" },
  { no: "DA-2026-005", name: "李四搬迁安置档案", type: "个人档案", status: "已归档", date: "2026-02-15", owner: "李经理", desc: "搬迁安置全套档案资料" },
];

const colorMap: Record<string, { bg: string; light: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  indigo: { bg: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
  green: { bg: "bg-green-500", light: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  amber: { bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
};

const statusMap: Record<string, { bg: string; light: string; text: string }> = {
  "已归档": { bg: "bg-green-500", light: "bg-green-50", text: "text-green-600" },
  "暂存": { bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600" },
  "未归档": { bg: "bg-red-500", light: "bg-red-50", text: "text-red-600" },
};

export default function ArchivePage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredData = archiveData.filter(item => 
    item.name.includes(searchQuery) || 
    item.no.includes(searchQuery) || 
    item.owner.includes(searchQuery)
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "个人档案": return colorMap.blue;
      case "工程档案": return colorMap.indigo;
      case "文书档案": return colorMap.green;
      case "财务档案": return colorMap.amber;
      default: return colorMap.blue;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Status Bar */}
      <div className="status-bar-height flex items-center justify-between px-4 bg-white">
        <span className="text-gray-900 font-semibold text-[15px]">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="w-[18px] h-3 bg-gray-900 rounded-sm" />
          <div className="w-4 h-3 bg-gray-900 rounded-sm" />
          <div className="w-6 h-3 bg-green-500 rounded-[3px]" />
        </div>
      </div>

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-base font-bold text-slate-800">档案管理</h1>
          <p className="text-xs text-slate-500">二道河水库工程</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-9 bg-blue-500 rounded-xl flex items-center justify-center px-4"
        >
          <Plus className="w-4 h-4 text-white mr-1.5" />
          <span className="text-sm text-white font-medium">新增</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-4 bg-white border-b border-slate-100">
        <div className="h-12 bg-slate-100 rounded-xl flex items-center px-4 gap-3 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search className="w-[18px] h-[18px] text-slate-400" />
          <input
            type="text"
            placeholder="搜索档案名称、编号、负责人..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-900 text-sm placeholder:text-slate-400 outline-none"
          />
        </div>
      </div>

      {/* Archive List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {filteredData.map((item, index) => {
          const colors = getTypeColor(item.type);
          const statusColors = statusMap[item.status] || statusMap["未归档"];
          const isExpanded = expandedId === index;
          
          return (
            <div 
              key={index} 
              className={`bg-white/80 backdrop-blur-xl rounded-2xl border transition-all duration-300 ${isExpanded ? `${colors.border} shadow-lg shadow-blue-50` : 'border-slate-200/50 shadow-sm hover:shadow-md'}`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : index)}
                className="w-full flex items-start gap-3 px-4 py-4 text-left"
              >
                <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 leading-tight">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors.light} ${statusColors.text}`}>
                      {item.status}
                    </span>
                    <span className="text-xs text-slate-400">{item.no}</span>
                  </div>
                </div>
                <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                  <ChevronDown className={`w-5 h-5 ${isExpanded ? colors.text : 'text-slate-400'}`} />
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="bg-slate-50/80 rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.type}</p>
                        <p className="text-xs text-slate-500">档案类型</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-700">{item.date}</p>
                        <p className="text-xs text-slate-500">归档日期</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-700">{item.owner}</p>
                        <p className="text-xs text-slate-500">负责人</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-xs text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 h-10 bg-blue-500 rounded-xl flex items-center justify-center gap-2 text-white font-medium shadow-md hover:shadow-lg transition-all active:scale-95">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">查看</span>
                    </button>
                    <button className="flex-1 h-10 bg-slate-100 rounded-xl flex items-center justify-center gap-2 text-slate-600 font-medium hover:bg-slate-200 transition-all active:scale-95">
                      <FileEdit className="w-4 h-4" />
                      <span className="text-sm">编辑</span>
                    </button>
                    <button className="flex-1 h-10 bg-slate-100 rounded-xl flex items-center justify-center gap-2 text-slate-600 font-medium hover:bg-slate-200 transition-all active:scale-95">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">下载</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav />

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 h-14 flex items-center justify-between px-5 bg-white border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">新增档案</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2">
                <ChevronDown className="w-5 h-5 text-slate-400 rotate-90" />
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
                    <span className="text-sm text-slate-700">{field.label}</span>
                    {field.required && <span className="text-sm text-red-500">*</span>}
                  </div>
                  <div className={`bg-slate-100 rounded-xl flex items-center px-3 border border-slate-200 ${field.textarea ? "py-2 h-20" : "h-11"}`}>
                    {field.textarea ? (
                      <textarea
                        placeholder={field.placeholder}
                        className="flex-1 bg-transparent text-slate-800 text-sm placeholder:text-slate-400 outline-none resize-none"
                      />
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          className="flex-1 bg-transparent text-slate-800 text-sm placeholder:text-slate-400 outline-none"
                        />
                        {field.select && <ChevronDown className="w-3 h-3 text-slate-400" />}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div className="space-y-2">
                <span className="text-sm text-slate-700">附件上传</span>
                <div className="h-20 bg-slate-100 rounded-xl flex flex-col items-center justify-center gap-2 border border-slate-200 border-dashed">
                  <Upload className="w-6 h-6 text-blue-500" />
                  <span className="text-[13px] text-slate-500">点击上传附件</span>
                </div>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-11 bg-slate-100 rounded-xl text-slate-600 border border-slate-200"
              >
                取消
              </button>
              <button className="flex-1 h-11 bg-blue-500 rounded-xl text-white font-medium">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
