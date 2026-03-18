import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  Package,
  AlertCircle,
  Loader,
} from "lucide-react";

const apiEndpoint =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

export default function CategoryManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // -------------------------------------------------------------
  // โหลดข้อมูลหมวดหมู่
  // -------------------------------------------------------------
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        "";
      const res = await fetch(`${apiEndpoint}/categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      if (data.success) {
        // ตรวจสอบให้แน่ใจว่าเป็น Array
        setCategories(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message || "ไม่สามารถโหลดข้อมูลได้");
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError("เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // -------------------------------------------------------------
  // ระบบค้นหา (Filter)
  // -------------------------------------------------------------
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (cat) =>
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  // -------------------------------------------------------------
  // ลบหมวดหมู่
  // -------------------------------------------------------------
  const handleDelete = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);

    try {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        "";
      const res = await fetch(`${apiEndpoint}/categories/${confirmDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await fetchCategories();
        setConfirmDelete(null);
      } else {
        alert(data.message || "ไม่สามารถลบหมวดหมู่นี้ได้");
        setConfirmDelete(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">จัดการหมวดหมู่</h2>
          <p className="text-slate-500 text-sm">
            จัดการประเภทสินค้าเพื่อให้ง่ายต่อการเลือกซื้อ
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/categories/add")}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          เพิ่มหมวดหมู่ใหม่
        </button>
      </div>

      {/* Category Stats & Search */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 md:w-1/3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
              หมวดหมู่ทั้งหมด
            </p>
            <p className="text-2xl font-black text-slate-800">
              {categories.length}
            </p>
          </div>
        </div>

        {/* ช่อง Search */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex-1 flex items-center">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="ค้นหาหมวดหมู่ หรือ Slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-center w-20">#</th>
                <th className="px-6 py-4">ชื่อหมวดหมู่</th>
                <th className="px-6 py-4">URL Slug</th>
                <th className="px-6 py-4 text-center">จำนวนสินค้า</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    <Loader className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-2" />
                    <p className="text-slate-400 font-medium">
                      กำลังโหลดข้อมูล...
                    </p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                    <p className="text-rose-500 font-medium">{error}</p>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-slate-400 font-medium"
                  >
                    {searchTerm
                      ? "ไม่พบหมวดหมู่ที่ค้นหา"
                      : "ยังไม่มีข้อมูลหมวดหมู่ในระบบ"}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-center font-bold text-slate-400 text-sm">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
                        /{cat.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-700 text-sm">
                      <div className="flex items-center justify-center gap-1">
                        <Package size={14} className="text-slate-400" />{" "}
                        {cat.product_count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                          cat.is_active === 1
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-slate-100 text-slate-400 border-slate-200"
                        }`}
                      >
                        {cat.is_active === 1 ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/categories/edit/${cat.id}`)
                          }
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="แก้ไขหมวดหมู่"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(cat)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="ลบหมวดหมู่"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔴 Modal ยืนยันการลบ */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 w-full max-w-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-rose-50 to-transparent z-0"></div>

            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white border-4 border-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Trash2 size={28} />
              </div>
              <h3 className="font-black text-xl mb-2 text-slate-800">
                ยืนยันการลบหมวดหมู่
              </h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                ต้องการลบหมวดหมู่{" "}
                <span className="font-bold text-slate-800">
                  "{confirmDelete.name}"
                </span>{" "}
                ใช่หรือไม่?
                <br />
                <span className="text-xs text-rose-500 font-bold mt-1 block">
                  หากมีสินค้าผูกอยู่ จะไม่สามารถลบได้
                </span>
              </p>

              <div className="flex gap-3">
                <button
                  disabled={isDeleting}
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <Loader size={18} className="animate-spin" />
                  ) : null}
                  {isDeleting ? "กำลังลบ..." : "ยืนยัน"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
