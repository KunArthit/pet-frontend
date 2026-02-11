// src/components/admin/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Tags,
  ShoppingBag,
  CreditCard,
  FileText,
  FileSignature,
  Users2,
  Cog,
  ChevronLeft,
  ChevronRight,
  LogOut,
  PawPrint,
  ExternalLink,
  Bell
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { title: "จัดการสินค้า", icon: Box, path: "/admin/products" },
    { title: "หมวดหมู่สินค้า", icon: Tags, path: "/admin/categories" },
    { title: "คำสั่งซื้อ", icon: ShoppingBag, path: "/admin/orders" },
    { title: "การชำระเงิน", icon: CreditCard, path: "/admin/payments" },
    { title: "ใบแจ้งหนี้", icon: FileText, path: "/admin/invoices" },
    { title: "ใบเสนอราคา", icon: FileSignature, path: "/admin/quotations" },
    { title: "จัดการสมาชิก", icon: Users2, path: "/admin/users" },
    { title: "ตั้งค่าระบบ", icon: Cog, path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* --- Sidebar --- */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-slate-900 text-slate-300 transition-all duration-300 z-50 shadow-2xl
          ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800 overflow-hidden">
          <div className="min-w-[32px] bg-indigo-500 p-1.5 rounded-lg">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-white tracking-tight whitespace-nowrap">
              PETTERAIN <span className="text-indigo-400 text-[10px] ml-1">ADMIN</span>
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group
                  ${isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                    : "hover:bg-slate-800 hover:text-white"}`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute bottom-6 right-[-12px] bg-indigo-500 text-white p-1 rounded-full shadow-md hover:bg-indigo-600 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* --- Main Content Area --- */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
        
        {/* --- Top Appbar --- */}
        <header className="sticky top-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between z-40">
          <h1 className="text-slate-800 font-bold text-lg">
            {menuItems.find(i => i.path === pathname)?.title || "Admin Panel"}
          </h1>

          <div className="flex items-center gap-4">
            {/* View Store Button */}
            <button 
              onClick={() => window.open("/", "_blank")}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 border border-slate-200 rounded-lg hover:border-indigo-100 hover:bg-indigo-50 transition-all"
            >
              <ExternalLink size={14} />
              ไปหน้าบ้าน
            </button>

            {/* Notification */}
            <div className="relative p-2 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </div>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">Admin Petterain</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-wider">Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                A
              </div>
              <button 
                onClick={() => { /* Logout Logic */ }}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="ออกจากระบบ"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* --- Page Content --- */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;