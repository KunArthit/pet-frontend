// import React, { useState } from "react";
// import { 
//   Store, 
//   Bell, 
//   ShieldCheck, 
//   CreditCard, 
//   Globe, 
//   Save, 
//   Mail, 
//   MapPin, 
//   Phone,
//   Camera,
//   CheckCircle2
// } from "lucide-react";

// export default function Settings() {
//   const [activeTab, setActiveTab] = useState("general");
//   const [showToast, setShowToast] = useState(false);

//   const handleSave = () => {
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 3000);
//   };

//   const tabs = [
//     { id: "general", label: "ข้อมูลร้านค้า", icon: Store },
//     // { id: "notifications", label: "การแจ้งเตือน", icon: Bell },
//     { id: "payments", label: "ช่องทางชำระเงิน", icon: CreditCard },
//     // { id: "security", label: "ความปลอดภัย", icon: ShieldCheck },
//   ];

//   return (
//     <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
//       {/* Toast Notification */}
//       {showToast && (
//         <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-8">
//           <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
//             <CheckCircle2 size={24} />
//             <span className="font-bold">บันทึกการตั้งค่าเรียบร้อยแล้ว!</span>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-black text-slate-800">ตั้งค่าระบบ</h2>
//           <p className="text-slate-500 text-sm">จัดการข้อมูลร้านค้าและกำหนดค่าการทำงานของเว็บไซต์</p>
//         </div>
//         <button 
//           onClick={handleSave}
//           className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
//         >
//           <Save size={18} /> บันทึกการเปลี่ยนแปลง
//         </button>
//       </div>

//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Sidebar Tabs */}
//         <aside className="w-full md:w-64 space-y-2">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${
//                 activeTab === tab.id 
//                 ? "bg-white text-indigo-600 shadow-sm border border-slate-100" 
//                 : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
//               }`}
//             >
//               <tab.icon size={20} />
//               {tab.label}
//             </button>
//           ))}
//         </aside>

//         {/* Settings Content */}
//         <main className="flex-1 space-y-6">
          
//           {activeTab === "general" && (
//             <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
//               {/* Logo Upload */}
//               <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
//                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">โลโก้ร้านค้า</h3>
//                 <div className="flex items-center gap-8">
//                   <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-indigo-500 border-2 border-dashed border-slate-200 relative group cursor-pointer hover:bg-slate-100 transition-all">
//                     <Store size={32} />
//                     <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 rounded-3xl flex items-center justify-center transition-all">
//                       <Camera size={20} className="text-indigo-600" />
//                     </div>
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-sm font-bold text-slate-700">เปลี่ยนโลโก้หลัก</p>
//                     <p className="text-xs text-slate-400 italic">ไฟล์แนะนำ: SVG หรือ PNG พื้นหลังโปร่งใส (512x512px)</p>
//                   </div>
//                 </div>
//               </section>

//               {/* Basic Info */}
//               <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
//                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                   <Globe size={14} /> ข้อมูลติดต่อ
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="md:col-span-2">
//                     <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase">ชื่อร้านค้าทางการ</label>
//                     <input type="text" defaultValue="PETTERAIN Official Store" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700" />
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase">อีเมลติดต่อ</label>
//                     <div className="relative">
//                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                       <input type="email" defaultValue="support@petterain.com" className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase">เบอร์โทรศัพท์</label>
//                     <div className="relative">
//                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                       <input type="text" defaultValue="02-123-4567" className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700" />
//                     </div>
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase">ที่ตั้งสำนักงานใหญ่</label>
//                     <div className="relative">
//                       <MapPin className="absolute left-4 top-5 text-slate-300" size={16} />
//                       <textarea rows="3" defaultValue="123/45 ถนนนวมินทร์ แขวงนวมินทร์ เขตบึงกุ่ม กรุงเทพมหานคร 10240" className="w-full pl-11 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700 resize-none" />
//                     </div>
//                   </div>
//                 </div>
//               </section>
//             </div>
//           )}

//           {activeTab === "notifications" && (
//             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right-4">
//               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">ตั้งค่าการแจ้งเตือนพนักงาน</h3>
//               <div className="space-y-4">
//                 <ToggleItem title="ออเดอร์ใหม่" description="รับการแจ้งเตือนทันทีเมื่อมีลูกค้าชำระเงิน" defaultChecked={true} />
//                 <ToggleItem title="สต็อกสินค้าต่ำ" description="แจ้งเตือนเมื่อสินค้าในคลังเหลือน้อยกว่า 10 ชิ้น" defaultChecked={true} />
//                 <ToggleItem title="ยอดขายสรุปวัน" description="ส่งรายงานยอดขายรายวันทางอีเมลแอดมิน" defaultChecked={false} />
//               </div>
//             </div>
//           )}

//           {activeTab === "payments" && (
//             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right-4">
//               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">บัญชีธนาคารสำหรับรับชำระ</h3>
//               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">K</div>
//                   <div>
//                     <p className="text-sm font-bold text-slate-800">ธนาคารกสิกรไทย</p>
//                     <p className="text-xs text-slate-400 font-mono">012-3-45678-9 | บจก. เพ็ทเทอร์เรน</p>
//                   </div>
//                 </div>
//                 <button className="text-xs font-bold text-indigo-600 hover:underline">แก้ไข</button>
//               </div>
//               <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold text-sm hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-500 transition-all">
//                 + เพิ่มบัญชีใหม่
//               </button>
//             </div>
//           )}

//         </main>
//       </div>
//     </div>
//   );
// }

// // Sub-components
// function ToggleItem({ title, description, defaultChecked }) {
//   const [checked, setChecked] = useState(defaultChecked);
//   return (
//     <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
//       <div className="space-y-1">
//         <p className="text-sm font-bold text-slate-800">{title}</p>
//         <p className="text-xs text-slate-400">{description}</p>
//       </div>
//       <button 
//         onClick={() => setChecked(!checked)}
//         className={`w-12 h-6 rounded-full relative transition-all duration-300 ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
//       >
//         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${checked ? "right-1" : "left-1"}`} />
//       </button>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { 
  Store, 
  CreditCard, 
  Globe, 
  Save, 
  Mail, 
  MapPin, 
  Phone,
  Camera,
  CheckCircle2,
  Loader // ✅ เพิ่ม Loader
} from "lucide-react";

const apiBaseUrl = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

export default function Settings() {

  const [activeTab, setActiveTab] = useState("general");
  const [showToast, setShowToast] = useState(false);
  
  // ✅ เพิ่ม State สำหรับ Loading
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    store_name: "",
    email: "",
    phone: "",
    address: "",
    logo: null
  });

  const [payments, setPayments] = useState([]);

  const tabs = [
    { id: "general", label: "ข้อมูลร้านค้า", icon: Store },
    { id: "payments", label: "ช่องทางชำระเงิน", icon: CreditCard },
  ];

  // ✅ 1. โหลดข้อมูลจาก API (GET) พร้อมแนบ Token
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        
        const res = await fetch(`${apiBaseUrl}/settings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // ✅ แนบ Token
          }
        });

        if (!res.ok) throw new Error("Failed to fetch settings");
        
        const data = await res.json();
        if (data.success) {
          setSettings(data.data.settings || {});
          setPayments(data.data.payments || []);
        }
      } catch (err) {
        console.error("Settings API error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ✅ 2. บันทึกข้อมูล (PUT) พร้อมแนบ Token
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

      console.log("Before");
      console.log(settings);

      const bodySetting = {
        store_name: settings.store_name,
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        // logo: settings.logo // ✅ ถ้ามีการอัปโหลดโลโก้ใหม่ ต้องจัดการไฟล์ด้วย FormData
      };
      
      const res = await fetch(`${apiBaseUrl}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ✅ แนบ Token
        },
        body: JSON.stringify(bodySetting),
      });
      console.log("After");
      console.log(res);
      
      const data = await res.json();

      if (data.success) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        alert(data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (err) {
      console.error("Save settings error:", err);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ แสดงหน้า Loading ขณะกำลังดึงข้อมูล
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bold">กำลังโหลดข้อมูลการตั้งค่า...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-8">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 size={24}/>
            <span className="font-bold">บันทึกการตั้งค่าเรียบร้อยแล้ว!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">ตั้งค่าระบบ</h2>
          <p className="text-slate-500 text-sm">
            จัดการข้อมูลร้านค้าและกำหนดค่าการทำงานของเว็บไซต์
          </p>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${
            isSaving ? "bg-indigo-400 text-white cursor-not-allowed" : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700"
          }`}
        >
          {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18}/>} 
          {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
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
              <tab.icon size={20}/>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 space-y-6">

          {/* GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">

              {/* Logo */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                  โลโก้ร้านค้า
                </h3>

                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-indigo-500 border-2 border-dashed border-slate-200 relative group cursor-pointer hover:bg-slate-100 transition-all">
                    <Store size={32}/>
                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 rounded-3xl flex items-center justify-center transition-all">
                      <Camera size={20} className="text-indigo-600"/>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700">
                      เปลี่ยนโลโก้หลัก
                    </p>
                    <p className="text-xs text-slate-400 italic">
                      ไฟล์แนะนำ: SVG หรือ PNG (512x512px)
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">

                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={14}/> ข้อมูลติดต่อ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase">
                      ชื่อร้านค้าทางการ
                    </label>

                    <input
                      value={settings.store_name || ""}
                      onChange={(e)=>setSettings({...settings, store_name:e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase">
                      อีเมลติดต่อ
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>

                      <input
                        type="email"
                        value={settings.email || ""}
                        onChange={(e)=>setSettings({...settings, email:e.target.value})}
                        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase">
                      เบอร์โทรศัพท์
                    </label>

                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>

                      <input
                        value={settings.phone || ""}
                        onChange={(e)=>setSettings({...settings, phone:e.target.value})}
                        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase">
                      ที่ตั้งสำนักงานใหญ่
                    </label>

                    <div className="relative">
                      <MapPin className="absolute left-4 top-5 text-slate-300" size={16}/>

                      <textarea
                        rows="3"
                        value={settings.address || ""}
                        onChange={(e)=>setSettings({...settings, address:e.target.value})}
                        className="w-full pl-11 pr-5 py-4 bg-slate-50 rounded-2xl font-bold text-slate-700 resize-none outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                </div>

              </section>

            </div>
          )}

          {/* PAYMENTS */}
          {activeTab === "payments" && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right-4">

              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                บัญชีธนาคารสำหรับรับชำระ
              </h3>

              {payments.length === 0 ? (
                 <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีข้อมูลบัญชีรับชำระเงิน</p>
              ) : (
                payments.map((bank)=>(
                  <div key={bank.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
  
                    <div className="flex items-center gap-4">
  
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">
                        {bank.bank_name?.charAt(0) || "B"}
                      </div>
  
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {bank.bank_name}
                        </p>
  
                        <p className="text-xs text-slate-400 font-mono">
                          {bank.account_number} | {bank.account_name}
                        </p>
                      </div>
  
                    </div>
  
                    <button className="text-xs font-bold text-indigo-600 hover:underline">
                      แก้ไข
                    </button>
  
                  </div>
                ))
              )}

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