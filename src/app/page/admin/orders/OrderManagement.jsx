import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Eye, Truck, CheckCircle, Clock, AlertCircle, Loader, Wallet, Package
} from "lucide-react";

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export default function OrderManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "all", label: "ทั้งหมด" },
    { id: "pending", label: "รอชำระเงิน" },
    { id: "processing", label: "รอตรวจสอบยอดเงิน" },
    { id: "paid", label: "รอการจัดส่ง" },
    { id: "shipped", label: "กำลังจัดส่ง" },
    { id: "completed", label: "ส่งสำเร็จ" },
    { id: "cancelled", label: "ยกเลิก" }
  ];

  // 1. ดึงข้อมูลคำสั่งซื้อ
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const res = await fetch(`${apiEndpoint}/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. กรองข้อมูลตาม Tab และ Search
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchTab = activeTab === "all" || o.status === activeTab;
      const matchSearch = o.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.shipping_name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [orders, activeTab, searchTerm]);

  // 3. ฟังก์ชันอัปเดตสถานะ
  // const updateStatus = async (orderId, newStatus) => {
  //   try {
  //     const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  //     const res = await fetch(`${apiEndpoint}/orders/${orderId}/status`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`
  //       },
  //       body: JSON.stringify({ status: newStatus })
  //     });
      
  //     if (res.ok) {
  //       // อัปเดต UI ทันที
  //       setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  //     } else {
  //       alert("อัปเดตสถานะไม่สำเร็จ");
  //     }
  //   } catch (err) {
  //     console.error("Update status error:", err);
  //   }
  // };

  // ✅ 4. คำนวณจำนวนสถานะ
  const stats = useMemo(() => {
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      paid: orders.filter(o => o.status === 'paid').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
    };
  }, [orders]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-800">จัดการคำสั่งซื้อ</h2>
        <p className="text-slate-500 text-sm">ตรวจสอบและอัปเดตสถานะการจัดส่งสินค้าให้ลูกค้า</p>
      </div>

      {/* ✅ Stats Summary (ปรับปรุงใหม่ เพิ่มสถานะที่จำเป็น) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0"><Clock size={20}/></div>
          <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">รอชำระเงิน</p><p className="text-xl font-black text-slate-800">{stats.pending}</p></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0"><Wallet size={20}/></div>
          <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">รอตรวจยอดเงิน</p><p className="text-xl font-black text-slate-800">{stats.processing}</p></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0"><Package size={20}/></div>
          <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">รอการจัดส่ง</p><p className="text-xl font-black text-slate-800">{stats.paid}</p></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><Truck size={20}/></div>
          <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">กำลังจัดส่ง</p><p className="text-xl font-black text-slate-800">{stats.shipped}</p></div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="ค้นหาเลขที่บิล, ชื่อลูกค้า..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" 
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">ลูกค้า</th>
                <th className="px-6 py-4">ยอดรวม</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10"><Loader className="w-6 h-6 animate-spin mx-auto text-indigo-500"/></td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400">ไม่พบคำสั่งซื้อ</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{order.order_number}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-700">{order.shipping_name}</div>
                      <div className="text-[10px] text-slate-400">{new Date(order.created_at).toLocaleDateString('th-TH')}</div>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 text-sm">฿{Number(order.total_amount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* <select 
                          className="text-xs border border-slate-200 rounded-lg p-1 outline-none bg-slate-50 font-semibold text-slate-600"
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                        >
                          {tabs.filter(t => t.id !== "all").map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select> */}
                        <button 
                          onClick={() => navigate(`/admin/orders/${order.order_number}`)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="ดูรายละเอียด"
                        >
                          <Eye size={16}/>
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
    </div>
  );
}

function StatusBadge({ status }) {
  const meta = {
    pending: { label: "รอชำระเงิน", css: "bg-amber-50 text-amber-600 border-amber-100" },
    processing: { label: "รอตรวจยอดเงิน", css: "bg-blue-50 text-blue-600 border-blue-100" },
    paid: { label: "รอการจัดส่ง", css: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    shipped: { label: "กำลังจัดส่ง", css: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" },
    completed: { label: "ส่งสำเร็จ", css: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    cancelled: { label: "ยกเลิก", css: "bg-rose-50 text-rose-600 border-rose-100" },
  };
  
  const current = meta[status?.toLowerCase()] || { label: status, css: "bg-slate-100 text-slate-600" };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${current.css}`}>
      {current.label}
    </span>
  );
}