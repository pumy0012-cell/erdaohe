"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Phone, Mail, MapPin, User, Building2, ChevronRight, ChevronDown } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const organizations = [
  {
    id: 1,
    name: "北京水投水务工程建设管理有限公司",
    role: "建设单位",
    contact: "张经理",
    phone: "138****1234",
    email: "zhang@shuotou.com",
    color: "blue",
  },
  {
    id: 2,
    name: "北京市水利规划设计研究院",
    role: "总体设计牵头",
    contact: "李总工",
    phone: "139****5678",
    email: "li@bwdi.com",
    color: "indigo",
  },
  {
    id: 3,
    name: "中水北方勘测设计研究有限责任公司",
    role: "大坝设计",
    contact: "王工",
    phone: "137****9012",
    email: "wang@csnb.com",
    color: "cyan",
  },
  {
    id: 4,
    name: "中水北方勘测设计研究有限责任公司",
    role: "移民安置设计",
    contact: "赵工",
    phone: "136****3456",
    email: "zhao@csnb.com",
    color: "sky",
  },
  {
    id: 5,
    name: "黄河勘测规划设计研究院有限公司",
    role: "设计监理",
    contact: "刘工",
    phone: "135****7890",
    email: "liu@yrcc.com",
    color: "amber",
  },
  {
    id: 6,
    name: "黄河勘测规划设计研究院有限公司",
    role: "工程量清单编制",
    contact: "陈工",
    phone: "134****2468",
    email: "chen@yrcc.com",
    color: "orange",
  },
  {
    id: 7,
    name: "长江监理",
    role: "大坝监理单位",
    contact: "杨监理",
    phone: "133****1357",
    email: "yang@cjpm.com",
    color: "green",
  },
  {
    id: 8,
    name: "北京艺林生态科技有限公司",
    role: "林可报告编制",
    contact: "周工",
    phone: "132****9753",
    email: "zhou@yilin.com",
    color: "emerald",
  },
  {
    id: 9,
    name: "北京国道通公路设计研究院股份有限公司",
    role: "道路设计牵头单位",
    contact: "吴总",
    phone: "131****8642",
    email: "wu@gdt.com",
    color: "purple",
  },
  {
    id: 10,
    name: "北京市市政工程设计研究总院有限公司",
    role: "红南路设计",
    contact: "郑工",
    phone: "130****7531",
    email: "zheng@bmrdi.com",
    color: "violet",
  },
  {
    id: 11,
    name: "北京交科公路勘察设计研究院有限公司",
    role: "军红路设计",
    contact: "孙工",
    phone: "129****6420",
    email: "sun@bjjk.com",
    color: "fuchsia",
  },
  {
    id: 12,
    name: "北京房兴土地房地产评估有限公司",
    role: "评估公司",
    contact: "钱工",
    phone: "128****5319",
    email: "qian@fangxing.com",
    color: "rose",
  },
];

const colorMap: Record<string, { bg: string; text: string; light: string; border: string }> = {
  blue: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50", border: "border-blue-200" },
  indigo: { bg: "bg-indigo-500", text: "text-indigo-600", light: "bg-indigo-50", border: "border-indigo-200" },
  cyan: { bg: "bg-cyan-500", text: "text-cyan-600", light: "bg-cyan-50", border: "border-cyan-200" },
  sky: { bg: "bg-sky-500", text: "text-sky-600", light: "bg-sky-50", border: "border-sky-200" },
  amber: { bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50", border: "border-amber-200" },
  orange: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50", border: "border-orange-200" },
  green: { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50", border: "border-green-200" },
  emerald: { bg: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50", border: "border-emerald-200" },
  purple: { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-50", border: "border-purple-200" },
  violet: { bg: "bg-violet-500", text: "text-violet-600", light: "bg-violet-50", border: "border-violet-200" },
  fuchsia: { bg: "bg-fuchsia-500", text: "text-fuchsia-600", light: "bg-fuchsia-50", border: "border-fuchsia-200" },
  rose: { bg: "bg-rose-500", text: "text-rose-600", light: "bg-rose-50", border: "border-rose-200" },
};

export default function ContactsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredOrgs = organizations.filter(org => 
    org.name.includes(searchQuery) || 
    org.role.includes(searchQuery) ||
    org.contact.includes(searchQuery)
  );

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
      <div className="h-16 flex items-center justify-between px-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">参建单位通讯录</h1>
            <p className="text-xs text-gray-500">二道河水库工程</p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 rounded-full">
          <span className="text-xs font-medium text-blue-600">{organizations.length} 家单位</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="h-12 bg-gray-100 rounded-xl flex items-center px-4 gap-3 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search className="w-[18px] h-[18px] text-gray-400" />
          <input
            type="text"
            placeholder="搜索单位名称、职责、联系人..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-gray-900 text-sm placeholder:text-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Organization List */}
      <div className="flex-1 overflow-y-auto">
        {/* All Organizations Header */}
        <div className="h-12 flex items-center px-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <Building2 className="w-5 h-5 text-white mr-3" />
          <span className="text-white font-semibold">全部单位</span>
          <span className="text-white/70 text-xs ml-2">{filteredOrgs.length} 家</span>
        </div>

        {/* Organization Items */}
        <div className="px-4 py-3 space-y-3">
          {filteredOrgs.map((org) => {
            const colors = colorMap[org.color] || colorMap.blue;
            const isExpanded = expandedId === org.id;
            
            return (
              <div 
                key={org.id} 
                className={`bg-white rounded-2xl border transition-all duration-300 ${isExpanded ? `${colors.border} shadow-lg shadow-blue-50` : 'border-gray-200 shadow-sm hover:shadow-md'}`}
              >
                {/* Organization Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : org.id)}
                  className="w-full flex items-start gap-3 px-4 py-4 text-left"
                >
                  <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight">{org.name}</h3>
                    <div className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.light} ${colors.text}`}>
                      {org.role}
                    </div>
                  </div>
                  <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className={`w-5 h-5 ${isExpanded ? colors.text : 'text-gray-400'}`} />
                  </div>
                </button>
                
                {/* Expanded Contact Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pl-17 space-y-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center`}>
                          <span className="text-xs font-bold text-white">{org.contact[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{org.contact}</p>
                          <p className="text-xs text-gray-500">联系人</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-sm text-gray-700">{org.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="text-sm text-gray-700 truncate flex-1">{org.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className={`flex-1 h-10 ${colors.bg} rounded-xl flex items-center justify-center gap-2 text-white font-medium shadow-md hover:shadow-lg transition-all active:scale-95`}>
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">拨打电话</span>
                      </button>
                      <button className="flex-1 h-10 bg-gray-100 rounded-xl flex items-center justify-center gap-2 text-gray-600 font-medium hover:bg-gray-200 transition-all active:scale-95">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">发送邮件</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
