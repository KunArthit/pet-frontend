import React, { useState } from "react";
import { Mail, ArrowLeft, KeyRound, PawPrint, Send } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ เพิ่ม state นี้

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("กรุณาระบุอีเมลที่ถูกต้อง");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || "ไม่สามารถส่งอีเมลได้");
      }
    } catch (err) {
      setLoading(false);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div 
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 blur-[80px]" 
        style={{ backgroundColor: '#A0D9F0' }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-20 blur-[80px]" 
        style={{ backgroundColor: '#79A68F' }}
      />

      {/* Floating Icons */}
      <div className="absolute top-20 right-20 text-[#A0D9F0] opacity-20 rotate-12 hidden md:block">
        <PawPrint size={60} />
      </div>

      <div className="w-full max-w-md z-10 px-6">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 p-8 sm:p-12 relative overflow-hidden">
          
          {/* Accent Line */}
          <div 
            className="absolute top-0 left-0 w-full h-2"
            style={{ backgroundColor: '#79A68F' }}
          />

          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-lg -rotate-3 bg-[#f0f9ff]"
                >
                  <KeyRound className="w-10 h-10 text-[#79A68F]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                  ลืม<span style={{ color: '#79A68F' }}>รหัสผ่าน?</span>
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                  ไม่ต้องกังวล! ระบุอีเมลของคุณด้านล่าง <br/>เราจะส่งลิงก์ตั้งค่ารหัสผ่านใหม่ไปให้
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600 ml-1">อีเมลของคุณ</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#79A68F] transition-colors" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#79A68F]/10 focus:border-[#79A68F] transition-all"
                      placeholder="example@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: '#79A68F' }}
                  className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#79A68F]/30 transition-all active:scale-[0.97] flex items-center justify-center gap-2 text-lg ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {loading ? "กำลังส่ง..." : (<><Send size={18} /> ส่งลิงก์กู้คืน</>)}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4 animate-fadeIn">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-6">
                <Mail className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ตรวจสอบอีเมลของคุณ</h2>
              <p className="text-gray-500 text-sm mb-8">
                เราได้ส่งคำแนะนำในการตั้งรหัสผ่านใหม่ไปที่ <br/>
                <strong className="text-gray-700">{email}</strong> เรียบร้อยแล้ว
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-[#79A68F] font-semibold hover:underline text-sm"
              >
                ไม่ได้รับอีเมล? ลองใหม่อีกครั้ง
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <button
              onClick={() => (window.location.href = "/login")}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} />
              กลับไปหน้าเข้าสู่ระบบ
            </button>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          © 2026 PET TERRAIN CO.,LTD.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;