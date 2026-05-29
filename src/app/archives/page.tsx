"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Folder, 
  FolderOpen, 
  FileText, 
  ChevronRight, 
  ChevronDown,
  ChevronLeft,
  File,
  Image as ImageIcon,
  Video,
  Music,
  Download,
  Eye,
  X,
  Archive,
  Clock,
  HardDrive,
  Filter,
  MoreVertical,
  FileSpreadsheet,
  Presentation,
  FileCode,
  FileJson,
  FileArchive,
  AlertCircle,
  CheckCircle2,
  Loader2,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Info,
  FileStack
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

// 档案目录树数据结构
interface ArchiveNode {
  id: string;
  name: string;
  type: "folder" | "file";
  count?: number;
  children?: ArchiveNode[];
  fileType?: "pdf" | "doc" | "docx" | "xls" | "xlsx" | "ppt" | "pptx" | "image" | "video" | "audio" | "txt" | "zip" | "other";
  size?: string;
  date?: string;
  description?: string;
  category?: string;
  // 档案详情字段
  archiveNo?: string;
  fileNo?: string;
  archiveType?: string;
  reviewStatus?: string;
  reviewProgress?: string;
  retentionPeriod?: string;
  securityLevel?: string;
  creator?: string;
  createTime?: string;
  attachments?: { name: string; size: string; type: string }[];
}

// 模拟档案数据
const archiveData: ArchiveNode[] = [
  {
    id: "1",
    name: "全部档案",
    type: "folder",
    count: 362,
    children: [
      {
        id: "personal",
        name: "个人档案",
        type: "folder",
        count: 237,
        children: [
          {
            id: "1-1-1",
            name: "红煤厂村",
            type: "folder",
            count: 195,
            children: [
              { id: "f1", name: "张三_移民安置协议.pdf", type: "file", fileType: "pdf", size: "2.5MB", date: "2024-01-15", category: "个人", description: "移民安置协议文件", archiveNo: "ARCHIVE-20260329-3581", fileNo: "QY-GJCJCZ-SS-1", archiveType: "社会评估类", reviewStatus: "无需评审", reviewProgress: "无需评审", retentionPeriod: "永久", securityLevel: "公开", creator: "admin", createTime: "2026-03-29 18:21:55", attachments: [{ name: "移民安置协议.pdf", size: "2.5MB", type: "pdf" }] },
              { id: "f2", name: "李四_补偿明细表.xlsx", type: "file", fileType: "xlsx", size: "1.2MB", date: "2024-01-14", category: "个人", description: "补偿款明细", archiveNo: "ARCHIVE-20260329-3582", fileNo: "QY-GJCJCZ-SS-2", archiveType: "补偿类", reviewStatus: "已评审", reviewProgress: "已完成", retentionPeriod: "30年", securityLevel: "内部", creator: "admin", createTime: "2026-03-28 10:15:30", attachments: [{ name: "补偿明细表.xlsx", size: "1.2MB", type: "xlsx" }] },
              { id: "f3", name: "王五_身份证明材料.pdf", type: "file", fileType: "pdf", size: "3.1MB", date: "2024-01-13", category: "个人", description: "身份证复印件等", archiveNo: "ARCHIVE-20260329-3583", fileNo: "QY-GJCJCZ-SS-3", archiveType: "身份证明类", reviewStatus: "无需评审", reviewProgress: "无需评审", retentionPeriod: "永久", securityLevel: "内部", creator: "admin", createTime: "2026-03-27 14:20:10", attachments: [{ name: "身份证明材料.pdf", size: "3.1MB", type: "pdf" }] },
              { id: "f4", name: "赵六_房屋评估报告.docx", type: "file", fileType: "docx", size: "5.8MB", date: "2024-01-12", category: "个人", description: "房屋评估详细报告", archiveNo: "ARCHIVE-20260329-3584", fileNo: "QY-GJCJCZ-SS-4", archiveType: "评估类", reviewStatus: "评审中", reviewProgress: "50%", retentionPeriod: "30年", securityLevel: "公开", creator: "admin", createTime: "2026-03-26 09:45:22", attachments: [{ name: "房屋评估报告.docx", size: "5.8MB", type: "docx" }] },
            ]
          },
          { id: "1-1-2", name: "山川村", type: "folder", count: 7 },
          { id: "1-1-3", name: "长操村", type: "folder", count: 2 },
          { id: "1-1-4", name: "佛子庄村", type: "folder", count: 24 },
          { id: "1-1-5", name: "花港村", type: "folder", count: 8 },
        ]
      },
      {
        id: "work",
        name: "工作档案",
        type: "folder",
        count: 73,
        children: [
          {
            id: "1-3-1",
            name: "交通运输工程",
            type: "folder",
            count: 12,
            children: [
              { id: "w1", name: "道路施工图纸.pdf", type: "file", fileType: "pdf", size: "15.6MB", date: "2024-01-10", category: "工作", description: "道路施工详细图纸" },
              { id: "w2", name: "桥梁设计说明.docx", type: "file", fileType: "docx", size: "2.3MB", date: "2024-01-09", category: "工作", description: "桥梁设计方案说明" },
              { id: "w3", name: "工程进度表.xlsx", type: "file", fileType: "xlsx", size: "856KB", date: "2024-01-08", category: "工作", description: "月度工程进度" },
            ]
          },
          { id: "1-3-2", name: "电力设施", type: "folder", count: 8 },
          { id: "1-3-3", name: "通信设施", type: "folder", count: 5 },
        ]
      },
      {
        id: "finance",
        name: "财务档案",
        type: "folder",
        count: 69,
        children: [
          {
            id: "1-4-1",
            name: "支付申请",
            type: "folder",
            count: 45,
            children: [
              { id: "fin1", name: "2024年1月支付申请汇总.xlsx", type: "file", fileType: "xlsx", size: "856KB", date: "2024-01-31", category: "财务", description: "月度支付汇总" },
              { id: "fin2", name: "移民补偿款支付明细.pdf", type: "file", fileType: "pdf", size: "1.5MB", date: "2024-01-30", category: "财务", description: "补偿款支付明细" },
            ]
          },
        ]
      },
      {
        id: "docs",
        name: "文书档案",
        type: "folder",
        count: 25,
        children: [
          { id: "d1", name: "系统需求规格说明书.docx", type: "file", fileType: "docx", size: "3.2MB", date: "2024-01-20", category: "文书", description: "系统需求文档" },
          { id: "d2", name: "项目验收报告.pdf", type: "file", fileType: "pdf", size: "5.1MB", date: "2024-01-18", category: "文书", description: "项目验收报告" },
        ]
      },
      {
        id: "media",
        name: "影像档案",
        type: "folder",
        count: 27,
        children: [
          { id: "m1", name: "项目启动会.mp4", type: "file", fileType: "video", size: "256MB", date: "2024-01-05", category: "影像", description: "项目启动会议录像" },
          { id: "m2", name: "现场勘察照片.jpg", type: "file", fileType: "image", size: "3.5MB", date: "2024-01-08", category: "影像", description: "现场勘察照片" },
          { id: "m3", name: "专家论证会录音.mp3", type: "file", fileType: "audio", size: "45MB", date: "2024-01-12", category: "影像", description: "专家论证会录音" },
        ]
      },
    ]
  }
];

// 分类选项
const categories = [
  { id: "all", name: "全部" },
  { id: "personal", name: "个人" },
  { id: "work", name: "工作" },
  { id: "finance", name: "财务" },
  { id: "docs", name: "文书" },
  { id: "media", name: "影像" },
];

// 排序选项
const sortOptions = [
  { id: "latest", name: "最新更新" },
  { id: "name", name: "名称排序" },
  { id: "size", name: "文件大小" },
];

// 档案类型选项
const archiveTypes = [
  { id: "all", name: "全部类型" },
  { id: "社会评估类", name: "社会评估类" },
  { id: "补偿类", name: "补偿类" },
  { id: "身份证明类", name: "身份证明类" },
  { id: "评估类", name: "评估类" },
];

// 评审状态选项
const reviewStatuses = [
  { id: "all", name: "全部状态" },
  { id: "无需评审", name: "无需评审" },
  { id: "评审中", name: "评审中" },
  { id: "已评审", name: "已评审" },
];

// 保管期限选项
const retentionPeriods = [
  { id: "all", name: "全部期限" },
  { id: "永久", name: "永久" },
  { id: "30年", name: "30年" },
  { id: "10年", name: "10年" },
];

// 档案密级选项
const securityLevels = [
  { id: "all", name: "全部密级" },
  { id: "公开", name: "公开" },
  { id: "内部", name: "内部" },
  { id: "秘密", name: "秘密" },
  { id: "机密", name: "机密" },
];

// 获取文件图标
const getFileIcon = (fileType?: string, className = "w-5 h-5") => {
  switch (fileType) {
    case "pdf":
      return <FileText className={`${className} text-red-500`} />;
    case "doc":
    case "docx":
      return <FileText className={`${className} text-blue-500`} />;
    case "xls":
    case "xlsx":
      return <FileSpreadsheet className={`${className} text-green-500`} />;
    case "ppt":
    case "pptx":
      return <Presentation className={`${className} text-orange-500`} />;
    case "image":
      return <ImageIcon className={`${className} text-purple-500`} />;
    case "video":
      return <Video className={`${className} text-pink-500`} />;
    case "audio":
      return <Music className={`${className} text-yellow-500`} />;
    case "txt":
      return <FileCode className={`${className} text-gray-500`} />;
    case "zip":
      return <FileArchive className={`${className} text-brown-500`} />;
    default:
      return <File className={`${className} text-gray-400`} />;
  }
};

// 递归获取所有文件
const getAllFiles = (nodes: ArchiveNode[]): ArchiveNode[] => {
  let files: ArchiveNode[] = [];
  nodes.forEach(node => {
    if (node.type === "file") {
      files.push(node);
    }
    if (node.children) {
      files = files.concat(getAllFiles(node.children));
    }
  });
  return files;
};

// 递归查找节点
const findNodeById = (nodes: ArchiveNode[], id: string): ArchiveNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export default function ArchivesPage() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["1", "personal", "1-1-1"]));
  const [selectedNode, setSelectedNode] = useState<string>("1-1-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [previewFile, setPreviewFile] = useState<ArchiveNode | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 详情弹窗状态
  const [detailFile, setDetailFile] = useState<ArchiveNode | null>(null);
  
  // 筛选状态
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterArchiveType, setFilterArchiveType] = useState("all");
  const [filterReviewStatus, setFilterReviewStatus] = useState("all");
  const [filterRetentionPeriod, setFilterRetentionPeriod] = useState("all");
  const [filterSecurityLevel, setFilterSecurityLevel] = useState("all");

  // 切换节点展开/折叠
  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  // 获取当前文件列表
  const currentFiles = useMemo(() => {
    let files: ArchiveNode[] = [];
    
    if (searchQuery) {
      // 搜索模式
      const allFiles = getAllFiles(archiveData);
      files = allFiles.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (selectedCategory !== "all") {
      // 分类筛选模式
      const allFiles = getAllFiles(archiveData);
      files = allFiles.filter(file => {
        const categoryMap: Record<string, string> = {
          personal: "个人",
          work: "工作",
          finance: "财务",
          docs: "文书",
          media: "影像",
        };
        return file.category === categoryMap[selectedCategory];
      });
    } else {
      // 正常目录模式
      const node = findNodeById(archiveData, selectedNode);
      if (node) {
        if (node.type === "file") {
          files = [node];
        } else {
          files = node.children?.filter(child => child.type === "file") || [];
        }
      }
    }

    // 应用档案详情筛选条件
    files = files.filter(file => {
      if (filterArchiveType !== "all" && file.archiveType !== filterArchiveType) return false;
      if (filterReviewStatus !== "all" && file.reviewStatus !== filterReviewStatus) return false;
      if (filterRetentionPeriod !== "all" && file.retentionPeriod !== filterRetentionPeriod) return false;
      if (filterSecurityLevel !== "all" && file.securityLevel !== filterSecurityLevel) return false;
      return true;
    });

    // 排序
    files.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return (a.size || "").localeCompare(b.size || "");
        case "latest":
        default:
          return (b.date || "").localeCompare(a.date || "");
      }
    });

    return files;
  }, [selectedNode, searchQuery, selectedCategory, sortBy, filterArchiveType, filterReviewStatus, filterRetentionPeriod, filterSecurityLevel]);

  const allFiles = useMemo(() => getAllFiles(archiveData), []);

  // 下载文件
  const downloadFile = async (file: ArchiveNode) => {
    setDownloadingFile(file.id);
    
    // 模拟下载延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setDownloadingFile(null);
    setDownloadSuccess(file.id);
    
    // 3秒后清除成功提示
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  // 刷新
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // 渲染树形节点
  const renderTreeNode = (node: ArchiveNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id}>
        <button
          className={`w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-secondary/50 transition-colors ${
            isSelected ? "bg-primary/10" : ""
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleNode(node.id);
              setSelectedNode(node.id);
              setSelectedCategory("all");
              setSearchQuery("");
            }
          }}
        >
          {hasChildren && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
          {!hasChildren && <span className="w-5" />}
          
          {node.type === "folder" ? (
            isExpanded ? (
              <FolderOpen className="w-5 h-5 text-blue-500 flex-shrink-0" />
            ) : (
              <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />
            )
          ) : (
            getFileIcon(node.fileType)
          )}
          
          <span className={`flex-1 text-sm truncate ${isSelected ? "text-primary font-medium" : "text-foreground"}`}>
            {node.name}
          </span>
          
          {node.count !== undefined && node.count > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {node.count}
            </span>
          )}
        </button>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // 渲染文件列表项
  const renderFileItem = (file: ArchiveNode) => {
    const isDownloading = downloadingFile === file.id;
    const isDownloadSuccess = downloadSuccess === file.id;

    if (viewMode === "grid") {
      return (
        <div
          key={file.id}
          className="bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-colors"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-3">
              {getFileIcon(file.fileType, "w-7 h-7")}
            </div>
            <p className="text-sm font-medium text-foreground truncate w-full">{file.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{file.size} · {file.date}</p>
            
            <div className="flex gap-2 mt-3 w-full">
              <button
                onClick={() => setPreviewFile(file)}
                className="flex-1 h-8 flex items-center justify-center gap-1 text-xs text-primary bg-primary/5 rounded-lg"
              >
                <Eye className="w-3.5 h-3.5" />
                预览
              </button>
              <button
                onClick={() => setDetailFile(file)}
                className="flex-1 h-8 flex items-center justify-center gap-1 text-xs text-secondary-foreground bg-secondary rounded-lg"
              >
                <Info className="w-3.5 h-3.5" />
                详情
              </button>
            </div>
            <div className="flex gap-2 mt-2 w-full">
              <button
                onClick={() => downloadFile(file)}
                disabled={isDownloading}
                className="flex-1 h-8 flex items-center justify-center gap-1 text-xs bg-secondary rounded-lg disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isDownloadSuccess ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                {isDownloading ? "下载中" : isDownloadSuccess ? "已下载" : "下载"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={file.id}
        className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-colors"
      >
        <button
          onClick={() => setPreviewFile(file)}
          className="w-full flex items-center gap-3 px-4 py-3 text-left"
        >
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
            {getFileIcon(file.fileType)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span>{file.size}</span>
              <span>·</span>
              <span>{file.date}</span>
              {file.category && (
                <>
                  <span>·</span>
                  <span className="text-primary">{file.category}</span>
                </>
              )}
            </div>
          </div>
        </button>
        
        <div className="flex border-t border-border">
          <button
            onClick={() => setPreviewFile(file)}
            className="flex-1 h-10 flex items-center justify-center gap-1.5 text-xs text-primary hover:bg-primary/5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            预览
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={() => setDetailFile(file)}
            className="flex-1 h-10 flex items-center justify-center gap-1.5 text-xs hover:bg-secondary transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            详情
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={() => downloadFile(file)}
            disabled={isDownloading}
            className="flex-1 h-10 flex items-center justify-center gap-1.5 text-xs hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                下载中
              </>
            ) : isDownloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                已下载
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                下载
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="h-14 flex items-center justify-between px-4">
          {isSearchMode ? (
            <>
              <button
                onClick={() => {
                  setIsSearchMode(false);
                  setSearchQuery("");
                }}
                className="p-2 -ml-2 hover:bg-secondary rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 mx-3">
                <div className="h-10 bg-input rounded-xl flex items-center px-3 gap-2 border border-border">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="搜索档案名称..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")}>
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Archive className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-lg font-semibold text-foreground">档案管理</h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSearchMode(true)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-secondary rounded-xl"
                >
                  <Search className="w-5 h-5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                  className="w-9 h-9 flex items-center justify-center hover:bg-secondary rounded-xl"
                >
                  {viewMode === "list" ? (
                    <LayoutGrid className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <List className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-background">
        {/* Category Tabs */}
        {!isSearchMode && (
          <div className="flex items-center gap-1 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-border">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedNode("1");
                }}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Sort Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              共 {currentFiles.length} 个文件
            </span>
            {/* 筛选按钮 */}
            <button
              onClick={() => setShowFilterPanel(true)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                filterArchiveType !== "all" || filterReviewStatus !== "all" || filterRetentionPeriod !== "all" || filterSecurityLevel !== "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <Filter className="w-3 h-3" />
              筛选
              {(filterArchiveType !== "all" || filterReviewStatus !== "all" || filterRetentionPeriod !== "all" || filterSecurityLevel !== "all") && (
                <span className="ml-1 w-4 h-4 bg-primary-foreground text-primary rounded-full text-[10px] flex items-center justify-center">
                  {[filterArchiveType, filterReviewStatus, filterRetentionPeriod, filterSecurityLevel].filter(v => v !== "all").length}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-transparent text-muted-foreground outline-none cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4">
          {currentFiles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <p className="text-base font-medium text-foreground mb-1">
                {searchQuery ? `未找到"${searchQuery}"相关档案` : "暂无档案"}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "换个关键词试试？" : "请联系管理员获取档案访问权限"}
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-2 gap-3" : "space-y-2"}>
              {currentFiles.map(file => renderFileItem(file))}
            </div>
          )}
        </div>

        {/* Load More / Bottom */}
        {currentFiles.length > 0 && (
          <div className="py-4 text-center">
            <span className="text-xs text-muted-foreground">没有更多档案了</span>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <button
                onClick={() => setPreviewFile(null)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-5 h-5" />
                返回
              </button>
              <span className="font-medium text-foreground text-sm truncate max-w-[150px]">
                {previewFile.name}
              </span>
              <button
                onClick={() => downloadFile(previewFile)}
                disabled={downloadingFile === previewFile.id}
                className="flex items-center gap-1 text-sm text-primary disabled:opacity-50"
              >
                {downloadingFile === previewFile.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                下载
              </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto">
              <div className="w-24 h-24 bg-secondary rounded-2xl flex items-center justify-center mb-4">
                {getFileIcon(previewFile.fileType, "w-12 h-12")}
              </div>
              
              <h3 className="text-lg font-semibold text-foreground text-center mb-2">
                {previewFile.name}
              </h3>
              
              {/* File Type Badge */}
              <div className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground mb-4">
                {previewFile.fileType?.toUpperCase()} 文件
              </div>

              {/* Preview Placeholder */}
              <div className="w-full aspect-video bg-secondary/50 rounded-xl flex items-center justify-center mb-4">
                <p className="text-sm text-muted-foreground">预览区域</p>
              </div>

              <p className="text-sm text-muted-foreground text-center mb-6">
                点击下方"下载"按钮查看完整内容
              </p>

              {/* File Info */}
              <div className="w-full space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">分类</span>
                  <span className="text-foreground">{previewFile.category || "未分类"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">更新日期</span>
                  <span className="text-foreground">{previewFile.date}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">文件大小</span>
                  <span className="text-foreground">{previewFile.size}</span>
                </div>
                {previewFile.description && (
                  <div className="pt-2">
                    <span className="text-muted-foreground block mb-1">描述</span>
                    <span className="text-foreground text-sm">{previewFile.description}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Download Button */}
            <div className="p-4 border-t border-border">
              <button
                onClick={() => downloadFile(previewFile)}
                disabled={downloadingFile === previewFile.id}
                className="w-full h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
              >
                {downloadingFile === previewFile.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    正在下载...
                  </>
                ) : downloadSuccess === previewFile.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    下载完成
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    下载文件
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-card rounded-t-2xl sm:rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">筛选条件</h3>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="p-2 hover:bg-secondary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 档案类型 */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">档案类型</label>
                <div className="flex flex-wrap gap-2">
                  {archiveTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setFilterArchiveType(type.id)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        filterArchiveType === type.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 评审状态 */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">评审状态</label>
                <div className="flex flex-wrap gap-2">
                  {reviewStatuses.map(status => (
                    <button
                      key={status.id}
                      onClick={() => setFilterReviewStatus(status.id)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        filterReviewStatus === status.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {status.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 保管期限 */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">保管期限</label>
                <div className="flex flex-wrap gap-2">
                  {retentionPeriods.map(period => (
                    <button
                      key={period.id}
                      onClick={() => setFilterRetentionPeriod(period.id)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        filterRetentionPeriod === period.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {period.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 档案密级 */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">档案密级</label>
                <div className="flex flex-wrap gap-2">
                  {securityLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setFilterSecurityLevel(level.id)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        filterSecurityLevel === level.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex gap-3">
              <button
                onClick={() => {
                  setFilterArchiveType("all");
                  setFilterReviewStatus("all");
                  setFilterRetentionPeriod("all");
                  setFilterSecurityLevel("all");
                }}
                className="flex-1 h-12 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium"
              >
                重置
              </button>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="flex-1 h-12 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">档案详情</h3>
              <button
                onClick={() => setDetailFile(null)}
                className="p-2 hover:bg-secondary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detail Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* 档案信息表格 */}
              <div className="bg-secondary/30 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground w-24">归档号</td>
                      <td className="py-3 px-4 text-foreground">{detailFile.archiveNo || "-"}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">文件编号</td>
                      <td className="py-3 px-4 text-foreground">{detailFile.fileNo || "-"}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">档案类型</td>
                      <td className="py-3 px-4 text-foreground">{detailFile.archiveType || "-"}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">档案文件</td>
                      <td className="py-3 px-4">
                        <span className="text-primary">{detailFile.attachments?.length || 0}个文件</span>
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">评审状态</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          detailFile.reviewStatus === "无需评审" ? "bg-gray-100 text-gray-600" :
                          detailFile.reviewStatus === "已评审" ? "bg-green-100 text-green-600" :
                          detailFile.reviewStatus === "评审中" ? "bg-yellow-100 text-yellow-600" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {detailFile.reviewStatus || "-"}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">评审进度</td>
                      <td className="py-3 px-4 text-foreground">{detailFile.reviewProgress || "-"}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">保管期限</td>
                      <td className="py-3 px-4 text-foreground">{detailFile.retentionPeriod || "-"}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">档案密级</td>
                      <td className="py-3 px-4 text-foreground">{detailFile.securityLevel || "-"}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">创建人</td>
                      <td className="py-3 px-4 text-foreground">{detailFile.creator || "-"}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-muted-foreground">创建时间</td>
                      <td className="py-3 px-4 text-foreground">{detailFile.createTime || "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 附件列表 */}
              {detailFile.attachments && detailFile.attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">附件列表</h4>
                  <div className="space-y-2">
                    {detailFile.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                          {getFileIcon(attachment.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">{attachment.size}</p>
                        </div>
                        <button
                          onClick={() => downloadFile(detailFile)}
                          className="p-2 hover:bg-secondary rounded-lg"
                        >
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm">下载成功</span>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
