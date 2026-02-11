// src/appbar/Appbar.jsx
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PawPrint,
  ShoppingBag,
  Menu,
  User,
  Package,
  LogOut,
  LogIn,
  Home, 
  Settings,
} from "lucide-react";

export default function Appbar({
  currentPage,
  cartCount,
  guestName = "คุณลูกค้า (Guest)",
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const userRef = useRef(null);
  const navigate = useNavigate();

  // ✅ เช็ค URL ให้แน่ใจว่าถูกต้อง (ตัด /api ออกถ้าไม่ได้ Group, หรือใส่ถ้า Group)
  const apiEndpoint =
    import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

  const [displayName, setDisplayName] = useState(guestName);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ตรวจสอบสถานะ Login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    const loggedIn = !!token && !!storedUser;
    setIsLoggedIn(loggedIn);

    if (loggedIn && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setDisplayName(parsedUser.username || parsedUser.email || guestName);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, [guestName]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ปิด Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const onDocClick = (e) => {
      if (!userRef.current) return;
      if (!userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const isSolid = isScrolled || pathname !== "/";

  // ✅ แก้ไขฟังก์ชัน Logout ให้รองรับ Cookie
  const handleLogout = async () => {
    try {
      // ไม่ต้องอ่าน refreshToken จาก localStorage แล้ว เพราะอยู่ใน HttpOnly Cookie
      // แต่ต้องส่ง credentials: "include" เพื่อแนบ Cookie ไปหา Server
      await fetch(`${apiEndpoint}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 สำคัญมาก! ต้องใส่เพื่อให้ Server เห็น Cookie
      });
    } catch (err) {
      console.error("Logout API Error:", err);
    } finally {
      // เคลียร์ฝั่ง Client ให้เกลี้ยง
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken"); // เผื่อมีของเก่าค้าง
      localStorage.removeItem("user");
      
      // ปิดเมนู (กรณี logout จาก mobile)
      setMobileOpen(false);
      setUserOpen(false);

      window.location.href = "/login";
    }
  };

  const pages = useMemo(
    () => [
      { key: "home", label: "หน้าแรก", path: "/" },
      { key: "shop", label: "สินค้า", path: "/shop" },
      { key: "categories", label: "หมวดหมู่", path: "/categories" },
      { key: "about", label: "เกี่ยวกับเรา", path: "/about" },
      { key: "admin", label: "แอดมิน", path: "/admin" },
    ],
    [],
  );

  // ✅ ฟังก์ชันนำทาง และสั่งปิดเมนู Mobile เสมอ
  const go = (pageKey) => {
    const page = pages.find((p) => p.key === pageKey);
    if (page?.path) navigate(page.path);
    
    // สั่งปิดเมนูทุกครั้งที่มีการกดเปลี่ยนหน้า
    setMobileOpen(false);
    setUserOpen(false);
  };

  const navWrapClass = isSolid
    ? "bg-white/90 text-gray-900 shadow-[0_8px_24px_rgba(0,0,0,0.08)] border-b border-black/5 backdrop-blur"
    : "bg-transparent text-white shadow-none border-b border-transparent";

  const authBtnClass = isSolid
    ? "text-gray-700 hover:bg-gray-100"
    : "text-white hover:bg-white/10";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navWrapClass}`}>
        <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => go("home")}
            className="flex items-center gap-2 select-none"
          >
            <PawPrint className="w-8 h-8 text-emerald-600" />
            <span className="font-extrabold tracking-wide text-lg sm:text-xl">
              PETTERAIN
            </span>
          </button>

          <div className="flex-1" />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {pages.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => go(p.key)}
                className={`px-3 py-2 rounded-xl font-semibold transition
                  ${currentPage === p.key ? "text-emerald-600" : ""}
                  ${
                    isSolid
                      ? "hover:bg-emerald-50 hover:text-emerald-700"
                      : "hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            
            {/* ตะกร้าสินค้า (แสดงเฉพาะตอน Login) */}
            {isLoggedIn && (
              <button
                type="button"
                className={`relative p-2 rounded-xl transition ${
                  isSolid ? "hover:bg-gray-100" : "hover:bg-white/10"
                }`}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {!!cartCount && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold grid place-items-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {isLoggedIn ? (
              // 🟢 User Logged In: แสดงเมนูโปรไฟล์
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserOpen((v) => !v)}
                  className={`p-2 rounded-xl transition ${
                    isSolid ? "hover:bg-gray-100" : "hover:bg-white/10"
                  }`}
                  aria-label="User menu"
                >
                  <User className="w-5 h-5" />
                </button>

                {userOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-black/10 bg-white text-gray-900 shadow-xl overflow-hidden animate-fade-in-up">
                    <div className="px-4 py-3 bg-gray-50/50">
                      <p className="text-xs text-gray-500 mb-1">ยินดีต้อนรับ</p>
                      <p className="text-sm font-extrabold text-gray-900 truncate">
                        {displayName}
                      </p>
                    </div>
                    <div className="h-px bg-black/5" />

                    <button
                      onClick={() => { navigate("/my-account"); setUserOpen(false); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <User className="w-4 h-4" /> โปรไฟล์
                    </button>

                    <button
                      onClick={() => { navigate("/my-account/orders"); setUserOpen(false); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <Package className="w-4 h-4" /> คำสั่งซื้อของฉัน
                    </button>

                    <button
                      onClick={() => { navigate("/my-account/address-edit"); setUserOpen(false); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <Home className="w-4 h-4" /> ตั้งค่าที่อยู่
                    </button>

                    <button
                      onClick={() => { navigate("/my-account/edit"); setUserOpen(false); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" /> ตั้งค่า
                    </button>
                    
                    <div className="h-px bg-black/5 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // 🔴 Guest: แสดงแค่ปุ่ม Login (เอาปุ่มสมัครสมาชิกออกแล้ว)
              <div className="hidden md:flex items-center gap-2 ml-2">
                <button
                  onClick={() => navigate("/login")}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 border ${
                    isSolid 
                      ? "border-gray-200 text-gray-700 hover:bg-gray-50" 
                      : "border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  เข้าสู่ระบบ
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={`md:hidden p-2 rounded-xl transition ${
                isSolid ? "hover:bg-gray-100" : "hover:bg-white/10"
              }`}
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* spacer */}
      <div className="h-20" />

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <PawPrint className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="font-extrabold text-gray-900 text-lg">PETTERAIN</div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              {pages.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  // ✅ ใช้ฟังก์ชัน go() ซึ่งมี setMobileOpen(false) อยู่แล้ว
                  onClick={() => go(p.key)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl font-semibold transition mb-2 flex items-center gap-3
                    ${
                      currentPage === p.key
                        ? "bg-emerald-50 text-emerald-700"
                        : "hover:bg-gray-50 text-gray-600"
                    }
                  `}
                >
                  {p.label}
                </button>
              ))}

              <div className="my-4 border-t border-gray-100" />

              {/* Mobile Menu Actions */}
              {isLoggedIn ? (
                <>
                   {/* <button
                    onClick={() => { navigate("/my-account"); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-3.5 rounded-2xl font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-3 mb-2"
                  >
                    <User className="w-5 h-5" /> โปรไฟล์
                  </button> */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3.5 rounded-2xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-3"
                  >
                    <LogOut className="w-5 h-5" /> ออกจากระบบ
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { navigate("/login"); setMobileOpen(false); }}
                    className="w-full py-3.5 rounded-2xl font-bold text-gray-700 border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-5 h-5" /> เข้าสู่ระบบ
                  </button>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}