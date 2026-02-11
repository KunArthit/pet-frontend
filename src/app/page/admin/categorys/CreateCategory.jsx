import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Layout, Globe, ToggleRight } from "lucide-react";

export default function CreateCategory() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  // ฟังก์ชันจำลองการสร้าง Slug (แทนที่ช่องว่างด้วยขีดกลาง)
  const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate("/admin/categories")}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-colors"
        >
          <ArrowLeft size={20} /> ย้อนกลับ
        </button>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Save size={18} /> บันทึกหมวดหมู่
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="flex items-center gap-2 text-indigo-500"><Layout size={20}/><h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">รายละเอียดหมวดหมู่</h3></div>
          
          <div className="space-y-6">
            {/* Category Name */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">ชื่อหมวดหมู่ *</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น อุปกรณ์สำหรับแมว" 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700 transition-all" 
              />
            </div>

            {/* URL Slug */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">URL Slug (URL สำหรับแสดงหน้าเว็บ)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Globe size={16}/></div>
                <input 
                  type="text" 
                  value={slugify(name)}
                  readOnly
                  placeholder="category-url-path" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-100 border-none rounded-xl text-slate-500 font-mono text-sm cursor-not-allowed" 
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-400">ระบบจะสร้าง URL ให้โดยอัตโนมัติจากชื่อหมวดหมู่</p>
            </div>

            {/* Status Toggle */}
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700">เปิดใช้งานหมวดหมู่</p>
                <p className="text-xs text-slate-400">หากปิดอยู่ หมวดหมู่นี้จะไม่แสดงในหน้าเว็บไซต์</p>
              </div>
              <button className="w-12 h-6 bg-emerald-500 rounded-full relative transition-all">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}