import React, { useState, useEffect } from "react";
import { KeyRound, CheckCircle, ArrowLeft, Lock, PawPrint, Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get("token");
    if (t) setToken(t);
  }, []);

  // ตรวจสอบความแข็งแรงของรหัสผ่าน
  const checkPasswordStrength = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (strongRegex.test(password)) return "strong";
    if (mediumRegex.test(password)) return "medium";
    return "weak";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token ไม่ถูกต้อง หรือหมดอายุแล้ว");
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
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
        style={{ backgroundColor: "#A0D9F0" }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-20 blur-[80px]"
        style={{ backgroundColor: "#79A68F" }}
      />

      {/* Floating Icons */}
      <div className="absolute top-20 right-20 text-[#A0D9F0] opacity-20 rotate-12 hidden md:block">
        <PawPrint size={60} />
      </div>

      <div className="w-full max-w-md z-10 px-6">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 p-8 sm:p-12 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-2"
            style={{ backgroundColor: "#79A68F" }}
          />

          {!success ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-lg -rotate-3 bg-[#f0f9ff]">
                  <KeyRound className="w-10 h-10 text-[#79A68F]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                  ตั้ง<span style={{ color: "#79A68F" }}>รหัสผ่านใหม่</span>
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                  กำหนดรหัสผ่านใหม่ของคุณเพื่อเข้าใช้งานบัญชี
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600 ml-1">
                    รหัสผ่านใหม่
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#79A68F]" />
                    </div>

                    {/* 👁️ ปุ่ม toggle password visibility */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className={`block w-full pl-11 pr-12 py-4 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                        password
                          ? checkPasswordStrength(password) === "weak"
                            ? "border-red-400 focus:ring-red-100 bg-red-50/40"
                            : checkPasswordStrength(password) === "medium"
                            ? "border-yellow-400 focus:ring-yellow-100 bg-yellow-50/40"
                            : "border-green-400 focus:ring-green-100 bg-green-50/40"
                          : "border border-gray-200 bg-gray-50 focus:ring-[#79A68F]/10 focus:border-[#79A68F]"
                      }`}
                      placeholder="กรอกรหัสผ่านใหม่"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {/* ความแข็งแรงของรหัสผ่าน */}
                  {password && (
                    <p
                      className={`text-xs mt-1 ml-1 font-semibold ${
                        checkPasswordStrength(password) === "strong"
                          ? "text-green-600"
                          : checkPasswordStrength(password) === "medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {checkPasswordStrength(password) === "strong"
                        ? "รหัสผ่านแข็งแรงมาก"
                        : checkPasswordStrength(password) === "medium"
                        ? "รหัสผ่านปานกลาง (แนะนำให้เพิ่มอักขระพิเศษ)"
                        : "รหัสผ่านอ่อนแอ ต้องมีอย่างน้อย 6 ตัวอักษร และมีตัวพิมพ์ใหญ่/เล็ก/ตัวเลข"}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600 ml-1">
                  ยืนยันรหัสผ่าน
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#79A68F]" />
                  </div>

                  {/* 👁️ ปุ่ม toggle confirm password visibility */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className={`block w-full pl-11 pr-12 py-4 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                      confirmPassword
                        ? confirmPassword !== password
                          ? "border-red-400 focus:ring-red-100 bg-red-50/40"
                          : "border-green-400 focus:ring-green-100 bg-green-50/40"
                        : "border border-gray-200 bg-gray-50 focus:ring-[#79A68F]/10 focus:border-[#79A68F]"
                    }`}
                    placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {confirmPassword && confirmPassword !== password && (
                  <p className="text-xs text-red-600 mt-1 ml-1 font-semibold">
                    รหัสผ่านไม่ตรงกัน โปรดตรวจสอบอีกครั้ง
                  </p>
                )}

                {/* {confirmPassword && confirmPassword === password && (
                  <p className="text-xs text-green-600 mt-1 ml-1 font-semibold">
                    รหัสผ่านตรงกัน
                  </p>
                )} */}
              </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "#79A68F" }}
                  className={`w-full hover:opacity-90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#79A68F]/30 transition-all active:scale-[0.97] flex items-center justify-center gap-2 text-lg ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4 animate-fadeIn">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                รีเซ็ตรหัสผ่านสำเร็จ!
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                ตอนนี้คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้เลย
              </p>
              <button
                onClick={() => (window.location.href = "/login")}
                style={{ backgroundColor: "#79A68F" }}
                className="text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 shadow-md transition-all"
              >
                กลับไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          )}

          {/* Back to Login */}
          {!success && (
            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <button
                onClick={() => (window.location.href = "/login")}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
              >
                <ArrowLeft size={16} />
                กลับไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          © 2026 PET TERRAIN CO.,LTD.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;