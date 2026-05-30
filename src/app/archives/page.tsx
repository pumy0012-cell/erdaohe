"use client";

import { useState } from "react";
import { 
  Search, ChevronDown, Download, Eye, FileText, 
  Clock, User, FolderOpen, Calendar, Filter, X, File, FileSpreadsheet, FileImage, Trash2
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

const initialArchiveData = [
  { no: "DA-2026-001", name: "张三移民安置档案", type: "个人档案", status: "已归档", date: "2026-01-15", owner: "李经理", desc: "包含身份证明、搬迁协议、补偿明细等相关材料", fileType: "pdf", fileUrl: "/files/sample.pdf" },
  { no: "DA-2026-002", name: "幸福新村工程档案", type: "工程档案", status: "已归档", date: "2026-01-20", owner: "王工", desc: "工程建设全过程资料，包括设计图纸、施工记录、验收报告", fileType: "doc", fileUrl: "/files/sample.doc" },
  { no: "DA-2026-003", name: "征地补偿协议", type: "文书档案", status: "暂存", date: "2026-02-01", owner: "张主任", desc: "征地补偿相关协议文件，待补充签字页", fileType: "xlsx", fileUrl: "/files/sample.xlsx" },
  { no: "DA-2026-004", name: "2026年Q1财务报表", type: "财务档案", status: "未归档", date: "2026-02-10", owner: "刘会计", desc: "第一季度财务报表，需审计后归档", fileType: "xlsx", fileUrl: "/files/sample.xlsx" },
  { no: "DA-2026-005", name: "李四搬迁安置档案", type: "个人档案", status: "已归档", date: "2026-02-15", owner: "李经理", desc: "搬迁安置全套档案资料", fileType: "pdf", fileUrl: "/files/sample.pdf" },
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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [archives, setArchives] = useState(initialArchiveData);
  const [selectedArchive, setSelectedArchive] = useState<typeof initialArchiveData[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>("全部");
  const [selectedStatus, setSelectedStatus] = useState<string>("全部");

  const filteredData = archives.filter(item => {
    const matchSearch = item.name.includes(searchQuery) || 
      item.no.includes(searchQuery) || 
      item.owner.includes(searchQuery);
    const matchType = selectedType === "全部" || item.type === selectedType;
    const matchStatus = selectedStatus === "全部" || item.status === selectedStatus;
    return matchSearch && matchType && matchStatus;
  });

  const typeOptions = ["全部", "个人档案", "工程档案", "文书档案", "财务档案"];
  const statusOptions = ["全部", "已归档", "暂存", "未归档"];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "个人档案": return colorMap.blue;
      case "工程档案": return colorMap.indigo;
      case "文书档案": return colorMap.green;
      case "财务档案": return colorMap.amber;
      default: return colorMap.blue;
    }
  };

  const handleDeleteArchive = (no: string) => {
    if (confirm("确定要删除这个档案吗？")) {
      setArchives(archives.filter(a => a.no !== no));
      setShowViewModal(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf": return { icon: File, bg: "bg-red-500", text: "text-red-500", label: "PDF" };
      case "doc": 
      case "docx": return { icon: FileText, bg: "bg-blue-500", text: "text-blue-500", label: "Word" };
      case "xlsx": 
      case "xls": return { icon: FileSpreadsheet, bg: "bg-green-500", text: "text-green-500", label: "Excel" };
      case "jpg": 
      case "png": 
      case "jpeg": return { icon: FileImage, bg: "bg-purple-500", text: "text-purple-500", label: "图片" };
      default: return { icon: File, bg: "bg-slate-500", text: "text-slate-500", label: "文件" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 max-w-md mx-auto">
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
      </div>

      {/* Search */}
      <div className="px-4 py-4 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-12 bg-slate-100 rounded-xl flex items-center px-4 gap-3 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-[18px] h-[18px] text-slate-400" />
            <input
              type="text"
              placeholder="搜索档案名称、编号、负责人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-slate-900 text-sm placeholder:text-slate-400 outline-none"
            />
          </div>
          <button 
            onClick={() => setShowFilterModal(true)}
            className="h-12 px-4 bg-slate-100 rounded-xl flex items-center gap-1.5 border border-slate-200"
          >
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">分类</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
        {(selectedType !== "全部" || selectedStatus !== "全部") && (
          <div className="flex items-center gap-2 mt-3">
            {selectedType !== "全部" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                {selectedType}
                <button onClick={() => setSelectedType("全部")} className="ml-0.5">×</button>
              </span>
            )}
            {selectedStatus !== "全部" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                {selectedStatus}
                <button onClick={() => setSelectedStatus("全部")} className="ml-0.5">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Archive List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {filteredData.map((item, index) => {
          const colors = getTypeColor(item.type);
          const statusColors = statusMap[item.status] || statusMap["未归档"];
          const fileIcon = getFileIcon(item.fileType);
          const FileIconComponent = fileIcon.icon;
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
                <div className={`w-10 h-10 ${fileIcon.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <FileIconComponent className="w-5 h-5 text-white" />
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
                    <button 
                      onClick={() => { setSelectedArchive(item); setShowPreviewModal(true); }}
                      className="flex-1 h-10 bg-blue-500 rounded-xl flex items-center justify-center gap-2 text-white font-medium shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">预览</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedArchive(item); setShowViewModal(true); }}
                      className="flex-1 h-10 bg-slate-100 rounded-xl flex items-center justify-center gap-2 text-slate-600 font-medium hover:bg-slate-200 transition-all active:scale-95"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">详情</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedArchive(item); setShowDownloadModal(true); }}
                      className="flex-1 h-10 bg-slate-100 rounded-xl flex items-center justify-center gap-2 text-slate-600 font-medium hover:bg-slate-200 transition-all active:scale-95"
                    >
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

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl max-h-[70vh] overflow-y-auto">
            <div className="sticky top-0 h-14 flex items-center justify-between px-5 bg-white border-b border-slate-200 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-slate-800">分类筛选</h2>
              <button onClick={() => setShowFilterModal(false)} className="p-2">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-3">
                <span className="text-sm font-medium text-slate-700">档案类型</span>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`h-9 px-4 rounded-full text-sm font-medium border transition-all ${
                        selectedType === type
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <span className="text-sm font-medium text-slate-700">档案状态</span>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`h-9 px-4 rounded-full text-sm font-medium border transition-all ${
                        selectedStatus === status
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button
                onClick={() => {
                  setSelectedType("全部");
                  setSelectedStatus("全部");
                }}
                className="flex-1 h-11 bg-slate-100 rounded-xl text-slate-600 border border-slate-200"
              >
                重置
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 h-11 bg-blue-500 rounded-xl text-white font-medium"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedArchive && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 h-14 flex items-center justify-between px-5 bg-white border-b border-slate-200 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-slate-800">档案详情</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">档案名称</span>
                  <span className="text-sm font-medium text-slate-800">{selectedArchive.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">档案编号</span>
                  <span className="text-sm font-medium text-slate-800">{selectedArchive.no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">档案类型</span>
                  <span className="text-sm font-medium text-slate-800">{selectedArchive.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">档案状态</span>
                  <span className={`text-sm font-medium ${selectedArchive.status === '已归档' ? 'text-green-600' : selectedArchive.status === '暂存' ? 'text-amber-600' : 'text-red-600'}`}>{selectedArchive.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">归档日期</span>
                  <span className="text-sm font-medium text-slate-800">{selectedArchive.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">负责人</span>
                  <span className="text-sm font-medium text-slate-800">{selectedArchive.owner}</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-sm text-slate-500">档案描述</span>
                  <p className="text-sm text-slate-800 mt-1">{selectedArchive.desc}</p>
                </div>
              </div>
            </div>
            <div className="p-5 pt-0 space-y-2">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full h-11 bg-blue-500 rounded-xl text-white font-medium"
              >
                关闭
              </button>
              <button
                onClick={() => selectedArchive && handleDeleteArchive(selectedArchive.no)}
                className="w-full h-11 bg-red-500 rounded-xl text-white font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                删除档案
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Modal */}
      {showDownloadModal && selectedArchive && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl">
            <div className="h-14 flex items-center justify-between px-5 bg-white border-b border-slate-200 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-slate-800">下载档案</h2>
              <button onClick={() => setShowDownloadModal(false)} className="p-2">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <button className="w-full h-14 bg-blue-50 rounded-xl flex items-center px-4 gap-3 border border-blue-200">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-800">完整档案包</p>
                  <p className="text-xs text-slate-500">PDF 格式</p>
                </div>
                <Download className="w-5 h-5 text-blue-500" />
              </button>
              <button className="w-full h-14 bg-slate-50 rounded-xl flex items-center px-4 gap-3 border border-slate-200">
                <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-800">仅文档</p>
                  <p className="text-xs text-slate-500">Word 格式</p>
                </div>
                <Download className="w-5 h-5 text-slate-400" />
              </button>
              <button className="w-full h-14 bg-slate-50 rounded-xl flex items-center px-4 gap-3 border border-slate-200">
                <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-800">仅表格</p>
                  <p className="text-xs text-slate-500">Excel 格式</p>
                </div>
                <Download className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="w-full h-11 bg-slate-100 rounded-xl text-slate-600 border border-slate-200"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedArchive && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="h-14 flex items-center justify-between px-5 bg-white border-b border-slate-200 rounded-t-2xl flex-shrink-0">
              <h2 className="text-lg font-semibold text-slate-800">文件预览</h2>
              <button onClick={() => setShowPreviewModal(false)} className="p-2">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4 bg-slate-100">
              {(() => {
                const fileIcon = getFileIcon(selectedArchive.fileType);
                const FileIconComponent = fileIcon.icon;
                const previewUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(selectedArchive.fileUrl || window.location.origin + '/files/sample.pdf')}`;
                
                return (
                  <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden">
                    <iframe 
                      src={previewUrl}
                      className="w-full h-full min-h-[400px]"
                      style={{ border: 'none' }}
                      title="文件预览"
                    />
                  </div>
                );
              })()}
            </div>
            <div className="p-4 border-t border-slate-200 flex-shrink-0 flex gap-3">
              <button
                onClick={() => {
                  const fileUrl = selectedArchive.fileUrl || '/files/sample.pdf';
                  window.open(fileUrl, '_blank');
                }}
                className="flex-1 h-11 bg-blue-500 rounded-xl text-white font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                下载
              </button>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="flex-1 h-11 bg-slate-100 rounded-xl text-slate-600 font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
