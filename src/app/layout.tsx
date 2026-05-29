import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/contexts/AdminContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "二道河水库移民安置信息管理系统",
  description: "二道河水库工程移民安置信息管理系统",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="mx-auto max-w-md min-h-screen bg-background">
          <AdminProvider>
            {children}
          </AdminProvider>
        </div>
      </body>
    </html>
  );
}
