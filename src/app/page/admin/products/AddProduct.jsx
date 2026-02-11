import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  X, 
  Info, 
  Package, 
  Tag, 
  DollarSign 
} from "lucide-react";

export default function AddProduct() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);

  // ฟังก์ชันจำลองการเลือกรูปภาพ
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/admin/products")}
            className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800">เพิ่มสินค้าใหม่</h2>
            <p className="text-slate-500 text-sm">กรอกข้อมูลรายละเอียดสินค้าเพื่อลงขายในระบบ</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
          >
            ยกเลิก
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200">
            <Save size={18} />
            บันทึกสินค้า
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Column: Form Details --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6 text-indigo-600">
              <Info size={18} />
              <h3 className="font-bold text-slate-800">ข้อมูลทั่วไป</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">ชื่อสินค้า *</label>
                <input 
                  type="text" 
                  placeholder="เช่น อาหารสุนัขพรีเมียม สูตรลูกสุนัข"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">รายละเอียดสินค้า</label>
                <textarea 
                  rows="5"
                  placeholder="เขียนคำอธิบายเกี่ยวกับสินค้าของคุณ..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Pricing & Stock */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                  <DollarSign size={18} />
                  <h3 className="font-bold text-slate-800">ราคา</h3>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">฿</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                  <Package size={18} />
                  <h3 className="font-bold text-slate-800">สต็อก</h3>
                </div>
                <input 
                  type="number" 
                  placeholder="ระบุจำนวน"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        {/* --- Right Column: Organization & Images --- */}
        <div className="space-y-6">
          {/* Category */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <Tag size={18} />
              <h3 className="font-bold text-slate-800">หมวดหมู่</h3>
            </div>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer">
              <option value="">เลือกหมวดหมู่</option>
              <option value="dog">อาหารสุนัข</option>
              <option value="cat">อาหารแมว</option>
              <option value="toy">ของเล่น</option>
            </select>
          </section>

          {/* Image Upload */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <Upload size={18} />
              <h3 className="font-bold text-slate-800">รูปภาพสินค้า</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-md rounded-full text-rose-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-500 transition-all cursor-pointer">
                <Upload size={20} />
                <span className="text-[10px] font-bold">เพิ่มรูปภาพ</span>
                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <p className="text-[10px] text-slate-400 text-center uppercase tracking-wider">แนะนำขนาด 800x800px (JPG/PNG)</p>
          </section>
        </div>
      </div>
    </div>
  );
}