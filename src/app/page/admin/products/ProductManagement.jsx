import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Search, Edit2, Trash2, Filter,
  Image as ImageIcon, AlertCircle, X, CheckCircle2
} from "lucide-react";

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

export default function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState(true);

  // ✅ โหลดข้อมูลจริงจาก API
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${apiEndpoint}/products`),
          fetch(`${apiEndpoint}/categories`)
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (catData.success) setCategories(catData.data);

        if (prodData.success && Array.isArray(prodData.data)) {
          const formatted = prodData.data.map((p) => {
            const cat = catData.data.find((c) => c.id === p.category_id);
            return {
              id: p.id,
              name: p.name,
              category: cat ? cat.name : "ไม่ทราบหมวดหมู่",
              price: parseFloat(p.price),
              stock: p.stock_quantity,
              status: p.is_active ? "พร้อมขาย" : "ไม่พร้อมขาย",
              image: p.image_url
                ? p.image_url.startsWith("http")
                  ? p.image_url
                  : `${apiEndpoint.replace("/api", "")}${p.image_url}`
                : null,
            };
          });
          setProducts(formatted);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${apiEndpoint}/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== productToDelete.id));
        showToast(`ลบ "${productToDelete.name}" สำเร็จ`);
      } else {
        showToast("ลบไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      showToast("เกิดข้อผิดพลาดในการลบ");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        กำลังโหลดข้อมูลสินค้า...
      </div>
    );
  }

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500">

      {/* ✅ Toast */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-white border-l-4 border-emerald-500 shadow-2xl rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500" size={20} />
            <span className="font-bold text-slate-800 text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">จัดการสินค้า</h2>
          <p className="text-slate-500 text-sm">เพิ่ม แก้ไข และดูแลรายการสินค้าในร้านของคุณ</p>
        </div>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
          <Filter size={16} /> หมวดหมู่
        </button>
      </div>

      {/* ✅ Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                <th className="px-6 py-4">สินค้า</th>
                <th className="px-6 py-4">หมวดหมู่</th>
                <th className="px-6 py-4">ราคา</th>
                <th className="px-6 py-4">สต็อก</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={18} className="text-slate-400" />
                        )}
                      </div>
                      <span className="font-bold text-slate-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{product.category}</td>
                  <td className="px-6 py-4 font-bold">฿{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        product.status === "พร้อมขาย"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* ✅ ปุ่มแก้ไข ไปหน้า EditProduct */}
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* ปุ่มลบ */}
                      <button
                        onClick={() => confirmDelete(product)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">
                    ไม่พบสินค้า
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal ยืนยันการลบ */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-200">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">ยืนยันการลบสินค้า?</h3>
              <p className="text-slate-500 text-sm mb-8">
                คุณกำลังจะลบ{" "}
                <span className="font-bold text-slate-800">
                  "{productToDelete?.name}"
                </span>{" "}
                ออกจากระบบ การดำเนินการนี้ไม่สามารถย้อนกลับได้
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all"
                >
                  ใช่, ลบเลย
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}