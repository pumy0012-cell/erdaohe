"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, FileEdit, CheckCircle, FolderOpen, ChevronRight, ChevronLeft, X, Calendar, Clock, Building2, MapPin, Users, Home, Trees, Warehouse, Landmark, Building, Briefcase, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import BottomNav from "@/components/BottomNav";

const stats = [
  { label: "安置进度", value: "78%", color: "text-primary" },
  { label: "已搬迁户数", value: "241", color: "text-accent", unit: "户" },
  { label: "已搬迁人口", value: "560", color: "text-warning", unit: "人" },
];



// 大事记数据 - 带图片轮播
const milestoneEvents = [
  {
    id: 1,
    title: "二道河水库工程正式开工",
    date: "2025-03-15",
    description: "房山区二道河水库工程举行隆重的开工仪式，标志着工程建设正式启动。",
    image: "https://picsum.photos/400/200?random=1",
  },
  {
    id: 2,
    title: "移民安置规划通过评审",
    date: "2025-06-20",
    description: "《二道河水库工程移民安置规划报告》顺利通过省级专家评审。",
    image: "https://picsum.photos/400/200?random=2",
  },
  {
    id: 3,
    title: "首批移民户签约完成",
    date: "2025-09-10",
    description: "首批50户移民户顺利完成补偿协议签订，签约率达100%。",
    image: "https://picsum.photos/400/200?random=3",
  },
  {
    id: 4,
    title: "幸福新村安置点奠基",
    date: "2025-11-08",
    description: "幸福新村集中安置点举行奠基仪式，规划安置人口1200人。",
    image: "https://picsum.photos/400/200?random=4",
  },
  {
    id: 5,
    title: "安置房主体结构封顶",
    date: "2026-02-28",
    description: "幸福新村安置房1-6号楼主体结构全部封顶，工程建设进入新阶段。",
    image: "https://picsum.photos/400/200?random=5",
  },
];

// 甘特图数据 - 根据图片内容
const ganttData = [
  { name: "0移民安置实施准备", start: 1, duration: 11, progress: 45, count: 3, status: "进行中", color: "bg-danger" },
  { name: "1农村移民安置", start: 1, duration: 11, progress: 60, count: 18, status: "进行中", color: "bg-danger" },
  { name: "2企事业单位", start: 1, duration: 11, progress: 30, count: 0, status: "进行中", color: "bg-primary" },
  { name: "3专项设施复改建", start: 1, duration: 11, progress: 50, count: 4, status: "进行中", color: "bg-danger" },
  { name: "4库底清理", start: 5, duration: 4, progress: 0, count: 2, status: "未开始", color: "bg-muted-foreground" },
  { name: "5移民安置验收", start: 6, duration: 3, progress: 0, count: 8, status: "未开始", color: "bg-muted-foreground" },
];

const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月"];

const years = [2025, 2026, 2027, 2028];

const ganttDataByYear: { [key: number]: typeof ganttData } = {
  2025: [
    { name: "0移民安置实施准备", start: 1, duration: 12, progress: 80, count: 3, status: "进行中", color: "bg-primary" },
    { name: "1农村移民安置", start: 1, duration: 12, progress: 65, count: 18, status: "进行中", color: "bg-danger" },
    { name: "2企事业单位", start: 1, duration: 12, progress: 40, count: 0, status: "进行中", color: "bg-primary" },
    { name: "3专项设施复改建", start: 1, duration: 12, progress: 55, count: 4, status: "进行中", color: "bg-danger" },
    { name: "4库底清理", start: 6, duration: 5, progress: 0, count: 2, status: "未开始", color: "bg-muted-foreground" },
    { name: "5移民安置验收", start: 7, duration: 3, progress: 0, count: 8, status: "未开始", color: "bg-muted-foreground" },
  ],
  2026: [
    { name: "0移民安置实施准备", start: 1, duration: 11, progress: 45, count: 3, status: "进行中", color: "bg-danger" },
    { name: "1农村移民安置", start: 1, duration: 11, progress: 60, count: 18, status: "进行中", color: "bg-danger" },
    { name: "2企事业单位", start: 1, duration: 11, progress: 30, count: 0, status: "进行中", color: "bg-primary" },
    { name: "3专项设施复改建", start: 1, duration: 11, progress: 50, count: 4, status: "进行中", color: "bg-danger" },
    { name: "4库底清理", start: 5, duration: 4, progress: 0, count: 2, status: "未开始", color: "bg-muted-foreground" },
    { name: "5移民安置验收", start: 6, duration: 3, progress: 0, count: 8, status: "未开始", color: "bg-muted-foreground" },
  ],
  2027: [
    { name: "0移民安置实施准备", start: 1, duration: 3, progress: 0, count: 0, status: "未开始", color: "bg-muted-foreground" },
    { name: "1农村移民安置", start: 1, duration: 3, progress: 0, count: 0, status: "未开始", color: "bg-muted-foreground" },
    { name: "2企事业单位", start: 1, duration: 3, progress: 0, count: 0, status: "未开始", color: "bg-muted-foreground" },
    { name: "3专项设施复改建", start: 1, duration: 3, progress: 0, count: 0, status: "未开始", color: "bg-muted-foreground" },
    { name: "4库底清理", start: 1, duration: 3, progress: 0, count: 0, status: "未开始", color: "bg-muted-foreground" },
    { name: "5移民安置验收", start: 1, duration: 3, progress: 0, count: 0, status: "未开始", color: "bg-muted-foreground" },
  ],
  2028: [
    { name: "0移民安置实施准备", start: 1, duration: 3, progress: 0, count: 0, status: "未开始", color: "bg-muted-foreground" },
    { name: "1农村移民安置", start: 1, duration: 3, progress: 0, count: 0, status: "未开始", color: "bg-muted-foreground" },
    { name: "2企事业单位", start: 1, duration: 3, progress: 0, count: 0, status: "未开始", color: "bg-muted-foreground" },
    { name: "3专项设施复改建", start: 1, duration: 3, progress: 0, count: 0, status: "未开始", color: "bg-muted-foreground" },
    { name: "4库底清理", start: 1, duration: 3, progress: 0, count: 0, status: "未开始", color: "bg-muted-foreground" },
    { name: "5移民安置验收", start: 1, duration: 3, progress: 0, count: 0, status: "未开始", color: "bg-muted-foreground" },
  ],
};

// 农村移民安置子任务数据 - 按年份
const ruralResettlementTasksByYear: { [key: number]: any[] } = {
  2025: [
    { id: 1, name: "搬迁安置", count: 8, start: 1, duration: 12, status: "进行中", color: "bg-danger" },
    { id: 2, name: "用地组卷报批", count: 5, start: 1, duration: 8, status: "进行中", color: "bg-primary" },
    { id: 3, name: "永久用地征地补偿", count: 3, start: 3, duration: 9, status: "进行中", color: "bg-primary" },
    { id: 4, name: "临时用地复垦", count: 2, start: 2, duration: 11, status: "进行中", color: "bg-primary" },
    { id: 5, name: "移民生产安置", count: 0, start: 5, duration: 8, status: "未开始", color: "bg-muted-foreground" },
    { id: 6, name: "资金兑付", count: 0, start: 6, duration: 7, status: "未开始", color: "bg-muted-foreground" },
  ],
  2026: [
    { id: 1, name: "搬迁安置", count: 0, start: 1, duration: 11, status: "进行中", color: "bg-danger" },
    { id: 2, name: "用地组卷报批", count: 0, start: 1, duration: 6, status: "进行中", color: "bg-danger" },
    { id: 3, name: "永久用地征地补偿协议签订及...", count: 0, start: 3, duration: 8, status: "未开始", color: "bg-muted-foreground" },
    { id: 4, name: "临时用地复垦", count: 0, start: 2, duration: 10, status: "进行中", color: "bg-primary" },
    { id: 5, name: "移民生产安置", count: 0, start: 4, duration: 7, status: "未开始", color: "bg-muted-foreground" },
    { id: 6, name: "资金兑付", count: 0, start: 5, duration: 6, status: "未开始", color: "bg-green-500" },
  ],
  2027: [
    { id: 1, name: "搬迁安置", count: 0, start: 1, duration: 3, status: "未开始", color: "bg-muted-foreground" },
    { id: 2, name: "用地组卷报批", count: 0, start: 1, duration: 3, status: "未开始", color: "bg-muted-foreground" },
    { id: 3, name: "永久用地征地补偿", count: 0, start: 1, duration: 3, status: "未开始", color: "bg-muted-foreground" },
    { id: 4, name: "临时用地复垦", count: 0, start: 1, duration: 3, status: "未开始", color: "bg-muted-foreground" },
    { id: 5, name: "移民生产安置", count: 0, start: 1, duration: 3, status: "未开始", color: "bg-muted-foreground" },
    { id: 6, name: "资金兑付", count: 0, start: 1, duration: 3, status: "未开始", color: "bg-muted-foreground" },
  ],
  2028: [
    { id: 1, name: "搬迁安置", count: 0, start: 1, duration: 3, status: "未开始", color: "bg-muted-foreground" },
    { id: 2, name: "用地组卷报批", count: 0, start: 1, duration: 3, status: "未开始", color: "bg-muted-foreground" },
    { id: 3, name: "永久用地征地补偿", count: 0, start: 1, duration: 3, status: "未开始", color: "bg-muted-foreground" },
    { id: 4, name: "临时用地复垦", count: 0, start: 1, duration: 3, status: "未开始", color: "bg-muted-foreground" },
    { id: 5, name: "移民生产安置", count: 0, start: 1, duration: 3, status: "未开始", color: "bg-muted-foreground" },
    { id: 6, name: "资金兑付", count: 0, start: 1, duration: 3, status: "未开始", color: "bg-muted-foreground" },
  ],
};

// 0移民安置实施准备子任务 - 按年份
const preparationTasksByYear: { [key: number]: any[] } = {
  2025: [
    { id: 1, name: "移民安置规划编制", count: 1, start: 1, duration: 4, status: "已完成", color: "bg-green-500" },
    { id: 2, name: "征地拆迁方案制定", count: 1, start: 2, duration: 5, status: "已完成", color: "bg-green-500" },
    { id: 3, name: "安置点选址论证", count: 1, start: 4, duration: 6, status: "进行中", color: "bg-primary" },
  ],
  2026: [
    { id: 1, name: "移民安置规划编制", count: 0, start: 1, duration: 3, status: "已完成", color: "bg-green-500" },
    { id: 2, name: "征地拆迁方案制定", count: 0, start: 2, duration: 4, status: "已完成", color: "bg-green-500" },
    { id: 3, name: "安置点选址论证", count: 0, start: 3, duration: 5, status: "进行中", color: "bg-primary" },
    { id: 4, name: "补偿标准核定", count: 0, start: 4, duration: 6, status: "进行中", color: "bg-primary" },
    { id: 5, name: "宣传动员工作", count: 0, start: 5, duration: 7, status: "进行中", color: "bg-danger" },
    { id: 6, name: "档案资料整理", count: 0, start: 6, duration: 6, status: "未开始", color: "bg-muted-foreground" },
  ],
  2027: [
    { id: 1, name: "规划方案完善", count: 0, start: 1, duration: 2, status: "未开始", color: "bg-muted-foreground" },
    { id: 2, name: "资料归档", count: 0, start: 2, duration: 2, status: "未开始", color: "bg-muted-foreground" },
  ],
  2028: [
    { id: 1, name: "总结评估", count: 0, start: 1, duration: 2, status: "未开始", color: "bg-muted-foreground" },
  ],
};

// 2企事业单位子任务 - 按年份
const enterpriseTasksByYear: { [key: number]: any[] } = {
  2025: [
    { id: 1, name: "企业搬迁评估", count: 0, start: 1, duration: 5, status: "已完成", color: "bg-green-500" },
    { id: 2, name: "事业单位协调", count: 0, start: 3, duration: 6, status: "进行中", color: "bg-primary" },
    { id: 3, name: "补偿协议签订", count: 0, start: 5, duration: 7, status: "进行中", color: "bg-primary" },
  ],
  2026: [
    { id: 1, name: "企业搬迁评估", count: 0, start: 1, duration: 4, status: "已完成", color: "bg-green-500" },
    { id: 2, name: "事业单位协调", count: 0, start: 2, duration: 5, status: "进行中", color: "bg-primary" },
    { id: 3, name: "补偿协议签订", count: 0, start: 4, duration: 6, status: "进行中", color: "bg-primary" },
    { id: 4, name: "新址选址规划", count: 0, start: 5, duration: 5, status: "未开始", color: "bg-muted-foreground" },
    { id: 5, name: "搬迁实施", count: 0, start: 7, duration: 4, status: "未开始", color: "bg-muted-foreground" },
  ],
  2027: [
    { id: 1, name: "搬迁收尾", count: 0, start: 1, duration: 2, status: "未开始", color: "bg-muted-foreground" },
    { id: 2, name: "资料整理", count: 0, start: 2, duration: 2, status: "未开始", color: "bg-muted-foreground" },
  ],
  2028: [
    { id: 1, name: "验收总结", count: 0, start: 1, duration: 2, status: "未开始", color: "bg-muted-foreground" },
  ],
};

// 3专项设施复改建子任务 - 按年份
const facilityTasksByYear: { [key: number]: any[] } = {
  2025: [
    { id: 1, name: "道路工程复建", count: 2, start: 1, duration: 9, status: "进行中", color: "bg-danger" },
    { id: 2, name: "电力设施迁改", count: 1, start: 2, duration: 8, status: "进行中", color: "bg-primary" },
    { id: 3, name: "通信线路迁移", count: 1, start: 3, duration: 7, status: "进行中", color: "bg-primary" },
  ],
  2026: [
    { id: 1, name: "道路工程复建", count: 0, start: 1, duration: 8, status: "进行中", color: "bg-danger" },
    { id: 2, name: "电力设施迁改", count: 0, start: 2, duration: 7, status: "进行中", color: "bg-primary" },
    { id: 3, name: "通信线路迁移", count: 0, start: 3, duration: 6, status: "进行中", color: "bg-primary" },
    { id: 4, name: "供水管网改造", count: 0, start: 4, duration: 7, status: "未开始", color: "bg-muted-foreground" },
    { id: 5, name: "排水系统建设", count: 0, start: 5, duration: 6, status: "未开始", color: "bg-muted-foreground" },
  ],
  2027: [
    { id: 1, name: "设施验收", count: 0, start: 1, duration: 2, status: "未开始", color: "bg-muted-foreground" },
    { id: 2, name: "资料归档", count: 0, start: 2, duration: 2, status: "未开始", color: "bg-muted-foreground" },
  ],
  2028: [
    { id: 1, name: "后期维护", count: 0, start: 1, duration: 2, status: "未开始", color: "bg-muted-foreground" },
  ],
};

// 4库底清理子任务 - 按年份
const cleanupTasksByYear: { [key: number]: any[] } = {
  2025: [
    { id: 1, name: "前期勘察", count: 1, start: 10, duration: 3, status: "未开始", color: "bg-muted-foreground" },
  ],
  2026: [
    { id: 1, name: "建筑物拆除", count: 0, start: 5, duration: 3, status: "未开始", color: "bg-muted-foreground" },
    { id: 2, name: "林木清理", count: 0, start: 6, duration: 2, status: "未开始", color: "bg-muted-foreground" },
    { id: 3, name: "垃圾清运", count: 0, start: 7, duration: 2, status: "未开始", color: "bg-muted-foreground" },
    { id: 4, name: "卫生防疫处理", count: 0, start: 8, duration: 1, status: "未开始", color: "bg-muted-foreground" },
  ],
  2027: [
    { id: 1, name: "清理收尾", count: 0, start: 1, duration: 2, status: "未开始", color: "bg-muted-foreground" },
    { id: 2, name: "环境检测", count: 0, start: 2, duration: 2, status: "未开始", color: "bg-muted-foreground" },
  ],
  2028: [
    { id: 1, name: "最终验收", count: 0, start: 1, duration: 2, status: "未开始", color: "bg-muted-foreground" },
  ],
};

// 5移民安置验收子任务 - 按年份
const acceptanceTasksByYear: { [key: number]: any[] } = {
  2025: [
    { id: 1, name: "验收方案编制", count: 2, start: 11, duration: 2, status: "未开始", color: "bg-muted-foreground" },
  ],
  2026: [
    { id: 1, name: "资料准备", count: 0, start: 6, duration: 3, status: "未开始", color: "bg-muted-foreground" },
    { id: 2, name: "自检验收", count: 0, start: 8, duration: 2, status: "未开始", color: "bg-muted-foreground" },
    { id: 3, name: "专项验收", count: 0, start: 9, duration: 2, status: "未开始", color: "bg-muted-foreground" },
  ],
  2027: [
    { id: 1, name: "初步验收", count: 0, start: 1, duration: 2, status: "未开始", color: "bg-muted-foreground" },
    { id: 2, name: "正式验收", count: 0, start: 2, duration: 2, status: "未开始", color: "bg-muted-foreground" },
  ],
  2028: [
    { id: 1, name: "验收总结", count: 0, start: 1, duration: 2, status: "未开始", color: "bg-muted-foreground" },
  ],
};

// 保留原有数据用于兼容
const ruralResettlementTasks = ruralResettlementTasksByYear[2026];
const preparationTasks = preparationTasksByYear[2026];
const enterpriseTasks = enterpriseTasksByYear[2026];
const facilityTasks = facilityTasksByYear[2026];
const cleanupTasks = cleanupTasksByYear[2026];

// 5移民安置验收子任务
const acceptanceTasks = [
  { id: 1, name: "自验工作", count: 0, start: 6, duration: 1, status: "未开始", color: "bg-muted-foreground" },
  { id: 2, name: "初验申请", count: 0, start: 7, duration: 1, status: "未开始", color: "bg-muted-foreground" },
  { id: 3, name: "市级验收", count: 0, start: 8, duration: 1, status: "未开始", color: "bg-muted-foreground" },
  { id: 4, name: "省级终验", count: 0, start: 9, duration: 1, status: "未开始", color: "bg-muted-foreground" },
  { id: 5, name: "档案移交", count: 0, start: 10, duration: 1, status: "未开始", color: "bg-muted-foreground" },
];

// 所有任务数据映射 - 按年份
const taskDataMapByYear: Record<string, { [key: number]: any[] }> = {
  "0移民安置实施准备": preparationTasksByYear,
  "1农村移民安置": ruralResettlementTasksByYear,
  "2企事业单位": enterpriseTasksByYear,
  "3专项设施复改建": facilityTasksByYear,
  "4库底清理": cleanupTasksByYear,
  "5移民安置验收": acceptanceTasksByYear,
};

// 兼容旧版数据映射
const taskDataMap: Record<string, any[]> = {
  "0移民安置实施准备": preparationTasks,
  "1农村移民安置": ruralResettlementTasks,
  "2企事业单位": enterpriseTasks,
  "3专项设施复改建": facilityTasks,
  "4库底清理": cleanupTasks,
  "5移民安置验收": acceptanceTasksByYear[2026],
};

// 重要数据
const importantData = [
  { label: "涉及乡镇", value: "2", unit: "个", icon: Building2, color: "bg-green-500", textColor: "text-green-500" },
  { label: "涉及行政村", value: "6", unit: "个", icon: MapPin, color: "bg-blue-500", textColor: "text-blue-500" },
  { label: "户数", value: "242", unit: "户", icon: Home, color: "bg-red-500", textColor: "text-red-500" },
  { label: "人数", value: "565", unit: "人", icon: Users, color: "bg-yellow-500", textColor: "text-yellow-500" },
  { label: "房屋面积", value: "2.48", unit: "万㎡", icon: Building, color: "bg-green-500", textColor: "text-green-500" },
  { label: "永久用地", value: "1989.96", unit: "亩", icon: Trees, color: "bg-blue-500", textColor: "text-blue-500" },
  { label: "临时用地", value: "373.37", unit: "亩", icon: Warehouse, color: "bg-red-500", textColor: "text-red-500" },
  { label: "集体非宅", value: "32", unit: "处", icon: Landmark, color: "bg-yellow-500", textColor: "text-yellow-500" },
  { label: "公益性设施", value: "3", unit: "个", icon: null, color: "bg-green-500", textColor: "text-green-500", customIcon: "公" },
  { label: "坟墓", value: "365", unit: "个", icon: null, color: "bg-blue-500", textColor: "text-blue-500", customIcon: "墓" },
  { label: "企业", value: "2", unit: "家", icon: Building2, color: "bg-red-500", textColor: "text-red-500" },
  { label: "事业单位", value: "4", unit: "家", icon: Briefcase, color: "bg-yellow-500", textColor: "text-yellow-500" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { userInfo } = useAdmin();
  const [dataPage, setDataPage] = useState(0);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [milestoneIndex, setMilestoneIndex] = useState(0);
  const [showDemolitionProgress, setShowDemolitionProgress] = useState(false);
  const [selectedYearPlan, setSelectedYearPlan] = useState<number | null>(null);
  const [showYearlyInvestment, setShowYearlyInvestment] = useState(false);
  const [showFundCompletion, setShowFundCompletion] = useState(false);
  const [currentGanttYear, setCurrentGanttYear] = useState(2026);
  const [taskModalYear, setTaskModalYear] = useState(2026);
  
  // 展开/收起状态管理
  const [expandedSections, setExpandedSections] = useState({
    projectOverview: false,
    workBriefing: false,
    workProgress: false,
    immigrantFunds: false,
    immigrantEvents: false,
  });
  
  // 切换展开/收起
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 自动轮播重要数据
  useEffect(() => {
    const timer = setInterval(() => {
      setDataPage((prev) => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // 自动轮播大事记
  useEffect(() => {
    const timer = setInterval(() => {
      setMilestoneIndex((prev) => (prev + 1) % milestoneEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 处理任务点击
  const handleTaskClick = (taskName: string) => {
    if (taskDataMap[taskName]) {
      setSelectedTask(taskName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col pb-20">
      {/* Status Bar */}
      <div className="status-bar-height flex items-center justify-between px-4 bg-white/80 backdrop-blur-xl">
        <span className="text-slate-700 font-semibold text-[15px]">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="w-[18px] h-3 bg-slate-700 rounded-sm" />
          <div className="w-4 h-3 bg-slate-700 rounded-sm" />
          <div className="w-6 h-3 bg-emerald-500 rounded-[3px]" />
        </div>
      </div>

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Hello, {userInfo?.username || "管理员"}</h1>
          <p className="text-xs text-slate-500">二道河水库工程</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 项目概述 - 可展开收起 */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('projectOverview')}
            className="w-full flex items-center gap-3 py-3 bg-white/80 backdrop-blur-xl rounded-2xl px-4 shadow-sm border border-slate-200/50 hover:shadow-lg hover:border-indigo-200/50 transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-base font-bold text-slate-800">项目概述</h2>
              <p className="text-xs text-slate-500">工程概况 · 移民概况 · 重要数据</p>
            </div>
            <div className={`transform transition-transform duration-300 ${expandedSections.projectOverview ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          </button>
          
          {expandedSections.projectOverview && (
            <div className="space-y-3">
              {/* 工程概况 - 独立卡片 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/50 shadow-sm hover:shadow-lg transition-shadow">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">
                  工程概况
                </h3>
                <p className="text-sm text-gray-600 leading-7 indent-8">
                  二道河水库工程位于大石河流域上游，主坝位于北京市房山区佛子庄乡佛子庄村。水库总库容7632万立方米，属于中型水库，工程施工总工期共58个月。水库大坝是北京市首座碾压混凝土重力坝，坝高100米，为目前北京市最高大坝。水库任务以防洪为主，为改善生态环境创造条件。主要建设内容包括碾压混凝土重力坝、泄水建筑物、水库管理站、改移道路等。
                </p>
              </div>

              {/* 移民概况 - 独立卡片 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/50 shadow-sm hover:shadow-lg transition-shadow">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">
                  移民概况
                </h3>
                <p className="text-sm text-gray-600 leading-7 indent-8">
                  房山区二道河水库建设工程建设征地涉及北京市房山区2个乡（镇）4个行政村，涉及总土地面积2363.33亩，其中永久用地1989.96亩，临时用地373.37亩。本工程涉及搬迁人口251户496人，拆迁各类房屋2.54万m²。涉及企事业单位6处。规划水平年生产安置人口21人，搬迁安置人口496人。移民安置补偿投资为270396.45万元。
                </p>
              </div>

              {/* Important Data - 2x3轮播 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/50 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-800">
                    重要数据
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDataPage(0)}
                      className={`w-2 h-2 rounded-full transition-colors ${dataPage === 0 ? 'bg-amber-400' : 'bg-amber-200'}`}
                    />
                    <button
                      onClick={() => setDataPage(1)}
                      className={`w-2 h-2 rounded-full transition-colors ${dataPage === 1 ? 'bg-amber-400' : 'bg-amber-200'}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  {importantData.slice(dataPage * 6, dataPage * 6 + 6).map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-slate-50/80 rounded-xl p-3">
                      <div className={`w-10 h-10 rounded-full ${item.color}/20 flex items-center justify-center flex-shrink-0`}>
                        {item.icon ? (
                          <item.icon className={`w-5 h-5 ${item.textColor}`} />
                        ) : (
                          <div className={`w-5 h-5 border-2 ${item.textColor.replace('text', 'border')} rounded flex items-center justify-center`}>
                            <span className={`text-[10px] ${item.textColor}`}>{item.customIcon}</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 truncate">{item.label}</p>
                        <p className="text-base font-bold text-slate-800">{item.value}<span className="text-xs font-normal text-slate-400 ml-0.5">{item.unit}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 工作简报 - 可展开收起 */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('workBriefing')}
            className="w-full flex items-center gap-3 py-3 bg-white/80 backdrop-blur-xl rounded-2xl px-4 shadow-sm border border-slate-200/50 hover:shadow-lg hover:border-amber-200/50 transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200/50">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-base font-bold text-slate-800">工作简报</h2>
              <p className="text-xs text-slate-500">主要工作进展 · 工作动态</p>
            </div>
            <div className={`transform transition-transform duration-300 ${expandedSections.workBriefing ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          </button>
          
          {expandedSections.workBriefing && (
            <div className="space-y-3">
              {/* 主要工作进展 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/50 shadow-sm hover:shadow-lg transition-shadow">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">
                  主要工作进展
                </h4>
                <div className="text-sm text-gray-600 leading-6 space-y-2">
                  <p>（一）正式确权：两乡确权公示 237 宗宅基地（佛子庄乡 228 宗，南窖乡 9 宗）。</p>
                  <p>（二）正式签约：完成签约 236 户（佛子庄乡 227 户，南窖乡 9 户，宅基地签约率 99%）（今日较前一日无变化）。</p>
                  <p>（三）已交房：两乡累计交房 228 户（佛子庄乡 220 户，南窖乡 8 户）。</p>
                  <p>（四）已拆除：今日拆除 3 户房屋。截至目前，佛子庄乡累计拆除 57 户。</p>
                  <p>（五）协议过审：今日完成组卷 43 户，正在按评审意见完善，累计送审 100 户。截至目前，累计完成组卷过审 22 户。</p>
                </div>
              </div>

              {/* 工作动态 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/50 shadow-sm hover:shadow-lg transition-shadow">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">
                  工作动态
                </h4>
                <p className="text-sm text-gray-600 leading-6">
                  佛子庄乡水库工作专班积极与拆评测公司对接，加快组卷报审工作。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 工作进度 - 可展开收起 */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('workProgress')}
            className="w-full flex items-center gap-3 py-3 bg-white/80 backdrop-blur-xl rounded-2xl px-4 shadow-sm border border-slate-200/50 hover:shadow-lg hover:border-emerald-200/50 transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-base font-bold text-slate-800">工作进度</h2>
              <p className="text-xs text-slate-500">统计概览 · 甘特图</p>
            </div>
            <div className={`transform transition-transform duration-300 ${expandedSections.workProgress ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          </button>
          
          {expandedSections.workProgress && (
            <div className="space-y-3">
              {/* Stats Overview - 点击弹出拆迁进度 */}
              <button
                onClick={() => setShowDemolitionProgress(true)}
                className="w-full bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/50 shadow-sm hover:shadow-lg hover:border-emerald-200/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-around">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <span className={`text-[24px] font-bold ${stat.color}`}>
                        {stat.value}
                        {stat.unit && <span className="text-sm">{stat.unit}</span>}
                      </span>
                      <span className="text-xs text-slate-500 mt-1">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </button>

              {/* Gantt Chart Direct Display */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/50 shadow-sm">
                {/* Timeline Header with Year Switcher */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 font-medium">{currentGanttYear}年进度计划</span>
                  </div>
                  {/* Year Switcher */}
                  <div className="flex items-center gap-1 bg-slate-100/80 rounded-lg p-1">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => setCurrentGanttYear(year)}
                        className={`px-2 py-1 text-[11px] rounded-md transition-colors ${
                          currentGanttYear === year
                            ? "bg-gradient-to-br from-emerald-400 to-teal-400 text-white"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gantt Chart */}
                <div className="space-y-2.5">
                  {/* Month Headers */}
                  <div className="flex items-center">
                    <div className="w-20 flex-shrink-0" />
                    <div className="flex-1 flex">
                      {months.map((month, index) => (
                        <div key={index} className="flex-1 text-center text-[10px] text-muted-foreground border-l border-border first:border-l-0">
                          {month}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gantt Bars */}
                  {ganttDataByYear[currentGanttYear].map((task, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      {/* Task Name */}
                      <div className="w-20 flex-shrink-0 flex items-center gap-1">
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <span className="text-[6px] text-white">📁</span>
                        </div>
                        <button
                          onClick={() => handleTaskClick(task.name)}
                          className="text-[10px] text-foreground truncate hover:text-primary cursor-pointer underline decoration-dotted"
                        >
                          {task.name}
                        </button>
                      </div>
                      {/* Timeline Bar */}
                      <div className="flex-1 h-4 bg-secondary rounded-full relative overflow-hidden">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex">
                          {months.map((_, i) => (
                            <div key={i} className="flex-1 border-l border-border/50 first:border-l-0" />
                          ))}
                        </div>
                        {/* Current Time Indicator (5月) */}
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-danger z-10"
                          style={{ left: `${(4 / 11) * 100}%` }}
                        />
                        {/* Progress Bar */}
                        <div
                          className={`absolute h-full rounded-full ${task.color} opacity-80`}
                          style={{
                            left: `${((task.start - 1) / 11) * 100}%`,
                            width: `${(task.duration / 11) * 100}%`,
                          }}
                        >
                          {/* Progress Fill */}
                          <div
                            className="h-full bg-white/40 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-3 pt-3 border-t border-slate-200/80">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-gradient-to-br from-indigo-400 to-purple-400 rounded" />
                      <span className="text-[10px] text-slate-500">进行中</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-gradient-to-br from-emerald-400 to-teal-400 rounded" />
                      <span className="text-[10px] text-slate-500">已完成</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-gradient-to-br from-rose-400 to-pink-400 rounded" />
                      <span className="text-[10px] text-slate-500">延期</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-slate-300 rounded" />
                      <span className="text-[10px] text-slate-500">未开始</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 移民资金 - 可展开收起 */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('immigrantFunds')}
            className="w-full flex items-center gap-3 py-3 bg-white/80 backdrop-blur-xl rounded-2xl px-4 shadow-sm border border-slate-200/50 hover:shadow-lg hover:border-violet-200/50 transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200/50">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-base font-bold text-slate-800">移民资金</h2>
              <p className="text-xs text-slate-500">资金概览 · 饼图 · 折线图</p>
            </div>
            <div className={`transform transition-transform duration-300 ${expandedSections.immigrantFunds ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          </button>
          
          {expandedSections.immigrantFunds && (
            <div className="space-y-3">
              {/* 资金概览 - 独立卡片 */}
              <button
                onClick={() => setShowFundCompletion(true)}
                className="w-full bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/50 shadow-sm hover:shadow-lg hover:border-violet-200/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-around">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-500 mb-1">规划总投资</span>
                    <span className="text-xl font-bold text-slate-800">29.8<span className="text-sm font-normal">亿元</span></span>
                  </div>
                  <div className="w-px h-10 bg-slate-200" />
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-500 mb-1">累计完成投资</span>
                    <span className="text-xl font-bold text-emerald-500">18.6<span className="text-sm font-normal">亿元</span></span>
                  </div>
                  <div className="w-px h-10 bg-slate-200" />
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-500 mb-1">资金完成比例</span>
                    <span className="text-xl font-bold text-violet-500">30<span className="text-sm font-normal">%</span></span>
                  </div>
                </div>
              </button>

              {/* 规划报告成果 - 独立卡片 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/50 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 mb-3 text-center">
                  规划报告成果（万元）
                </h3>
                <div className="flex items-center gap-4">
                  {/* 饼图 SVG */}
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* 工程建设费 65% */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#F97316" strokeWidth="20" strokeDasharray="163 251" />
                      {/* 补偿补助费 10% */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="20" strokeDasharray="25 251" strokeDashoffset="-163" />
                      {/* 被征地农民社会保障费 7% */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#84CC16" strokeWidth="20" strokeDasharray="18 251" strokeDashoffset="-188" />
                      {/* 有关税费 7% */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#06B6D4" strokeWidth="20" strokeDasharray="18 251" strokeDashoffset="-206" />
                      {/* 预备费 5% */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#EAB308" strokeWidth="20" strokeDasharray="13 251" strokeDashoffset="-224" />
                      {/* 其他费用 6% */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#9CA3AF" strokeWidth="20" strokeDasharray="15 251" strokeDashoffset="-237" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground">占比</span>
                    </div>
                  </div>
                  {/* 图例 */}
                  <div className="flex-1 grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-sm bg-orange-500" />
                      <span className="text-muted-foreground">工程建设费 65%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-sm bg-blue-500" />
                      <span className="text-muted-foreground">补偿补助费 10%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-sm bg-lime-500" />
                      <span className="text-muted-foreground">社会保障费 7%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-sm bg-cyan-500" />
                      <span className="text-muted-foreground">有关税费 7%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-sm bg-yellow-500" />
                      <span className="text-muted-foreground">预备费 5%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-sm bg-gray-400" />
                      <span className="text-muted-foreground">其他费用 6%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 分年度投资情况 - 独立卡片 - 折线图 */}
              <div className="bg-card rounded-2xl p-4 border border-border">
                <h3 className="text-sm font-semibold text-slate-800 mb-3 text-center">
                  分年度投资情况（万元）
                </h3>
                {/* 图表区域 - 图例在右侧 */}
                <div className="flex items-center gap-2">
                  {/* 折线图 SVG */}
                  <div className="h-28 flex-1">
                    <svg viewBox="0 0 260 105" className="w-full h-full">
                      {/* 网格线 */}
                      <line x1="30" y1="10" x2="240" y2="10" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1="30" y1="35" x2="240" y2="35" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1="30" y1="60" x2="240" y2="60" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1="30" y1="85" x2="240" y2="85" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" />
                      
                      {/* Y轴 */}
                      <line x1="30" y1="10" x2="30" y2="85" stroke="#9ca3af" strokeWidth="1" />
                      {/* X轴 */}
                      <line x1="30" y1="85" x2="240" y2="85" stroke="#9ca3af" strokeWidth="1" />
                      
                      {/* 红色线 - 计划资金 */}
                      <polyline 
                        points="55,20 100,45 145,82 190,20" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      {/* 红色数据点 */}
                      <circle cx="55" cy="20" r="3" fill="#ef4444" />
                      <circle cx="100" cy="45" r="3" fill="#ef4444" />
                      <circle cx="145" cy="82" r="3" fill="#ef4444" />
                      <circle cx="190" cy="20" r="3" fill="#ef4444" />
                      
                      {/* 蓝色线 - 实际使用资金 */}
                      <polyline 
                        points="55,25 100,50 145,80 190,25" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      {/* 蓝色数据点 */}
                      <circle cx="55" cy="25" r="3" fill="#3b82f6" />
                      <circle cx="100" cy="50" r="3" fill="#3b82f6" />
                      <circle cx="145" cy="80" r="3" fill="#3b82f6" />
                      <circle cx="190" cy="25" r="3" fill="#3b82f6" />
                      
                      {/* Y轴数值标签 */}
                      <text x="25" y="13" textAnchor="end" className="fill-muted-foreground" style={{fontSize: '7px'}}>40000</text>
                      <text x="25" y="38" textAnchor="end" className="fill-muted-foreground" style={{fontSize: '7px'}}>30000</text>
                      <text x="25" y="63" textAnchor="end" className="fill-muted-foreground" style={{fontSize: '7px'}}>20000</text>
                      <text x="25" y="88" textAnchor="end" className="fill-muted-foreground" style={{fontSize: '7px'}}>10000</text>
                      
                      {/* X轴年份标签 - 与数据点对齐 */}
                      <text x="55" y="95" textAnchor="middle" className="fill-muted-foreground" style={{fontSize: '8px'}}>2025</text>
                      <text x="100" y="95" textAnchor="middle" className="fill-muted-foreground" style={{fontSize: '8px'}}>2026</text>
                      <text x="145" y="95" textAnchor="middle" className="fill-muted-foreground" style={{fontSize: '8px'}}>2027</text>
                      <text x="190" y="95" textAnchor="middle" className="fill-muted-foreground" style={{fontSize: '8px'}}>2028</text>
                      
                      {/* 透明点击区域 - 用于年份选择 */}
                      <rect x="35" y="85" width="40" height="20" fill="transparent" className="cursor-pointer hover:fill-primary/10" onClick={() => setSelectedYearPlan(2025)} />
                      <rect x="80" y="85" width="40" height="20" fill="transparent" className="cursor-pointer hover:fill-primary/10" onClick={() => setSelectedYearPlan(2026)} />
                      <rect x="125" y="85" width="40" height="20" fill="transparent" className="cursor-pointer hover:fill-primary/10" onClick={() => setSelectedYearPlan(2027)} />
                      <rect x="170" y="85" width="40" height="20" fill="transparent" className="cursor-pointer hover:fill-primary/10" onClick={() => setSelectedYearPlan(2028)} />
                    </svg>
                  </div>
                  {/* 图例 - 在右侧垂直排列 */}
                  <div className="flex flex-col gap-2 pr-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-0.5 bg-red-500" />
                      <span className="text-[9px] text-muted-foreground whitespace-nowrap">计划资金</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-0.5 bg-blue-500" />
                      <span className="text-[9px] text-muted-foreground whitespace-nowrap">实际使用</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 移民大事记 - 可展开收起 */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('immigrantEvents')}
            className="w-full flex items-center gap-3 py-3 bg-white/80 backdrop-blur-xl rounded-2xl px-4 shadow-sm border border-slate-200/50 hover:shadow-lg hover:border-rose-200/50 transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200/50">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-base font-bold text-slate-800">移民大事记</h2>
              <p className="text-xs text-slate-500">重要里程碑事件</p>
            </div>
            <div className={`transform transition-transform duration-300 ${expandedSections.immigrantEvents ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          </button>
          
          {expandedSections.immigrantEvents && (
            <div className="space-y-3">
              {/* 轮播指示器 */}
              <div className="flex items-center justify-center gap-1.5">
                {milestoneEvents.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setMilestoneIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      milestoneIndex === index ? 'bg-rose-400' : 'bg-rose-200'
                    }`}
                  />
                ))}
              </div>

              {/* 轮播内容 - 独立卡片 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/50 shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden rounded-xl">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${milestoneIndex * 100}%)` }}
                  >
                    {milestoneEvents.map((event, index) => (
                      <div key={event.id} className="w-full flex-shrink-0">
                        {/* 图片 */}
                        <div className="relative h-36 bg-slate-100 overflow-hidden rounded-xl">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                            <span className="text-[11px] text-white bg-black/40 px-2.5 py-1 rounded-full">
                              {event.date}
                            </span>
                          </div>
                        </div>
                        {/* 文字内容 */}
                        <div className="p-4 bg-slate-50/80">
                          <h3 className="text-sm font-semibold text-slate-800 mb-1">{event.title}</h3>
                          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 左右切换按钮 */}
                  <button
                    onClick={() => setMilestoneIndex((prev) => (prev - 1 + milestoneEvents.length) % milestoneEvents.length)}
                    className="absolute left-2 top-12 w-8 h-8 bg-white/95 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <button
                    onClick={() => setMilestoneIndex((prev) => (prev + 1) % milestoneEvents.length)}
                    className="absolute right-2 top-12 w-8 h-8 bg-white/95 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>



      {/* Bottom Navigation */}
      <BottomNav />

      {/* 任务详情弹窗 */}
      {selectedTask && taskDataMapByYear[selectedTask] && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="h-14 flex items-center justify-between px-5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📁</span>
                </div>
                <h2 className="text-lg font-semibold text-foreground">{selectedTask}</h2>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Year Switcher */}
              <div className="flex items-center justify-center gap-1 bg-secondary/30 rounded-lg p-1 mb-4">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setTaskModalYear(year)}
                    className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                      taskModalYear === year
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {year}年
                  </button>
                ))}
              </div>

              {/* Sub Tasks Gantt Chart */}
              <div className="space-y-3">
                {/* Month Headers */}
                <div className="flex items-center">
                  <div className="w-32 flex-shrink-0" />
                  <div className="flex-1 flex">
                    {["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月"].map((month, index) => (
                      <div key={index} className="flex-1 text-center text-[10px] text-muted-foreground border-l border-border first:border-l-0">
                        {month}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Task Rows */}
                {taskDataMapByYear[selectedTask][taskModalYear]?.map((task: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    {/* Task Info */}
                    <div className="w-32 flex-shrink-0 flex items-center gap-1.5">
                      <div className="w-4 h-4 bg-primary rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] text-white">▶</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground truncate">{task.name}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">({task.count})</span>
                    </div>
                    {/* Timeline Bar */}
                    <div className="flex-1 h-6 bg-secondary rounded-full relative overflow-hidden">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex">
                        {Array(11).fill(null).map((_, i) => (
                          <div key={i} className="flex-1 border-l border-border/30 first:border-l-0" />
                        ))}
                      </div>
                      {/* Current Time Indicator (5月) */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-danger z-10"
                        style={{ left: `${(4 / 11) * 100}%` }}
                      />
                      {/* Progress Bar */}
                      <div
                        className={`absolute h-full rounded-full ${task.color} opacity-80 flex items-center justify-center`}
                        style={{
                          left: `${((task.start - 1) / 11) * 100}%`,
                          width: `${(task.duration / 11) * 100}%`,
                        }}
                      >
                        <span className="text-[9px] text-white font-medium px-1 truncate">{task.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">图例说明</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-primary rounded" />
                    <span className="text-xs text-secondary-foreground">进行中</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-danger rounded" />
                    <span className="text-xs text-secondary-foreground">延期</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span className="text-xs text-secondary-foreground">已完成</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-muted-foreground rounded" />
                    <span className="text-xs text-secondary-foreground">未开始</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 拆迁进度弹窗 */}
      {showDemolitionProgress && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="h-14 flex items-center justify-between px-5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📊</span>
                </div>
                <h2 className="text-lg font-semibold text-foreground">拆迁进度</h2>
              </div>
              <button onClick={() => setShowDemolitionProgress(false)} className="text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-2 gap-5">
                {/* 已签约 */}
                <div className="flex flex-col items-center bg-secondary/30 rounded-xl p-4">
                  <div className="relative w-24 h-12 mb-3">
                    <svg viewBox="0 0 100 50" className="w-full h-full">
                      <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 50 10 A 40 40 0 0 1 90 50" fill="none" stroke="#84CC16" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#EAB308" strokeWidth="8" strokeLinecap="round" strokeDasharray="60 126" strokeDashoffset="0" />
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" strokeDasharray="30 126" strokeDashoffset="-60" />
                    </svg>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-base font-bold text-blue-500">99%</div>
                  </div>
                  <p className="text-lg text-foreground font-semibold">240<span className="text-sm text-muted-foreground ml-1">已签约</span></p>
                </div>
                {/* 已组卷 */}
                <div className="flex flex-col items-center bg-secondary/30 rounded-xl p-4">
                  <div className="relative w-24 h-12 mb-3">
                    <svg viewBox="0 0 100 50" className="w-full h-full">
                      <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 50 10 A 40 40 0 0 1 90 50" fill="none" stroke="#84CC16" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#EAB308" strokeWidth="8" strokeLinecap="round" strokeDasharray="60 126" strokeDashoffset="0" />
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" strokeDasharray="30 126" strokeDashoffset="-60" />
                    </svg>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-base font-bold text-blue-500">97%</div>
                  </div>
                  <p className="text-lg text-foreground font-semibold">236<span className="text-sm text-muted-foreground ml-1">已组卷</span></p>
                </div>
                {/* 已过审 */}
                <div className="flex flex-col items-center bg-secondary/30 rounded-xl p-4">
                  <div className="relative w-24 h-12 mb-3">
                    <svg viewBox="0 0 100 50" className="w-full h-full">
                      <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 50 10 A 40 40 0 0 1 90 50" fill="none" stroke="#84CC16" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#EAB308" strokeWidth="8" strokeLinecap="round" strokeDasharray="60 126" strokeDashoffset="0" />
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" strokeDasharray="30 126" strokeDashoffset="-60" />
                    </svg>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-base font-bold text-blue-500">97%</div>
                  </div>
                  <p className="text-lg text-foreground font-semibold">236<span className="text-sm text-muted-foreground ml-1">已过审</span></p>
                </div>
                {/* 已拆除 */}
                <div className="flex flex-col items-center bg-secondary/30 rounded-xl p-4">
                  <div className="relative w-24 h-12 mb-3">
                    <svg viewBox="0 0 100 50" className="w-full h-full">
                      <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 50 10 A 40 40 0 0 1 90 50" fill="none" stroke="#84CC16" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#EAB308" strokeWidth="8" strokeLinecap="round" strokeDasharray="60 126" strokeDashoffset="0" />
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" strokeDasharray="30 126" strokeDashoffset="-60" />
                    </svg>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-base font-bold text-blue-500">94%</div>
                  </div>
                  <p className="text-lg text-foreground font-semibold">229<span className="text-sm text-muted-foreground ml-1">已拆除</span></p>
                </div>
              </div>

              {/* 统计摘要 */}
              <div className="mt-5 pt-4 border-t border-border">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xl font-bold text-foreground">242</p>
                    <p className="text-xs text-muted-foreground">总户数</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xl font-bold text-green-500">237</p>
                    <p className="text-xs text-muted-foreground">已完成</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xl font-bold text-warning">5</p>
                    <p className="text-xs text-muted-foreground">进行中</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 年度资金计划弹窗 */}
      {selectedYearPlan && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl w-full max-w-sm max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="h-14 flex items-center justify-between px-5 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">{selectedYearPlan}年资金计划（万元）</h2>
              <button onClick={() => setSelectedYearPlan(null)} className="text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* 环形图和图例 */}
              <div className="flex items-center gap-4">
                {/* 环形图 */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {/* 农村部分 39% - 蓝色 */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="12" strokeDasharray="98 251" />
                    {/* 企事业 20% - 紫色 */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#A855F7" strokeWidth="12" strokeDasharray="50 251" strokeDashoffset="-98" />
                    {/* 专项设施 19% - 黄色 */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#EAB308" strokeWidth="12" strokeDasharray="48 251" strokeDashoffset="-148" />
                    {/* 库底清理 9% - 绿色 */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#22C55E" strokeWidth="12" strokeDasharray="23 251" strokeDashoffset="-196" />
                    {/* 其他 13% - 橙色 */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#F97316" strokeWidth="12" strokeDasharray="33 251" strokeDashoffset="-219" />
                  </svg>
                  {/* 中心文字 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-muted-foreground">总计划</span>
                    <span className="text-lg font-bold text-foreground">9.8亿</span>
                  </div>
                </div>
                
                {/* 图例 */}
                <div className="flex-1 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">农村部分 39%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="text-muted-foreground">企事业 20%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground">专项设施 19%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">库底清理 9%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span className="text-muted-foreground">其他 13%</span>
                  </div>
                </div>
              </div>
              
              {/* 表格数据 */}
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="py-2 px-2 text-center text-muted-foreground font-medium">项目</th>
                      <th className="py-2 px-2 text-center text-muted-foreground font-medium">占比</th>
                      <th className="py-2 px-2 text-center text-muted-foreground font-medium">金额（万元）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">农村部分</td>
                      <td className="py-2 px-2 text-blue-500 text-center">39%</td>
                      <td className="py-2 px-2 text-foreground text-center">38,220</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">企事业</td>
                      <td className="py-2 px-2 text-purple-500 text-center">20%</td>
                      <td className="py-2 px-2 text-foreground text-center">19,600</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">专项设施</td>
                      <td className="py-2 px-2 text-yellow-500 text-center">19%</td>
                      <td className="py-2 px-2 text-foreground text-center">18,620</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">库底清理</td>
                      <td className="py-2 px-2 text-green-500 text-center">9%</td>
                      <td className="py-2 px-2 text-foreground text-center">8,820</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">其他</td>
                      <td className="py-2 px-2 text-orange-500 text-center">13%</td>
                      <td className="py-2 px-2 text-foreground text-center">12,740</td>
                    </tr>
                    <tr className="bg-secondary/30 font-medium">
                      <td className="py-2 px-2 text-foreground text-center">合计</td>
                      <td className="py-2 px-2 text-foreground text-center">100%</td>
                      <td className="py-2 px-2 text-foreground text-center">98,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 年度投资情况表格弹窗 */}
      {showYearlyInvestment && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl w-full max-w-sm max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="h-14 flex items-center justify-between px-5 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">分年度投资情况（万元）</h2>
              <button onClick={() => setShowYearlyInvestment(false)} className="text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* 年度投资表格 */}
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="py-2.5 px-2 text-center text-muted-foreground font-medium">年份</th>
                      <th className="py-2.5 px-2 text-center text-muted-foreground font-medium">计划资金</th>
                      <th className="py-2.5 px-2 text-center text-muted-foreground font-medium">实际使用</th>
                      <th className="py-2.5 px-2 text-center text-muted-foreground font-medium">完成率</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 px-2 text-foreground text-center font-medium">2025</td>
                      <td className="py-2.5 px-2 text-foreground text-center">37,656</td>
                      <td className="py-2.5 px-2 text-foreground text-center">35,000</td>
                      <td className="py-2.5 px-2 text-green-500 text-center">93%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 px-2 text-foreground text-center font-medium">2026</td>
                      <td className="py-2.5 px-2 text-foreground text-center">19,990</td>
                      <td className="py-2.5 px-2 text-foreground text-center">18,000</td>
                      <td className="py-2.5 px-2 text-green-500 text-center">90%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 px-2 text-foreground text-center font-medium">2027</td>
                      <td className="py-2.5 px-2 text-foreground text-center">500</td>
                      <td className="py-2.5 px-2 text-foreground text-center">450</td>
                      <td className="py-2.5 px-2 text-green-500 text-center">90%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 px-2 text-foreground text-center font-medium">2028</td>
                      <td className="py-2.5 px-2 text-foreground text-center">37,656</td>
                      <td className="py-2.5 px-2 text-foreground text-center">35,000</td>
                      <td className="py-2.5 px-2 text-green-500 text-center">93%</td>
                    </tr>
                    <tr className="bg-secondary/30 font-medium">
                      <td className="py-2.5 px-2 text-foreground text-center">合计</td>
                      <td className="py-2.5 px-2 text-foreground text-center">95,802</td>
                      <td className="py-2.5 px-2 text-foreground text-center">88,450</td>
                      <td className="py-2.5 px-2 text-green-500 text-center">92%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 资金完成情况表格弹窗 */}
      {showFundCompletion && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="h-14 flex items-center justify-between px-5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm">💰</span>
                </div>
                <h2 className="text-lg font-semibold text-foreground">资金完成情况（万元）</h2>
              </div>
              <button onClick={() => setShowFundCompletion(false)} className="text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* 资金完成情况表格 */}
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="py-2 px-2 text-center text-muted-foreground font-medium">序号</th>
                      <th className="py-2 px-2 text-center text-muted-foreground font-medium">项目</th>
                      <th className="py-2 px-2 text-center text-muted-foreground font-medium">规划投资</th>
                      <th className="py-2 px-2 text-center text-muted-foreground font-medium">完成投资</th>
                      <th className="py-2 px-2 text-center text-muted-foreground font-medium">完成比例</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">1</td>
                      <td className="py-2 px-2 text-foreground text-center">农村部分</td>
                      <td className="py-2 px-2 text-foreground text-center">40,131.35</td>
                      <td className="py-2 px-2 text-foreground text-center">13,377.12</td>
                      <td className="py-2 px-2 text-green-500 text-center">33%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">2</td>
                      <td className="py-2 px-2 text-foreground text-center">企（事）业单位</td>
                      <td className="py-2 px-2 text-foreground text-center">5,300.00</td>
                      <td className="py-2 px-2 text-foreground text-center">1,766.67</td>
                      <td className="py-2 px-2 text-green-500 text-center">33%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">3</td>
                      <td className="py-2 px-2 text-foreground text-center">专项设施</td>
                      <td className="py-2 px-2 text-foreground text-center">19,753.24</td>
                      <td className="py-2 px-2 text-foreground text-center">6,584.41</td>
                      <td className="py-2 px-2 text-green-500 text-center">33%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">4</td>
                      <td className="py-2 px-2 text-foreground text-center">库底清理</td>
                      <td className="py-2 px-2 text-foreground text-center">80.00</td>
                      <td className="py-2 px-2 text-foreground text-center">26.67</td>
                      <td className="py-2 px-2 text-green-500 text-center">33%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">5</td>
                      <td className="py-2 px-2 text-foreground text-center">移民安置数字孪生建设</td>
                      <td className="py-2 px-2 text-foreground text-center">144.00</td>
                      <td className="py-2 px-2 text-foreground text-center">48.00</td>
                      <td className="py-2 px-2 text-green-500 text-center">33%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">6</td>
                      <td className="py-2 px-2 text-foreground text-center">其他费用</td>
                      <td className="py-2 px-2 text-foreground text-center">8,364.56</td>
                      <td className="py-2 px-2 text-foreground text-center">2,788.19</td>
                      <td className="py-2 px-2 text-green-500 text-center">33%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">7</td>
                      <td className="py-2 px-2 text-foreground text-center">预备费</td>
                      <td className="py-2 px-2 text-foreground text-center">0.00</td>
                      <td className="py-2 px-2 text-foreground text-center">0.00</td>
                      <td className="py-2 px-2 text-muted-foreground text-center">0%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 text-foreground text-center">8</td>
                      <td className="py-2 px-2 text-foreground text-center">有关税费</td>
                      <td className="py-2 px-2 text-foreground text-center">21,111.70</td>
                      <td className="py-2 px-2 text-foreground text-center">7,037.23</td>
                      <td className="py-2 px-2 text-green-500 text-center">33%</td>
                    </tr>
                    <tr className="bg-secondary/30 font-medium">
                      <td className="py-2 px-2 text-foreground text-center"></td>
                      <td className="py-2 px-2 text-foreground text-center">合计</td>
                      <td className="py-2 px-2 text-foreground text-center">94,884.85</td>
                      <td className="py-2 px-2 text-foreground text-center">31,628.28</td>
                      <td className="py-2 px-2 text-green-500 text-center">33%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
