import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Layout, Globe, Loader } from "lucide-react";

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

export default function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams(); // รับ ID จาก URL (เช่น /admin/categories/edit/1)

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);

  // -------------------------------------------------------------
  // 1. ดึงข้อมูลหมวดหมู่เดิมมาแสดง (GET)
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
        const res = await fetch(`${apiEndpoint}/categories/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        const data = await res.json();
        if (data.success) {
          setName(data.data.name);
          setSlug(data.data.slug);
          setIsActive(data.data.is_active === 1);
        } else {
          alert(data.message || "ไม่พบข้อมูลหมวดหมู่");
          navigate("/admin/categories");
        }
      } catch (error) {
        console.error("Fetch category error:", error);
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id, navigate]);

  // ฟังก์ชันช่วยสร้าง Slug อัตโนมัติเวลาพิมพ์ชื่อ (เผื่ออยากเปลี่ยน)
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    // แปลงชื่อเป็น slug อัตโนมัติเฉพาะตอนที่ user ยังไม่ได้แก้ slug เอง หรือ slug เดิมคล้ายกับชื่อ
    setSlug(newName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''));
  };

  // -------------------------------------------------------------
  // 2. บันทึกการแก้ไข (PUT)
  // -------------------------------------------------------------
  const handleSave = async () => {
    if (!name.trim()) {
      alert("กรุณากรอกชื่อหมวดหมู่");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
      const res = await fetch(`${apiEndpoint}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
          is_active: isActive ? 1 : 0
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("แก้ไขหมวดหมู่สำเร็จ!");
        navigate("/admin/categories"); // กลับไปหน้ารวม
      } else {
        alert(data.message || "ไม่สามารถแก้ไขหมวดหมู่ได้ (ชื่อหรือ Slug อาจซ้ำ)");
      }
    } catch (error) {
      console.error("Update category error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

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
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all ${
            isSaving ? "bg-indigo-400 text-white cursor-wait" : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700"
          }`}
        >
          {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />} 
          {isSaving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="flex items-center gap-2 text-indigo-500">
            <Layout size={20}/>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">แก้ไขรายละเอียดหมวดหมู่</h3>
          </div>
          
          <div className="space-y-6">
            {/* Category Name */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">ชื่อหมวดหมู่ *</label>
              <input 
                type="text" 
                value={name}
                onChange={handleNameChange}
                placeholder="เช่น อุปกรณ์สำหรับแมว" 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700 transition-all" 
              />
            </div>

            {/* URL Slug */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">URL Slug (แก้ไขได้)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Globe size={16}/></div>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="category-url-path" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 font-mono text-sm transition-all" 
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-400">URL ที่ใช้แสดงบนหน้าเว็บ (แนะนำให้ใช้ภาษาอังกฤษและขีดกลาง)</p>
            </div>

            {/* Status Toggle */}
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700">สถานะหมวดหมู่</p>
                <p className="text-xs text-slate-400">หากปิดอยู่ หมวดหมู่นี้จะไม่แสดงในหน้าเว็บไซต์</p>
              </div>
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6 rounded-full relative transition-all ${isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isActive ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}