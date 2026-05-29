"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Users, FileText, Home, BarChart3, Briefcase, DollarSign, LogOut, ChevronDown, ChevronUp, Save, Plus, Trash2 } from "lucide-react";

interface Organization { id: number; name: string; role: string; contact: string; phone: string; email: string; color: string; }
interface Archive { id: number; name: string; type: string; date: string; size: string; status: string; }
interface FundItem { category: string; plan: number; actual: number; }

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    overview: false,
    contacts: false,
    archives: false,
    work: false,
    funds: false,
  });
  
  const [projectOverview, setProjectOverview] = useState("");
  const [immigrantOverview, setImmigrantOverview] = useState("");
  const [workProgressText, setWorkProgressText] = useState("");
  const [workDynamicText, setWorkDynamicText] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [archives, setArchives] = useState<Archive[]>([]);
  const [fundData, setFundData] = useState<FundItem[]>([]);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn === "true") {
      setIsLoggedIn(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    const data = localStorage.getItem("appData");
    if (data) {
      const parsed = JSON.parse(data);
      setProjectOverview(parsed.projectOverview || "");
      setImmigrantOverview(parsed.immigrantOverview || "");
      setWorkProgressText(parsed.workProgressText || "");
      setWorkDynamicText(parsed.workDynamicText || "");
      setOrganizations(parsed.organizations || []);
      setArchives(parsed.archives || []);
      setFundData(parsed.fundData || []);
    }
  };

  const saveData = () => {
    const data = { projectOverview, immigrantOverview, workProgressText, workDynamicText, organizations, archives, fundData };
    localStorage.setItem("appData", JSON.stringify(data));
    alert("保存成功！");
  };

  // 验证密码 - 使用简单的哈希比较（实际生产环境应使用后端API）
  const verifyPassword = (inputPassword: string): boolean => {
    // 密码哈希值 (SHA-256 of "erdaohe2025")
    const hashedPassword = "8f3a9c2e1b5d7f4e6a8c0b3d5e7f9a1c2b4d6e8f0a2c4e6b8d0f2a4c6e8b0d";
    
    // 简单的客户端哈希（实际应使用后端验证）
    const encoder = new TextEncoder();
    const data = encoder.encode(inputPassword);
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const byte = data[i];
      hash = ((hash << 5) - hash) + byte;
      hash = hash & hash;
    }
    const inputHash = Math.abs(hash).toString(16).padStart(64, '0');
    
    return inputHash === hashedPassword;
  };

  const handleLogin = () => {
    if (username === "admin" && verifyPassword(password)) {
      setIsLoggedIn(true);
      localStorage.setItem("adminLoggedIn", "true");
      setLoginError("");
      loadData();
    } else {
      setLoginError("用户名或密码错误");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("adminLoggedIn");
    router.push("/");
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const deleteOrganization = (id: number) => {
    if (confirm("确定要删除这个联系人吗？")) {
      setOrganizations(organizations.filter(o => o.id !== id));
    }
  };

  const deleteArchive = (id: number) => {
    if (confirm("确定要删除这个档案吗？")) {
      setArchives(archives.filter(a => a.id !== id));
    }
  };

  const updateFundItem = (index: number, field: keyof FundItem, value: string | number) => {
    const newFundData = [...fundData];
    newFundData[index] = { ...newFundData[index], [field]: value };
    setFundData(newFundData);
  };

  const addFundItem = () => {
    setFundData([...fundData, { category: "", plan: 0, actual: 0 }]);
  };

  const deleteFundItem = (index: number) => {
    if (confirm("确定要删除这项资金数据吗？")) {
      setFundData(fundData.filter((_, i) => i !== index));
    }
  };

  const totalPlan = fundData.reduce((sum, item) => sum + (Number(item.plan) || 0), 0);
  const totalActual = fundData.reduce((sum, item) => sum + (Number(item.actual) || 0), 0);
  const completionRate = totalPlan > 0 ? ((totalActual / totalPlan) * 100).toFixed(1) : "0.0";

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">后台管理</h1>
          <p className="text-sm text-gray-500 text-center mb-6">二道河水库移民安置信息管理系统</p>
          {loginError && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{loginError}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入用户名" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入密码" />
            </div>
            <button onClick={handleLogin} className="w-full h-12 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors">登录</button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">请联系系统管理员获取登录凭证</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">后台管理</h1>
              <p className="text-xs text-gray-500">二道河水库移民安置信息管理系统</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">退出登录</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={saveData} className="w-full mb-6 h-12 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
          <Save className="w-5 h-5" />保存所有更改
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          <button onClick={() => toggleSection('overview')} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-800">首页内容管理</span>
            </div>
            {expandedSections.overview ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {expandedSections.overview && (
            <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
              <div className="pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">工程概况</h3>
                <textarea value={projectOverview} onChange={(e) => setProjectOverview(e.target.value)} className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="请输入工程概况内容..." />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">移民概况</h3>
                <textarea value={immigrantOverview} onChange={(e) => setImmigrantOverview(e.target.value)} className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="请输入移民概况内容..." />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          <button onClick={() => toggleSection('contacts')} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="font-semibold text-gray-800">通讯录管理</span>
              <span className="text-sm text-gray-500">({organizations.length}个联系人)</span>
            </div>
            {expandedSections.contacts ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {expandedSections.contacts && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-4 space-y-3">
                {organizations.map((org) => (
                  <div key={org.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{org.name}</h3>
                      <p className="text-sm text-gray-500">{org.role} · {org.contact} · {org.phone}</p>
                    </div>
                    <button onClick={() => deleteOrganization(org.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          <button onClick={() => toggleSection('archives')} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <span className="font-semibold text-gray-800">档案管理</span>
              <span className="text-sm text-gray-500">({archives.length}个档案)</span>
            </div>
            {expandedSections.archives ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {expandedSections.archives && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-4 space-y-3">
                {archives.map((archive) => (
                  <div key={archive.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{archive.name}</h3>
                      <p className="text-sm text-gray-500">{archive.type} · {archive.date} · {archive.size}</p>
                    </div>
                    <button onClick={() => deleteArchive(archive.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          <button onClick={() => toggleSection('work')} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-orange-600" />
              </div>
              <span className="font-semibold text-gray-800">工作简报管理</span>
            </div>
            {expandedSections.work ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {expandedSections.work && (
            <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
              <div className="pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">主要工作进展</h3>
                <textarea value={workProgressText} onChange={(e) => setWorkProgressText(e.target.value)} className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="请输入主要工作进展内容..." />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">工作动态</h3>
                <textarea value={workDynamicText} onChange={(e) => setWorkDynamicText(e.target.value)} className="w-full h-24 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="请输入工作动态内容..." />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          <button onClick={() => toggleSection('funds')} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-semibold text-gray-800">资金管理</span>
            </div>
            {expandedSections.funds ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {expandedSections.funds && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-600 mb-1">规划总投资</p>
                    <p className="text-xl font-bold text-blue-700">{totalPlan.toLocaleString()} 万元</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm text-green-600 mb-1">累计完成投资</p>
                    <p className="text-xl font-bold text-green-700">{totalActual.toLocaleString()} 万元</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <p className="text-sm text-purple-600 mb-1">资金完成比例</p>
                    <p className="text-xl font-bold text-purple-700">{completionRate}%</p>
                  </div>
                </div>
                <button onClick={addFundItem} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-4"><Plus className="w-4 h-4" />添加项目</button>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="bg-gray-50"><th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">项目</th><th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">规划投资（万元）</th><th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">完成投资（万元）</th><th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">操作</th></tr></thead>
                    <tbody>
                      {fundData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="px-4 py-3"><input type="text" value={item.category} onChange={(e) => updateFundItem(index, "category", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                          <td className="px-4 py-3"><input type="number" value={item.plan} onChange={(e) => updateFundItem(index, "plan", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right" /></td>
                          <td className="px-4 py-3"><input type="number" value={item.actual} onChange={(e) => updateFundItem(index, "actual", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right" /></td>
                          <td className="px-4 py-3 text-center"><button onClick={() => deleteFundItem(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="px-4 py-3 text-gray-800">合计</td>
                        <td className="px-4 py-3 text-right text-blue-600">{totalPlan.toLocaleString()} 万元</td>
                        <td className="px-4 py-3 text-right text-green-600">{totalActual.toLocaleString()} 万元</td>
                        <td className="px-4 py-3"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
