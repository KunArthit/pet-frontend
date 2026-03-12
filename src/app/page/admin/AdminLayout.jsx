/* eslint-disable no-unused-vars */
// src/components/admin/AdminLayout.jsx
import React, { useState, useEffect } from "react";
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
  Bell,
  AlertTriangle
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  
  // ✅ State ควบคุมการเปิด/ปิด Logout Modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

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

  // โหลดข้อมูลแอดมินจาก LocalStorage มาแสดงบน Header
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  // ✅ ฟังก์ชัน ยืนยันการออกจากระบบ (ยิง API จริง)
  const executeLogout = async () => {
    setIsLogoutModalOpen(false); // ปิดหน้าต่าง Modal

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      
      // 1. ยิง API เพื่อแจ้ง Backend ให้เคลียร์ Session/Token
      if (token) {
        await fetch(`${apiEndpoint}/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      // 2. เคลียร์ข้อมูลทั้งหมดในเครื่อง ไม่ว่า API จะสำเร็จหรือพัง
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // 3. พาไปหน้า Login
      navigate("/login"); 
    }
  };

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
            const isActive = pathname.startsWith(item.path);
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
            {menuItems.find(i => pathname.startsWith(i.path))?.title || "Admin Panel"}
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
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {adminUser?.username || "Admin Petterain"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                  {adminUser?.role?.replace('_', ' ') || "Super Admin"}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md uppercase">
                {adminUser?.username?.charAt(0) || "A"}
              </div>
              <button 
                onClick={() => setIsLogoutModalOpen(true)} // ✅ เปลี่ยนมาเปิด Modal แทน
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="ออกจากระบบ"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* --- Page Content --- */}
        <main className="p-4 sm:p-8 relative z-0">
          <Outlet />
        </main>
      </div>

      {/* ========================================================= */}
      {/* 🔴 Custom Logout Confirmation Modal */}
      {/* ========================================================= */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
            
            {/* พื้นหลังตกแต่งด้านบน */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-rose-50 to-transparent z-0"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-white border-8 border-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <LogOut size={32} className="ml-1" />
              </div>
              
              <h3 className="text-xl font-black text-slate-800 text-center mb-2">
                ออกจากระบบ?
              </h3>
              
              <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
                คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ<br/>
                คุณจะต้องทำการเข้าสู่ระบบใหม่ในครั้งถัดไป
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 py-3.5 px-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 hover:text-slate-800 transition-all"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={executeLogout}
                  className="flex-1 py-3.5 px-4 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-all"
                >
                  ใช่, ออกจากระบบ
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminLayout;