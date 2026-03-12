/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Phone, 
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader
} from "lucide-react";

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

export default function UserCreate() {
  const navigate = useNavigate();
  
  // State จัดการสถานะแจ้งเตือน
  const [showToast, setShowToast] = useState({ show: false, type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "user", // ค่าเริ่มต้นให้ตรงกับ DB
    is_active: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showNotification = (type, message) => {
    setShowToast({ show: true, type, message });
    setTimeout(() => setShowToast({ show: false, type: "", message: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. ตรวจสอบข้อมูลเบื้องต้นจากฝั่ง Frontend
    if (!formData.username || !formData.email || !formData.password) {
      showNotification("error", "กรุณากรอกข้อมูลบังคับ (*) ให้ครบถ้วน");
      return;
    }
    if (formData.password.length < 6) {
      showNotification("error", "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      
      // 2. ยิง API ไปสร้างผู้ใช้ (เอา X-User-Agent ออกแล้วเพื่อแก้ปัญหา CORS)
      const response = await fetch(`${apiEndpoint}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      // 3. ตรวจสอบผลลัพธ์
      if (response.ok && data.success) {
        showNotification("success", "สร้างบัญชีผู้ใช้งานสำเร็จ!");
        setTimeout(() => {
          navigate("/admin/users");
        }, 1500);
      } else {
        // หากไม่สำเร็จ (เช่น อีเมลซ้ำ) ให้นำข้อความจาก Backend มาโชว์เลย
        showNotification("error", data.message || "เกิดข้อผิดพลาดในการสร้างบัญชี");
      }
    } catch (error) {
      // เอา console.error ออกตามที่ต้องการ และแจ้งเตือนเมื่อเน็ตหลุด/เซิร์ฟเวอร์ล่ม
      showNotification("error", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[1000px] mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
      
      {/* Toast Notification */}
      {showToast.show && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-8">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-white ${showToast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            {showToast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span className="font-bold">{showToast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/admin/users")} className="p-2 hover:bg-white rounded-xl border border-slate-200 transition-all text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800">สร้างสมาชิกใหม่</h2>
            <p className="text-slate-500 text-sm">กำหนดรายละเอียดและสิทธิ์การเข้าใช้งานระบบ</p>
          </div>
        </div>
        <button 
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${
            isSubmitting ? "bg-indigo-400 text-white cursor-not-allowed" : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700"
          }`}
        >
          {isSubmitting ? <Loader size={18} className="animate-spin" /> : <Save size={18} />} 
          {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar & Role */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden group-hover:bg-slate-200 transition-all">
                <User size={48} className="text-slate-300" />
              </div>
              <div className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-xl shadow-lg border-2 border-white">
                <Camera size={16} />
              </div>
            </div>
            <h3 className="mt-4 font-bold text-slate-800 uppercase text-xs tracking-widest text-center">รูปประจำตัว</h3>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">แนะนำ: JPG, PNG 500x500px</p>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-500 mb-6 font-bold uppercase text-xs tracking-widest">
              <ShieldCheck size={16} /> ระดับสิทธิ์ (Role)
            </div>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700 cursor-pointer"
            >
              <option value="user">Customer (ลูกค้า)</option>
              <option value="admin">Admin (ผู้ดูแลระบบ)</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </section>
        </div>

        {/* Right Side: Basic Info & Security */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-500 mb-8 font-bold uppercase text-xs tracking-widest">
              <User size={16} /> ข้อมูลพื้นฐาน
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">ชื่อ-นามสกุล *</label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="ระบุชื่อจริงและนามสกุล" 
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700" 
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">อีเมล (ใช้ล็อกอิน) *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@mail.com" 
                    className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700" 
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">เบอร์โทรศัพท์</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08X-XXX-XXXX" 
                    className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700" 
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-500 mb-8 font-bold uppercase text-xs tracking-widest">
              <Lock size={16} /> ความปลอดภัย
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">รหัสผ่านพื้นฐาน *</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                  required
                  minLength={6}
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                  <span className="text-sm font-bold text-slate-600">ส่งข้อมูลล็อกอินไปยังอีเมล (จำลอง)</span>
                </label>
              </div>
            </div>
          </section>
        </div>

      </div>
    </form>
  );
}