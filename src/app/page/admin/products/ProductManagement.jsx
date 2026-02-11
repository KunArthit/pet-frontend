import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Search, Edit2, Trash2, Filter,
  Image as ImageIcon, AlertCircle, X, CheckCircle2 
} from "lucide-react";

const initialProducts = [
  { id: 1, name: "อาหารสุนัขเกรดพรีเมียม 10kg", category: "อาหารสุนัข", price: 1250, stock: 45, status: "พร้อมขาย", image: null },
  { id: 2, name: "คอนโดแมว 3 ชั้น", category: "อุปกรณ์แมว", price: 2900, stock: 8, status: "สต็อกน้อย", image: null },
  { id: 3, name: "แชมพูสูตรอ่อนโยน", category: "ความสะอาด", price: 350, stock: 0, status: "ของหมด", image: null },
  { id: 4, name: "ปลอกคอหนังแท้", category: "เครื่องประดับ", price: 590, stock: 120, status: "พร้อมขาย", image: null },
];

export default function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  // ฟังก์ชันเปิด Modal ยืนยันการลบ
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // ฟังก์ชันลบจริง (จำลอง)
  const handleDelete = () => {
    setProducts(products.filter(p => p.id !== productToDelete.id));
    showToast(`ลบ "${productToDelete.name}" สำเร็จ`);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500">

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-white border-l-4 border-emerald-500 shadow-2xl rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500" size={20} />
            <span className="font-bold text-slate-800 text-sm">{toast.message}</span>
          </div>
        </div>
      )}
      
      {/* --- Header Section --- */}
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

      {/* --- Search & Filter --- */}
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

      {/* --- Table --- */}
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
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                        <ImageIcon size={18} />
                      </div>
                      <span className="font-bold text-slate-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{product.category}</td>
                  <td className="px-6 py-4 font-bold">฿{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      product.status === "พร้อมขาย" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button>
                      {/* ปุ่มลบที่เรียก confirmDelete */}
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
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modal ยืนยันการลบ --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          
          {/* Content */}
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
                คุณกำลังจะลบ <span className="font-bold text-slate-800">"{productToDelete?.name}"</span> ออกจากระบบ การดำเนินการนี้ไม่สามารถย้อนกลับได้
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