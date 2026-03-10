import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Package,
  Tag,
  Layers,
  Info,
  DollarSign,
  Database,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const apiEndpoint =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    sku: "",
    category_id: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    image_url: "",
    is_active: 1,
  });

  const [productImages, setProductImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  // ✅ โหลดรูปภาพเพิ่มเติมของสินค้า
  const fetchProductImages = async () => {
    try {
      const res = await fetch(`${apiEndpoint}/products/${id}`);
      const data = await res.json();
      if (data.success && data.data?.gallery) {
        const fullUrls = data.data.gallery.map((img) => ({
          ...img,
          image_url: img.image_url.startsWith("http")
            ? img.image_url
            : `${apiEndpoint.replace("/api", "")}${img.image_url}`,
        }));
        setProductImages(fullUrls);
      }
    } catch (err) {
      console.error("โหลดรูปภาพไม่สำเร็จ:", err);
    }
  };

  // useEffect(() => {
  //   fetchProductImages();
  // }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${apiEndpoint}/products/${id}`),
          fetch(`${apiEndpoint}/categories`)
        ]);
  
        if (!prodRes.ok) throw new Error("ไม่สามารถโหลดข้อมูลสินค้าได้");
  
        const prodData = await prodRes.json();
        const catData = await catRes.json();
  
        // categories
        if (catData.success) {
          setCategories(catData.data || []);
        }
  
        const p = prodData.data.product || {};
  
        // product data
        setProduct({
          name: p.name ?? "",
          slug: p.slug ?? "",
          sku: p.sku ?? "",
          category_id: p.category_id ?? "",
          description: p.description ?? "",
          price: parseFloat(p.price ?? 0),
          stock_quantity: p.stock_quantity ?? 0,
          image_url: p.image_url
            ? p.image_url.startsWith("http")
              ? p.image_url
              : `${apiEndpoint.replace("/api", "")}${p.image_url}`
            : "",
          is_active: Number(p.is_active ?? 1),
        });
  
        // gallery images
        if (prodData.data?.gallery) {
          const fullUrls = prodData.data.gallery.map((img) => ({
            ...img,
            image_url: img.image_url.startsWith("http")
              ? img.image_url
              : `${apiEndpoint.replace("/api", "")}${img.image_url}`,
          }));
  
          setProductImages(fullUrls);
        }
  
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);

  // ✅ อัปโหลดรูปภาพจากเครื่อง (ส่งไฟล์จริง)
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      // STEP 1: อัปโหลดไปที่ /upload
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch(`${apiEndpoint}/upload`, {
        method: "POST",
        body: form,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error("อัปโหลดภาพไม่สำเร็จ");

      // STEP 2: เพิ่มลง gallery
      const res = await fetch(`${apiEndpoint}/products/${id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: uploadData.url,
          sort_order: productImages.length,
        }),
      });
      if (!res.ok) throw new Error("เพิ่มรูปภาพไม่สำเร็จ");

      showToast("✅ เพิ่มรูปสำเร็จ", "success");
      fetchProductImages();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  // ✅ อัปโหลดรูปปกสินค้า (แทนที่ image_url เดิม)
  const handleUploadMainImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      // STEP 1: upload ไป /upload
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch(`${apiEndpoint}/upload`, {
        method: "POST",
        body: form,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error("อัปโหลดภาพไม่สำเร็จ");

      // STEP 2: อัปเดต image_url ในสินค้า
      const res = await fetch(`${apiEndpoint}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ image_url: uploadData.url }),
      });

      if (!res.ok) throw new Error("อัปเดตรูปปกไม่สำเร็จ");

      showToast("✅ อัปโหลดรูปปกสำเร็จ!", "success");

      // STEP 3: อัปเดต state ให้โชว์ภาพใหม่
      setProduct((prev) => ({
        ...prev,
        image_url: `${apiEndpoint.replace("/api", "")}${uploadData.url}`,
      }));
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  // ✅ ลบรูปภาพ
  const handleDeleteImage = async (imageId) => {
    if (!confirm("คุณต้องการลบรูปนี้ใช่ไหม?")) return;
    try {
      const res = await fetch(`${apiEndpoint}/products/images/${imageId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("ลบรูปภาพไม่สำเร็จ");
      showToast("🗑️ ลบรูปภาพเรียบร้อย!", "success");
      fetchProductImages();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // ✅ ลบรูปหลัก (image_url)
  const handleDeleteMainImage = async () => {
    if (!confirm("คุณต้องการลบภาพปกสินค้านี้ใช่ไหม?")) return;

    try {
      const res = await fetch(`${apiEndpoint}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ image_url: "" }), // ✅ เคลียร์ค่า image_url
      });

      if (!res.ok) throw new Error("ลบภาพปกไม่สำเร็จ");

      showToast("🗑️ ลบภาพปกเรียบร้อย!", "success");
      setProduct((prev) => ({ ...prev, image_url: "" })); // ✅ อัปเดต state
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // ✅ โหลดข้อมูลสินค้า + categories
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [prodRes, catRes] = await Promise.all([
  //         fetch(`${apiEndpoint}/products/${id}`),
  //         fetch(`${apiEndpoint}/categories`),
  //       ]);

  //       if (!prodRes.ok) throw new Error("ไม่สามารถโหลดข้อมูลสินค้าได้");

  //       const prodData = await prodRes.json();
  //       const catData = await catRes.json();

  //       if (catData.success) setCategories(catData.data || []);

  //       const p = prodData.data.product || {};

  //       setProduct({
  //         name: p.name ?? "",
  //         slug: p.slug ?? "",
  //         sku: p.sku ?? "",
  //         category_id: p.category_id ?? "",
  //         description: p.description ?? "",
  //         price: parseFloat(p.price ?? 0),
  //         stock_quantity: p.stock_quantity ?? 0,
  //         image_url: p.image_url
  //           ? p.image_url.startsWith("http")
  //             ? p.image_url
  //             : `${apiEndpoint.replace("/api", "")}${p.image_url}`
  //           : "",
  //         is_active: Number(p.is_active ?? 1),
  //       });
  //     } catch (err) {
  //       console.error(err);
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // ✅ ฟังก์ชันบันทึกสินค้า
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiEndpoint}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("การอัปเดตล้มเหลว");

      showToast("บันทึกการแก้ไขสินค้าเรียบร้อย!", "success");
      setTimeout(() => navigate("/admin/products"), 1200);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="font-semibold text-sm">กำลังโหลดข้อมูลสินค้า...</p>
        </div>
      </div>
    );
  }
  if (error)
    return (
      <div className="p-10 text-center text-rose-500 font-bold">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      {/* ✅ Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-right">
          <div
            className={`p-4 rounded-xl shadow-xl flex items-center gap-3 border-l-4 ${
              toast.type === "success"
                ? "bg-white border-emerald-500 text-emerald-600"
                : "bg-white border-rose-500 text-rose-600"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-bold">ย้อนกลับ</span>
        </button>
        <h2 className="text-2xl font-black text-slate-800">แก้ไขสินค้า</h2>
        <div className="w-20"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-6">
          {/* ข้อมูลทั่วไป */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Package size={18} className="text-indigo-500" /> ข้อมูลทั่วไป
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">
                ชื่อสินค้า
              </label>
              <input
                required
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="ระบุชื่อสินค้า..."
                className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                  <Tag size={12} /> Slug (URL)
                </label>
                <input
                  name="slug"
                  value={product.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                  <Database size={12} /> SKU
                </label>
                <input
                  name="sku"
                  value={product.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                <Info size={12} /> รายละเอียดสินค้า
              </label>
              <textarea
                name="description"
                rows="4"
                value={product.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
              />
            </div>
          </div>

          {/* ✅ รูปภาพสินค้า */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <ImageIcon size={18} className="text-indigo-500" /> รูปปกสินค้า
            </h3>

            {/* ✅ รูปหลัก */}
            {product.image_url ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-100 aspect-video bg-slate-50">
                <img
                  src={product.image_url}
                  alt="main"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={handleDeleteMainImage}
                  className="absolute top-2 right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md p-2 shadow opacity-80 hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              // ✅ กรณีไม่มีรูปปก
              <div className="aspect-video rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                <ImageIcon size={40} className="opacity-50 mb-2" />
                <p className="text-sm font-medium">ยังไม่มีรูปปกสินค้า</p>

                {/* ปุ่มอัปโหลดแสดงในกรอบนี้เลย */}
                <label
                  htmlFor="uploadMainImage"
                  className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all shadow-sm
        ${
          uploading
            ? "bg-slate-300 text-slate-600 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-700 text-white"
        }`}
                >
                  <ImageIcon size={16} />
                  {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูป"}
                  <input
                    id="uploadMainImage"
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={handleUploadMainImage}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* รูปเพิ่มเติม */}
            {/* ✅ รูปภาพเพิ่มเติม */}
            <div>
              <label className="text-xs font-black uppercase text-slate-400 ml-1 block mb-2">
                รูปภาพรายละเอียดสินค้า
              </label>

              {productImages.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {productImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.image_url}
                        alt={`Product ${idx}`}
                        className="rounded-xl border border-slate-200 object-cover w-full h-24"
                      />
                      <span className="absolute top-1 left-1 bg-white/80 text-[10px] rounded-md px-2 py-0.5 font-bold">
                        #{img.sort_order}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute top-1 right-1 bg-rose-500 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                // ✅ กรณีไม่มีรูปเพิ่มเติม
                <div className="rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 text-slate-400 py-8">
                  <ImageIcon size={36} className="opacity-50 mb-2" />
                  <p className="text-sm font-medium">ยังไม่มีรูปภาพเพิ่มเติม</p>
                </div>
              )}
            </div>

            {/* อัปโหลดรูปภาพจากเครื่อง */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">
                เพิ่มรูปภาพใหม่จากเครื่อง
              </label>

              <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* ปุ่มเลือกไฟล์ */}
                <label
                  htmlFor="uploadImage"
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold cursor-pointer transition-all shadow-sm
                        ${
                          uploading
                            ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                >
                  <ImageIcon size={18} />
                  {uploading ? "กำลังอัปโหลด..." : "เลือกไฟล์"}
                  <input
                    id="uploadImage"
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={handleUploadImage}
                    className="hidden"
                  />
                </label>

                {/* แสดงชื่อไฟล์ */}
                <div className="text-sm text-slate-500 truncate max-w-[200px]">
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-slate-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      กำลังอัปโหลด...
                    </span>
                  ) : (
                    <span id="fileName" className="italic">
                      {/* ยังไม่ได้เลือกไฟล์ */}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* การตั้งค่า */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <DollarSign size={18} className="text-emerald-500" /> ราคา & สต็อก
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">
                ราคา
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-emerald-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">
                จำนวนในสต็อก
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={product.stock_quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            {/* ✅ dropdown หมวดหมู่ */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                <Layers size={12} /> หมวดหมู่สินค้า
              </label>
              <select
                name="category_id"
                value={product.category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ✅ สถานะสินค้า */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-700 mb-4">สถานะสินค้า</h3>

            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-600">
                {product.is_active ? "เปิดการใช้งาน" : "ปิดการใช้งาน"}
              </span>

              <button
                type="button"
                onClick={() =>
                  setProduct((prev) => ({
                    ...prev,
                    is_active: prev.is_active ? 0 : 1,
                  }))
                }
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${
                  product.is_active ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
                    product.is_active ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              ใช้เปิด/ปิดการแสดงผลสินค้านี้ในหน้าร้าน
            </p>
          </div>

          {/* ปุ่มบันทึก */}
          <button
            type="submit"
            disabled={saving}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              saving
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
            }`}
          >
            {saving ? (
              "กำลังบันทึก..."
            ) : (
              <>
                <Save size={20} /> บันทึกการเปลี่ยนแปลง
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
