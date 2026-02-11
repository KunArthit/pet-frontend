import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  MoreHorizontal,
  Package
} from "lucide-react";

const initialOrders = [
  { id: "ORD-9901", customer: "วิภาวดี แมวเหมียว", total: 4500, status: "Pending", date: "2024-03-20", items: 3 },
  { id: "ORD-9902", customer: "สมชาย รักสุนัข", total: 1200, status: "Processing", date: "2024-03-19", items: 1 },
  { id: "ORD-9903", customer: "John Doe", total: 850, status: "Shipped", date: "2024-03-18", items: 2 },
  { id: "ORD-9904", customer: "กมลวรรณ ทาสแมว", total: 3200, status: "Delivered", date: "2024-03-17", items: 5 },
];

export default function OrderManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState(initialOrders);

  // ฟังก์ชันเปลี่ยนสถานะ (จำลองการอัปเดต)
  const updateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const tabs = ["All", "Pending", "Processing", "Shipped", "Delivered"];

  const filteredOrders = activeTab === "All" 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-800">จัดการคำสั่งซื้อ</h2>
        <p className="text-slate-500 text-sm">ตรวจสอบและอัปเดตสถานะการจัดส่งสินค้าให้ลูกค้า</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={20}/></div>
          <div><p className="text-xs text-slate-400 font-bold uppercase">รอการตรวจสอบ</p><p className="text-xl font-black text-slate-800">5 ออเดอร์</p></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Truck size={20}/></div>
          <div><p className="text-xs text-slate-400 font-bold uppercase">กำลังจัดส่ง</p><p className="text-xl font-black text-slate-800">12 ออเดอร์</p></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={20}/></div>
          <div><p className="text-xs text-slate-400 font-bold uppercase">สำเร็จแล้ววันนี้</p><p className="text-xl font-black text-slate-800">28 ออเดอร์</p></div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="ค้นหา Order ID..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
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
                <th className="px-6 py-4 text-center">จัดการสถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700">{order.customer}</div>
                    <div className="text-[10px] text-slate-400">{order.items} รายการ | {order.date}</div>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-800 text-sm">฿{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <select 
                        className="text-xs border border-slate-200 rounded-lg p-1 outline-none bg-slate-50 font-semibold text-slate-600"
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        {tabs.filter(t => t !== "All").map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                        <button 
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                        <Eye size={16}/>
                        </button>
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

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Processing: "bg-blue-50 text-blue-600 border-blue-100",
    Shipped: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${styles[status]}`}>
      {status}
    </span>
  );
}