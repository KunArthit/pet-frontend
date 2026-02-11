import React, { useState } from "react";
import { 
  Store, 
  Bell, 
  ShieldCheck, 
  CreditCard, 
  Globe, 
  Save, 
  Mail, 
  MapPin, 
  Phone,
  Camera,
  CheckCircle2
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const tabs = [
    { id: "general", label: "ข้อมูลร้านค้า", icon: Store },
    { id: "notifications", label: "การแจ้งเตือน", icon: Bell },
    { id: "payments", label: "ช่องทางชำระเงิน", icon: CreditCard },
    { id: "security", label: "ความปลอดภัย", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-8">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 size={24} />
            <span className="font-bold">บันทึกการตั้งค่าเรียบร้อยแล้ว!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">ตั้งค่าระบบ</h2>
          <p className="text-slate-500 text-sm">จัดการข้อมูลร้านค้าและกำหนดค่าการทำงานของเว็บไซต์</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Save size={18} /> บันทึกการเปลี่ยนแปลง
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                ? "bg-white text-indigo-600 shadow-sm border border-slate-100" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Settings Content */}
        <main className="flex-1 space-y-6">
          
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              {/* Logo Upload */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">โลโก้ร้านค้า</h3>
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-indigo-500 border-2 border-dashed border-slate-200 relative group cursor-pointer hover:bg-slate-100 transition-all">
                    <Store size={32} />
                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 rounded-3xl flex items-center justify-center transition-all">
                      <Camera size={20} className="text-indigo-600" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700">เปลี่ยนโลโก้หลัก</p>
                    <p className="text-xs text-slate-400 italic">ไฟล์แนะนำ: SVG หรือ PNG พื้นหลังโปร่งใส (512x512px)</p>
                  </div>
                </div>
              </section>

              {/* Basic Info */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={14} /> ข้อมูลติดต่อ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase">ชื่อร้านค้าทางการ</label>
                    <input type="text" defaultValue="PETTERAIN Official Store" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase">อีเมลติดต่อ</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="email" defaultValue="support@petterain.com" className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase">เบอร์โทรศัพท์</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="text" defaultValue="02-123-4567" className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase">ที่ตั้งสำนักงานใหญ่</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-5 text-slate-300" size={16} />
                      <textarea rows="3" defaultValue="123/45 ถนนนวมินทร์ แขวงนวมินทร์ เขตบึงกุ่ม กรุงเทพมหานคร 10240" className="w-full pl-11 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700 resize-none" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">ตั้งค่าการแจ้งเตือนพนักงาน</h3>
              <div className="space-y-4">
                <ToggleItem title="ออเดอร์ใหม่" description="รับการแจ้งเตือนทันทีเมื่อมีลูกค้าชำระเงิน" defaultChecked={true} />
                <ToggleItem title="สต็อกสินค้าต่ำ" description="แจ้งเตือนเมื่อสินค้าในคลังเหลือน้อยกว่า 10 ชิ้น" defaultChecked={true} />
                <ToggleItem title="ยอดขายสรุปวัน" description="ส่งรายงานยอดขายรายวันทางอีเมลแอดมิน" defaultChecked={false} />
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">บัญชีธนาคารสำหรับรับชำระ</h3>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">K</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">ธนาคารกสิกรไทย</p>
                    <p className="text-xs text-slate-400 font-mono">012-3-45678-9 | บจก. เพ็ทเทอร์เรน</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-indigo-600 hover:underline">แก้ไข</button>
              </div>
              <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold text-sm hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-500 transition-all">
                + เพิ่มบัญชีใหม่
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Sub-components
function ToggleItem({ title, description, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
      <div className="space-y-1">
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${checked ? "right-1" : "left-1"}`} />
      </button>
    </div>
  );
}