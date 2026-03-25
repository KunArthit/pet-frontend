import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Save, X, Info, Package, Tag, DollarSign, Barcode, Image as ImageIcon } from "lucide-react";

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // ✅ เก็บ "ไฟล์จริง" ไว้ใน State แทน URL
  const [coverFile, setCoverFile] = useState(null); 
  const [galleryFiles, setGalleryFiles] = useState([]); 
  
  const [previewCover, setPreviewCover] = useState(null);
  const [previewGallery, setPreviewGallery] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    category_id: "",
    description: "",
    price: "",
    stock_quantity: "",
    is_active: 1,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiEndpoint}/categories/`);
        const data = await res.json();
        if (data?.data) setCategories(data.data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 เลือกภาพปก (เก็บไฟล์จริงลง State)
  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file); // เก็บไฟล์
    setPreviewCover(URL.createObjectURL(file)); // พรีวิว
  };

  // 🔹 เพิ่มภาพใน gallery (เก็บไฟล์จริงลง State)
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles((prev) => [...prev, ...files]);
    
    const previewUrls = files.map((f) => URL.createObjectURL(f));
    setPreviewGallery((prev) => [...prev, ...previewUrls]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && { slug: value.toLowerCase().replace(/\s+/g, "-") }),
    }));
  };

  // 🔹 บันทึกข้อมูลด้วย FormData
  const handleSubmit = async () => {
    if (!formData.name || !formData.category_id || !formData.sku) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setLoading(true);
    try {
      // ✅ สร้าง FormData แทน JSON
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("sku", formData.sku);
      payload.append("category_id", formData.category_id);
      payload.append("price", formData.price);
      payload.append("stock_quantity", formData.stock_quantity);
      payload.append("is_active", formData.is_active);
      if (formData.slug) payload.append("slug", formData.slug);
      if (formData.description) payload.append("description", formData.description);

      // แนบไฟล์ภาพปก (ถ้ามี)
      if (coverFile) {
        payload.append("image", coverFile);
      }

      // แนบไฟล์แกลเลอรีหลายรูป (ใช้ append ชื่อเดียวกันซ้ำๆ ได้เลย Backend จะมองเป็น Array)
      galleryFiles.forEach((file) => {
        payload.append("gallery_images", file);
      });

      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

      const res = await fetch(`${apiEndpoint}/products/`, {
        method: "POST",
        headers: {
          // ⚠️ ข้อควรระวัง: ไม่ต้องใส่ Content-Type! Browser จะใส่ multipart/form-data พร้อม boundary ให้เองอัตโนมัติ
          "Authorization": `Bearer ${token}`
        },
        body: payload,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      
      alert("✅ เพิ่มสินค้าและอัปโหลดรูปสำเร็จ");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error:", err);
      alert("❌ เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-800">เพิ่มสินค้าใหม่</h2>
        <button disabled={loading} onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold">
          {loading ? "กำลังบันทึก..." : "บันทึกสินค้า"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">ชื่อสินค้า *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">SKU *</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">รายละเอียด</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-semibold mb-2">ราคา</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold mb-2">สต็อก</label>
                    <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                 </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-sm font-semibold mb-2">หมวดหมู่</label>
            <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl">
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </section>

          {/* ภาพปก */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold mb-4">ภาพปกสินค้า</h3>
            {previewCover ? (
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <img src={previewCover} alt="cover" className="w-full h-full object-cover" />
                <button onClick={() => { setPreviewCover(null); setCoverFile(null); }} className="absolute top-2 right-2 bg-white text-rose-600 p-1 rounded-full">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer">
                <Upload size={20} />
                <span className="text-xs mt-2">อัปโหลดภาพปก</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleCoverImage} />
              </label>
            )}
          </section>

          {/* แกลเลอรี่ */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold mb-4">แกลเลอรี่</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {previewGallery.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      setPreviewGallery((prev) => prev.filter((_, i) => i !== idx));
                      setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
                    }}
                    className="absolute top-1 right-1 bg-white p-1 rounded-full text-rose-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer">
                <Upload size={20} />
                <span className="text-[10px]">เพิ่มภาพสินค้า</span>
                <input type="file" multiple className="hidden" onChange={handleGalleryChange} accept="image/*" />
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}