import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Search, Edit2, Trash2, 
  Layers, ChevronRight, Hash, Package 
} from "lucide-react";

const initialCategories = [
  { id: 1, name: "อาหารสุนัข", slug: "dog-food", productCount: 124, status: "Active" },
  { id: 2, name: "อาหารแมว", slug: "cat-food", productCount: 89, status: "Active" },
  { id: 3, name: "ของเล่นสัตว์เลี้ยง", slug: "pet-toys", productCount: 45, status: "Active" },
  { id: 4, name: "อุปกรณ์ทำความสะอาด", slug: "grooming", productCount: 12, status: "Inactive" },
];

export default function CategoryManagement() {
  const navigate = useNavigate();
  const [categories] = useState(initialCategories);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">จัดการหมวดหมู่</h2>
          <p className="text-slate-500 text-sm">จัดการประเภทสินค้าเพื่อให้ง่ายต่อการเลือกซื้อ</p>
        </div>
        <button 
          onClick={() => navigate("/admin/categories/add")}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          เพิ่มหมวดหมู่ใหม่
        </button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Layers size={24}/></div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">หมวดหมู่ทั้งหมด</p>
              <p className="text-2xl font-black text-slate-800">{categories.length}</p>
            </div>
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
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4 text-center font-bold text-slate-400 text-sm">{idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">{cat.name}</td>
                  <td className="px-6 py-4"><span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">/{cat.slug}</span></td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700 text-sm">
                    <div className="flex items-center justify-center gap-1">
                      <Package size={14} className="text-slate-400"/> {cat.productCount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                      cat.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-400 border-slate-200"
                    }`}>
                      {cat.status === "Active" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}