"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Organization {
  id: number;
  name: string;
  role: string;
  contact: string;
  phone: string;
  email: string;
  color: string;
}

export interface Archive {
  id: number;
  name: string;
  type: string;
  date: string;
  size: string;
  status: string;
}

export interface FundItem {
  category: string;
  plan: number;
  actual: number;
}

interface DataContextType {
  projectOverview: string;
  setProjectOverview: (text: string) => void;
  immigrantOverview: string;
  setImmigrantOverview: (text: string) => void;
  workProgressText: string;
  setWorkProgressText: (text: string) => void;
  workDynamicText: string;
  setWorkDynamicText: (text: string) => void;
  organizations: Organization[];
  addOrganization: (org: Omit<Organization, "id">) => void;
  updateOrganization: (id: number, org: Partial<Organization>) => void;
  deleteOrganization: (id: number) => void;
  archives: Archive[];
  addArchive: (archive: Omit<Archive, "id">) => void;
  updateArchive: (id: number, archive: Partial<Archive>) => void;
  deleteArchive: (id: number) => void;
  fundData: FundItem[];
  setFundData: (data: FundItem[]) => void;
  totalPlan: number;
  totalActual: number;
  completionRate: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultProjectOverview = "二道河水库工程位于大石河流域上游...";
const defaultImmigrantOverview = "房山区二道河水库建设工程建设征地涉及...";

export function DataProvider({ children }: { children: ReactNode }) {
  const [projectOverview, setProjectOverview] = useState(defaultProjectOverview);
  const [immigrantOverview, setImmigrantOverview] = useState(defaultImmigrantOverview);
  const [workProgressText, setWorkProgressText] = useState("");
  const [workDynamicText, setWorkDynamicText] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [archives, setArchives] = useState<Archive[]>([]);
  const [fundData, setFundData] = useState<FundItem[]>([]);

  const addOrganization = (org: Omit<Organization, "id">) => {
    const newId = Math.max(...organizations.map(o => o.id), 0) + 1;
    setOrganizations([...organizations, { ...org, id: newId }]);
  };

  const updateOrganization = (id: number, org: Partial<Organization>) => {
    setOrganizations(organizations.map(o => o.id === id ? { ...o, ...org } : o));
  };

  const deleteOrganization = (id: number) => {
    setOrganizations(organizations.filter(o => o.id !== id));
  };

  const addArchive = (archive: Omit<Archive, "id">) => {
    const newId = Math.max(...archives.map(a => a.id), 0) + 1;
    setArchives([...archives, { ...archive, id: newId }]);
  };

  const updateArchive = (id: number, archive: Partial<Archive>) => {
    setArchives(archives.map(a => a.id === id ? { ...a, ...archive } : a));
  };

  const deleteArchive = (id: number) => {
    setArchives(archives.filter(a => a.id !== id));
  };

  const totalPlan = fundData.reduce((sum, item) => sum + item.plan, 0);
  const totalActual = fundData.reduce((sum, item) => sum + item.actual, 0);
  const completionRate = totalPlan > 0 ? ((totalActual / totalPlan) * 100).toFixed(1) : "0.0";

  return (
    <DataContext.Provider value={{
      projectOverview, setProjectOverview,
      immigrantOverview, setImmigrantOverview,
      workProgressText, setWorkProgressText,
      workDynamicText, setWorkDynamicText,
      organizations, addOrganization, updateOrganization, deleteOrganization,
      archives, addArchive, updateArchive, deleteArchive,
      fundData, setFundData, totalPlan, totalActual, completionRate,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
}
