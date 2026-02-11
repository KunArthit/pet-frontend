import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ต้องใช้ react-router-dom
import {
  User,
  Lock,
  PawPrint,
  Heart,
  Mail,
  UserPlus,
  ArrowRight,
  HelpCircle,
  Eye,
  EyeOff,
  Phone,
} from "lucide-react";

const Register = () => {
  const apiEndpoint =
    import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";
  
  const navigate = useNavigate();

  // State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  
  // UI State
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันตรวจสอบรูปแบบข้อมูล
  const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const validatePhone = (phone) => /^0[689]\d{8}$/.test(phone); // เบอร์ไทย 10 หลัก
  const checkPasswordStrength = (password) => {
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    const medium = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (strong.test(password)) return "strong";
    if (medium.test(password)) return "medium";
    return "weak";
  };

 // ฟังก์ชัน Register
const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  if (pass !== confirmPass) {
    setError("รหัสผ่านไม่ตรงกัน!");
    return;
  }

  if (!validateEmail(email)) {
    setError("รูปแบบอีเมลไม่ถูกต้อง");
    return;
  }

  if (!validatePhone(phone)) {
    setError("เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็น 10 หลัก)");
    return;
  }

  const passStrength = checkPasswordStrength(pass);
  if (passStrength === "weak") {
    setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร และมีตัวพิมพ์เล็ก/ใหญ่/ตัวเลข");
    return;
  }
  setIsLoading(true);

  try {
    const res = await fetch(`${apiEndpoint}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password: pass,
        phone,
        role: "user",
      }),
    });
  
    const data = await res.json();
  
    if (res.ok && data.success) {
      alert("✅ สมัครสมาชิกสำเร็จ! โปรดตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี");
      navigate("/login");
    } else {
      setError(data.message || "สมัครสมาชิกไม่สำเร็จ");
    }
  } catch (err) {
    console.error("Register error:", err);
    setError("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
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
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 p-8 sm:p-12 relative overflow-hidden transition-all">
          <div
            className="absolute top-0 left-0 w-full h-2 transition-colors duration-500"
            style={{ backgroundColor: "#A0D9F0" }}
          />

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-lg rotate-3 transition-colors duration-500"
              style={{ backgroundColor: "#79A68F" }}
            >
              <UserPlus className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              JOIN <span style={{ color: "#A0D9F0" }}>US</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              สร้างบัญชีเพื่อรับสิทธิพิเศษสำหรับสัตว์เลี้ยง
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                ชื่อผู้ใช้งาน
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#A0D9F0] transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#A0D9F0]/10 focus:border-[#A0D9F0] transition-all"
                  placeholder="กรอกชื่อผู้ใช้"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5 transition-all">
              <label className="text-sm font-semibold text-gray-600 ml-1">อีเมล</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#A0D9F0] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className={`block w-full pl-11 pr-4 py-3.5 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                    email
                      ? validateEmail(email)
                        ? "border-green-400 focus:ring-green-100 bg-green-50/40"
                        : "border-red-400 focus:ring-red-100 bg-red-50/40"
                      : "border border-gray-200 bg-gray-50 focus:ring-[#A0D9F0]/10 focus:border-[#A0D9F0]"
                  }`}
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {email && !validateEmail(email) && (
                <p className="text-xs text-red-600 mt-1 ml-1 font-semibold">
                  รูปแบบอีเมลไม่ถูกต้อง เช่น example@mail.com
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5 transition-all">
              <label className="text-sm font-semibold text-gray-600 ml-1">เบอร์โทรศัพท์</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-[#A0D9F0] transition-colors" />
                </div>
                <input
                  type="tel"
                  required
                  className={`block w-full pl-11 pr-4 py-3.5 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                    phone
                      ? validatePhone(phone)
                        ? "border-green-400 focus:ring-green-100 bg-green-50/40"
                        : "border-red-400 focus:ring-red-100 bg-red-50/40"
                      : "border border-gray-200 bg-gray-50 focus:ring-[#A0D9F0]/10 focus:border-[#A0D9F0]"
                  }`}
                  placeholder="08xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {phone && !validatePhone(phone) && (
                <p className="text-xs text-red-600 mt-1 ml-1 font-semibold">
                  เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็น 10 หลักขึ้นต้นด้วย 06, 08 หรือ 09)
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-600 ml-1">รหัสผ่าน</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#A0D9F0] transition-colors" />
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
                  className={`block w-full pl-11 pr-12 py-3.5 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                    pass
                      ? checkPasswordStrength(pass) === "weak"
                        ? "border-red-400 focus:ring-red-100 bg-red-50/40"
                        : checkPasswordStrength(pass) === "medium"
                        ? "border-yellow-400 focus:ring-yellow-100 bg-yellow-50/40"
                        : "border-green-400 focus:ring-green-100 bg-green-50/40"
                      : "border border-gray-200 bg-gray-50 focus:ring-[#A0D9F0]/10 focus:border-[#A0D9F0]"
                  }`}
                  placeholder="กรอกรหัสผ่าน"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>

              {pass && (
                <p
                  className={`text-xs mt-1 ml-1 font-semibold ${
                    checkPasswordStrength(pass) === "strong"
                      ? "text-green-600"
                      : checkPasswordStrength(pass) === "medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {checkPasswordStrength(pass) === "strong"
                    ? "รหัสผ่านแข็งแรงมาก"
                    : checkPasswordStrength(pass) === "medium"
                    ? "รหัสผ่านปานกลาง (แนะนำให้เพิ่มอักขระพิเศษ)"
                    : "รหัสผ่านอ่อนแอ ต้องมีอย่างน้อย 6 ตัวอักษร และมีตัวพิมพ์ใหญ่/เล็ก/ตัวเลข"}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 transition-all">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                ยืนยันรหัสผ่าน
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#A0D9F0] transition-colors" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPass((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>

                <input
                  type={showConfirmPass ? "text" : "password"}
                  required
                  className={`block w-full pl-11 pr-12 py-3.5 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                    confirmPass
                      ? confirmPass !== pass
                        ? "border-red-400 focus:ring-red-100 bg-red-50/40"
                        : "border-green-400 focus:ring-green-100 bg-green-50/40"
                      : "border border-gray-200 bg-gray-50 focus:ring-[#A0D9F0]/10 focus:border-[#A0D9F0]"
                  }`}
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </div>

              {confirmPass && confirmPass !== pass && (
                <p className="text-xs text-red-600 mt-1 ml-1 font-semibold">
                  รหัสผ่านไม่ตรงกัน โปรดตรวจสอบอีกครั้ง
                </p>
              )}

              {/* {confirmPass && confirmPass === pass && (
                <p className="text-xs text-green-600 mt-1 ml-1 font-semibold">
                  รหัสผ่านตรงกัน
                </p>
              )} */}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: "#A0D9F0" }}
                className="w-full hover:opacity-90 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.97] flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>กำลังดำเนินการ...</span>
                ) : (
                  <>
                    <UserPlus size={20} />
                    สมัครสมาชิกตอนนี้
                  </>
                )}
              </button>

              <Link
                to="/login"
                className="w-full bg-white border-2 border-dashed border-gray-200 text-gray-500 font-medium py-3 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
              >
                มีบัญชีอยู่แล้ว?{" "}
                <span className="font-bold text-[#79A68F]">
                  เข้าสู่ระบบที่นี่
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

export default Register;