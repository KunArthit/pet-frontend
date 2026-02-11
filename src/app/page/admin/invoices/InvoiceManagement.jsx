import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // เพิ่มการนำทาง
import { 
  Search, 
  FileText, 
  Download, 
  Printer, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  DollarSign
} from "lucide-react";

const initialInvoices = [
  { id: "INV-2024-001", customer: "วิภาวดี แมวเหมียว", amount: 4650, status: "Paid", date: "2024-03-20", dueDate: "2024-03-20" },
  { id: "INV-2024-002", customer: "สมชาย รักสุนัข", amount: 1200, status: "Pending", date: "2024-03-21", dueDate: "2024-03-25" },
  { id: "INV-2024-003", customer: "John Doe", amount: 850, status: "Overdue", date: "2024-03-10", dueDate: "2024-03-15" },
  { id: "INV-2024-004", customer: "กมลวรรณ ทาสแมว", amount: 3200, status: "Paid", date: "2024-03-18", dueDate: "2024-03-18" },
];

export default function InvoiceManagement() {
  const navigate = useNavigate(); // ประกาศตัวแปรนำทาง
  const [invoices] = useState(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">จัดการใบแจ้งหนี้</h2>
          <p className="text-slate-500 text-sm">ตรวจสอบประวัติการชำระเงินและออกใบกำกับภาษี</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InvoiceStatCard label="ยอดชำระแล้ววันนี้" value="฿24,500" icon={CheckCircle2} color="text-emerald-500" bg="bg-emerald-50" />
        <InvoiceStatCard label="รอการชำระ" value="฿8,900" icon={Clock} color="text-amber-500" bg="bg-amber-50" />
        <InvoiceStatCard label="เกินกำหนดชำระ" value="฿1,250" icon={AlertTriangle} color="text-rose-500" bg="bg-rose-50" />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="ค้นหาเลขที่ใบแจ้งหนี้ หรือชื่อลูกค้า..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-medium text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={18} /> ช่วงเวลา
        </button>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">เลขที่ใบแจ้งหนี้</th>
                <th className="px-6 py-4">ลูกค้า</th>
                <th className="px-6 py-4">ยอดสุทธิ</th>
                <th className="px-6 py-4">วันครบกำหนด</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-center">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-bold text-indigo-600">
                      <FileText size={16} /> {inv.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{inv.customer}</td>
                  <td className="px-6 py-4 font-black text-slate-800">฿{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-500">
                    {inv.dueDate}
                  </td>
                  <td className="px-6 py-4">
                    <InvoiceStatus status={inv.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      {/* ปุ่มนำทางไปหน้า Detail */}
                      <button 
                        onClick={() => navigate(`/admin/invoices/${inv.id}`)}
                        title="ดูรายละเอียด" 
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <ExternalLink size={16} />
                      </button>
                      {/* <button title="พิมพ์" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><Printer size={16} /></button> */}
                      {/* <button title="ดาวน์โหลด PDF" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Download size={16} /></button> */}
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

// Sub-components
function InvoiceStatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl ${bg} ${color}`}><Icon size={24} /></div>
    </div>
  );
}

function InvoiceStatus({ status }) {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Overdue: "bg-rose-50 text-rose-600 border-rose-100",
  };
  const labels = { Paid: "ชำระแล้ว", Pending: "รอชำระ", Overdue: "เกินกำหนด" };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}