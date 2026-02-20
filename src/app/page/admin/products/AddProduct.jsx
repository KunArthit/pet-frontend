import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Save,
  X,
  Info,
  Package,
  Tag,
  DollarSign,
  Barcode,
  Image as ImageIcon,
} from "lucide-react";

const apiEndpoint =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previewCover, setPreviewCover] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    category_id: "",
    description: "",
    price: "",
    stock_quantity: "",
    image_url: "",
    gallery_images: [],
    is_active: 1,
  });

  // 🔹 โหลดหมวดหมู่จาก API จริง
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiEndpoint}/categories/`);
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
        else if (data?.data) setCategories(data.data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 อัปโหลดไฟล์ไป API /upload (ใช้ของจริง)
  const uploadImage = async (file) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${apiEndpoint}/upload`, { method: "POST", body: form });
    if (!res.ok) throw new Error("Upload failed");
    const json = await res.json();
    return json.url;
  };

  // 🔹 เลือกภาพปก
  const handleCoverImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewCover(URL.createObjectURL(file));
    try {
      const uploadedUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
    } catch (err) {
      console.error(err);
      alert("อัปโหลดภาพปกไม่สำเร็จ");
    }
  };

  // 🔹 เพิ่มภาพใน gallery
  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files);
    const previewUrls = files.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...previewUrls]);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }
      setFormData((prev) => ({
        ...prev,
        gallery_images: [...prev.gallery_images, ...uploadedUrls],
      }));
    } catch (err) {
      console.error(err);
      alert("อัปโหลดภาพสินค้าไม่สำเร็จ");
    }
  };

  // 🔹 เปลี่ยนค่า input ทั่วไป
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && { slug: value.toLowerCase().replace(/\s+/g, "-") }),
    }));
  };

  // 🔹 บันทึกข้อมูล
  const handleSubmit = async () => {
    if (!formData.name || !formData.category_id || !formData.sku) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    const payload = {
      ...formData,
      category_id: Number(formData.category_id),
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity),
      is_active: 1,
    };

    setLoading(true);
    try {
      const res = await fetch(`${apiEndpoint}/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      alert("✅ เพิ่มสินค้าสำเร็จ");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error:", err);
      alert("❌ เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/products")}
            className="p-2 hover:bg-white rounded-xl border hover:border-slate-200 transition-all text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800">เพิ่มสินค้าใหม่</h2>
            <p className="text-slate-500 text-sm">
              กรอกข้อมูลรายละเอียดสินค้าเพื่อลงขายในระบบ
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
          >
            ยกเลิก
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 disabled:opacity-70"
          >
            <Save size={18} />
            {loading ? "กำลังบันทึก..." : "บันทึกสินค้า"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* ข้อมูลทั่วไป */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6 text-indigo-600">
              <Info size={18} />
              <h3 className="font-bold text-slate-800">ข้อมูลทั่วไป</h3>
            </div>
            <div className="space-y-4">
              {/* <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ชื่อสินค้า *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="เช่น อาหารสุนัขพรีเมียม สูตรลูกสุนัข"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div> */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ชื่อสินค้า *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name: value,
                      slug: `${value.toLowerCase().trim().replace(/\s+/g, "-")}-${Math.random()
                        .toString(36)
                        .slice(2, 6)}`, // ✅ unique slug
                    }));
                  }}
                  placeholder="เช่น อาหารสุนัขพรีเมียม สูตรลูกสุนัข"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />

                {/* ✅ แสดง slug preview */}
                {formData.slug && (
                  <p className="text-xs text-slate-400 mt-1">
                    URL Slug: <span className="font-mono text-indigo-600">{formData.slug}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  SKU *
                </label>
                <div className="flex items-center gap-2">
                  <Barcode size={16} className="text-slate-400" />
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="รหัสสินค้า เช่น DOG1234"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  รายละเอียดสินค้า
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="เขียนคำอธิบายเกี่ยวกับสินค้าของคุณ..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                />
              </div>
            </div>
          </section>

          {/* ราคา / สต็อก */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                  <DollarSign size={18} />
                  <h3 className="font-bold text-slate-800">ราคา</h3>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                  <Package size={18} />
                  <h3 className="font-bold text-slate-800">สต็อก</h3>
                </div>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  placeholder="จำนวนสินค้าในสต็อก"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* หมวดหมู่ */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <Tag size={18} />
              <h3 className="font-bold text-slate-800">หมวดหมู่</h3>
            </div>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
            >
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </section>

          {/* ภาพปก */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <ImageIcon size={18} />
              <h3 className="font-bold text-slate-800">ภาพปกสินค้า</h3>
            </div>
            {previewCover ? (
              <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200">
                <img src={previewCover} alt="cover" className="w-full h-full object-cover" />
                <button
                  onClick={() => {
                    setPreviewCover(null);
                    setFormData((prev) => ({ ...prev, image_url: "" }));
                  }}
                  className="absolute top-2 right-2 bg-white/70 text-rose-600 p-1 rounded-full shadow-sm"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 cursor-pointer hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-500 transition-all">
                <Upload size={20} />
                <span className="text-xs font-semibold mt-2">อัปโหลดภาพปก</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverImage}
                />
              </label>
            )}
          </section>

          {/* แกลเลอรี่ */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <Upload size={18} />
              <h3 className="font-bold text-slate-800">แกลเลอรี่สินค้า</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      setImages(images.filter((_, i) => i !== idx));
                      setFormData((prev) => ({
                        ...prev,
                        gallery_images: prev.gallery_images.filter((_, i) => i !== idx),
                      }));
                    }}
                    className="absolute top-1 right-1 bg-white/70 p-1 rounded-full text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-500 transition-all cursor-pointer">
                <Upload size={20} />
                <span className="text-[10px] font-bold">เพิ่มภาพสินค้า</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleGalleryChange}
                  accept="image/*"
                />
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}