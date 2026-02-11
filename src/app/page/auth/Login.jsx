import React, { useState } from "react";
import { Link } from "react-router-dom"; // ต้องใช้ react-router-dom
import {
  Lock,
  PawPrint,
  Heart,
  Mail,
  LogIn,
  ArrowRight,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import logo from "../../../assets/logo2.png";

const Login = () => {
  const apiEndpoint =
    import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

  // State
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชัน Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${apiEndpoint}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: pass,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }

      // Login สำเร็จ
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError(err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 blur-[80px]"
        style={{ backgroundColor: "#A0D9F0" }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-20 blur-[80px]"
        style={{ backgroundColor: "#79A68F" }}
      />
      <div className="absolute top-20 left-20 text-[#A0D9F0] opacity-20 rotate-12 hidden md:block">
        <PawPrint size={80} />
      </div>
      <div className="absolute bottom-20 right-20 text-[#79A68F] opacity-20 -rotate-12 hidden md:block">
        <Heart size={80} />
      </div>

      <div className="w-full max-w-md z-10 px-6 py-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-green-100/50 border border-gray-100 p-8 sm:p-12 relative overflow-hidden transition-all">
          <div
            className="absolute top-0 left-0 w-full h-2 transition-colors duration-500"
            style={{ backgroundColor: "#79A68F" }}
          />

          {/* Header */}
          <div className="text-center mb-8">
            {/* <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-lg rotate-3 transition-colors duration-500"
              style={{ backgroundColor: "#A0D9F0" }}
            >
              <PawPrint className="w-12 h-12 text-white" />
            </div> */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 shadow-lg rotate-3 transition-all overflow-hidden bg-white">
            <img
              src={logo}
              alt="Pet Terrain Logo"
              className="w-full h-full object-contain"
            />
          </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              PET <span style={{ color: "#79A68F" }}>TERRAIN</span>
            </h1>
            <h4 className="text-l font-semibold text-gray-700 tracking-tight">
              ANIMAL WELLNESS
            </h4>
            {/* <p className="text-gray-500 mt-2 text-sm font-medium">
              ยินดีต้อนรับคนรักสัตว์ทุกท่าน!
            </p> */}
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5 transition-all">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                อีเมล
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#79A68F] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#79A68F]/10 focus:border-[#79A68F] transition-all"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
<div className="space-y-1.5">
  <label className="text-sm font-semibold text-gray-600 px-1">
    รหัสผ่าน
  </label>

  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#79A68F] transition-colors" />
    </div>
    <button
      type="button"
      onClick={() => setShowPass((v) => !v)}
      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
    >
      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
    <input
      type={showPass ? "text" : "password"}
      required
      className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#79A68F]/10 focus:border-[#79A68F] transition-all"
      placeholder="กรอกรหัสผ่าน"
      value={pass}
      onChange={(e) => setPass(e.target.value)}
    />
  </div>

  {/* ปุ่มลืมรหัสผ่าน (ย้ายลงมาล่างช่อง) */}
  <div className="text-right mt-1">
    <Link
      to="/forgot-password"
      className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors underline underline-offset-4"
    >
      ลืมรหัสผ่าน?
    </Link>
  </div>
</div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: "#79A68F" }}
                className="w-full hover:opacity-90 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.97] flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>กำลังดำเนินการ...</span>
                ) : (
                  <>
                    <LogIn size={20} />
                    เข้าสู่ระบบ
                  </>
                )}
              </button>

              <Link
                to="/register"
                className="w-full bg-white border-2 border-dashed border-gray-200 text-gray-500 font-medium py-3 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
              >
                ยังไม่มีบัญชี?{" "}
                <span className="font-bold text-[#A0D9F0]">
                  สร้างบัญชีใหม่
                </span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
              <HelpCircle size={14} />
              ต้องการความช่วยเหลือ?{" "}
              <span className="underline cursor-pointer hover:text-gray-600">
                ติดต่อฝ่ายดูแลลูกค้า
              </span>
            </p>
          </div>
        </div>
        <p className="text-center text-gray-400 text-sm mt-8">
          © 2024 PET TERRAIN CO.,LTD. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;