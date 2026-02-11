import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Filter, 
  DollarSign, 
  CreditCard,
  Image as ImageIcon
} from "lucide-react";

const initialPayments = [
  { id: "PAY-1001", orderId: "ORD-9901", customer: "วิภาวดี แมวเหมียว", amount: 4650, method: "Bank Transfer", status: "Pending", date: "2026-02-09 10:15" },
  { id: "PAY-1002", orderId: "ORD-9902", customer: "สมชาย รักสุนัข", amount: 1200, method: "QR Payment", status: "Verified", date: "2026-02-09 09:30" },
  { id: "PAY-1003", orderId: "ORD-9903", customer: "John Doe", amount: 850, method: "Credit Card", status: "Verified", date: "2026-02-08 18:20" },
  { id: "PAY-1004", orderId: "ORD-9904", customer: "กมลวรรณ ทาสแมว", amount: 3200, status: "Rejected", date: "2026-02-08 14:00" },
];

export default function PaymentManagement() {
  const navigate = useNavigate();
  const [payments] = useState(initialPayments);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">จัดการการชำระเงิน</h2>
          <p className="text-slate-500 text-sm">ตรวจสอบหลักฐานและยืนยันยอดเงินเข้าจากลูกค้า</p>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">รอตรวจสอบ</p>
            <p className="text-2xl font-black text-amber-500">1 รายการ</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 text-amber-500"><Clock size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">ยืนยันแล้ววันนี้</p>
            <p className="text-2xl font-black text-emerald-500">฿5,850</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-500"><CheckCircle2 size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">วิธีการชำระส่วนใหญ่</p>
            <p className="text-2xl font-black text-indigo-500">Bank Transfer</p>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-500"><DollarSign size={24} /></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="ค้นหาเลขที่รายการ หรือชื่อลูกค้า..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">ลูกค้า</th>
                <th className="px-6 py-4">ยอดเงิน</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">{pay.id}</td>
                  <td className="px-6 py-4 text-indigo-600 font-bold text-xs">{pay.orderId}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700">{pay.customer}</div>
                    <div className="text-[10px] text-slate-400">{pay.date}</div>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-800 text-sm">฿{pay.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <PaymentStatusBadge status={pay.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => navigate(`/admin/payments/${pay.id}`)} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-xs hover:bg-indigo-100 transition-all">
                        <Eye size={14} /> ตรวจสอบสลิป
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

function PaymentStatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Verified: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Rejected: "bg-rose-50 text-rose-600 border-rose-100",
  };
  const labels = { Pending: "รอตรวจสอบ", Verified: "ยืนยันแล้ว", Rejected: "ปฏิเสธ" };
  return <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${styles[status]}`}>{labels[status]}</span>;
}