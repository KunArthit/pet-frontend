import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, FilePlus, Eye, Download, 
  FileText, Calendar, User, CheckCircle, 
  Clock, XCircle, MoreVertical, Filter 
} from "lucide-react";

const initialQuotes = [
  { id: "QT-2026-001", customer: "โรงแรมสุนัขแฮปปี้", total: 15800, status: "Sent", date: "2026-02-05", expires: "2026-03-05" },
  { id: "QT-2026-002", customer: "บริษัท เพ็ทแคร์ จำกัด", total: 42000, status: "Accepted", date: "2026-02-07", expires: "2026-03-07" },
  { id: "QT-2026-003", customer: "คุณวิชัย มานะ", total: 5400, status: "Draft", date: "2026-02-08", expires: "2026-03-08" },
  { id: "QT-2026-004", customer: "คลินิกรักษาสัตว์บางนา", total: 28500, status: "Expired", date: "2026-01-10", expires: "2026-02-10" },
];

export default function QuotationManagement() {
  const navigate = useNavigate();
  const [quotes] = useState(initialQuotes);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">จัดการใบเสนอราคา</h2>
          <p className="text-slate-500 text-sm">สร้างและติดตามสถานะใบเสนอราคาเสนอให้ลูกค้า</p>
        </div>
        <button 
        onClick={() => navigate("/admin/quotations/add")}
        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all">
          <FilePlus size={20} /> ออกใบเสนอราคาใหม่
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuoteSummaryCard label="ฉบับร่าง" value="1" color="text-slate-500" bg="bg-slate-100" icon={FileText} />
        <QuoteSummaryCard label="ส่งแล้ว" value="1" color="text-blue-500" bg="bg-blue-50" icon={Clock} />
        <QuoteSummaryCard label="ยืนยันแล้ว" value="1" color="text-emerald-500" bg="bg-emerald-50" icon={CheckCircle} />
        <QuoteSummaryCard label="หมดอายุ" value="1" color="text-rose-500" bg="bg-rose-50" icon={XCircle} />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="ค้นหาเลขที่หรือชื่อลูกค้า..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">เลขที่ใบเสนอราคา</th>
                <th className="px-6 py-4">ลูกค้า</th>
                <th className="px-6 py-4">ยอดสุทธิ</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-indigo-600 text-sm">{quote.id}</div>
                    <div className="text-[10px] text-slate-400">ออกเมื่อ: {quote.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700">{quote.customer}</div>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-800 text-sm">฿{quote.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <QuoteStatusBadge status={quote.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => navigate(`/admin/quotations/${quote.id}`)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Eye size={16}/></button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"><Download size={16}/></button>
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

function QuoteSummaryCard({ label, value, color, bg, icon: Icon }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bg} ${color}`}><Icon size={20}/></div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
        <p className="text-xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function QuoteStatusBadge({ status }) {
  const styles = {
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
    Sent: "bg-blue-50 text-blue-600 border-blue-100",
    Accepted: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Expired: "bg-rose-50 text-rose-600 border-rose-100",
  };
  return <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${styles[status]}`}>{status}</span>;
}