import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Printer, Download, Mail, 
  FileText, Calendar, User, CreditCard, 
  CheckCircle2, AlertTriangle, Hash, Building
} from "lucide-react";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับการพิมพ์
  const handlePrint = () => {
    window.print();
  };

  const invoice = {
    id: id || "INV-2026-001",
    orderId: "ORD-9901",
    date: "2026-02-09",
    dueDate: "2026-02-16",
    status: "Paid",
    customer: {
      name: "วิภาวดี แมวเหมียว",
      address: "123/45 หมู่บ้านเพ็ทเทอร์เรน แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
      taxId: "0-1155-00044-22-1"
    },
    items: [
      { id: 1, name: "อาหารสุนัขเกรดพรีเมียม 10kg", price: 1250, qty: 2, total: 2500 },
      { id: 2, name: "คอนโดแมว 3 ชั้น", price: 2000, qty: 1, total: 2000 },
    ],
    subtotal: 4500,
    vat: 315,
    grandTotal: 4815
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 px-4">
      
      {/* ส่วนควบคุม: จะถูกซ่อนเมื่อสั่งพิมพ์ด้วย CSS ด้านล่าง */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button 
          onClick={() => navigate("/admin/invoices")} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-colors"
        >
          <ArrowLeft size={20} /> กลับหน้าจัดการ
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer size={18} /> พิมพ์ใบกำกับ
          </button>
          <button 
            onClick={handlePrint} // ในที่นี้ใช้ window.print เพื่อเลือก Save as PDF ได้เช่นกัน
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
          >
            <Download size={18} /> ดาวน์โหลด PDF
          </button>
        </div>
      </div>

      {/* สไตล์สำหรับการพิมพ์ (Print Styles) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* ซ่อน Sidebar, Navbar และปุ่มต่างๆ */
          .no-print, aside, header, nav, button {
            display: none !important;
          }
          
          /* ขยายเนื้อหาให้เต็มหน้ากระดาษ */
          body, .max-w-4xl {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            background-color: white !important;
          }

          /* ลบเงาและขอบมนของ Card ออกเพื่อให้ดูเป็นเอกสารจริง */
          .bg-white {
            box-shadow: none !important;
            border: none !important;
          }

          .rounded-[2.5rem] {
            border-radius: 0 !important;
          }

          /* ปรับสีตัวอักษรให้เข้มชัดเจนเวลาพิมพ์ */
          .text-slate-400, .text-slate-500 {
            color: #475569 !important;
          }
          
          .text-indigo-600 {
            color: #4f46e5 !important;
          }
        }
      `}} />

      {/* Invoice Document Card */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative print:m-0">
        <div className={`py-3 px-8 text-center text-xs font-black uppercase tracking-[0.2em] no-print ${
          invoice.status === "Paid" ? "bg-emerald-500 text-white" : "bg-amber-400 text-white"
        }`}>
          {invoice.status === "Paid" ? "Payment Received" : "Awaiting Payment"}
        </div>

        <div className="p-8 sm:p-12 space-y-10">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4">
              <div className="text-3xl font-black text-indigo-600 italic tracking-tighter">PETTERAIN</div>
              <div className="text-sm text-slate-500 leading-relaxed">
                <p className="font-bold text-slate-800 uppercase">Petterain Co., Ltd.</p>
                <p>123 Sukhumvit Road, Khlong Toei</p>
                <p>Bangkok, Thailand 10110</p>
                <p className="font-bold">Tax ID: 0105563000123</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tight">Invoice</h1>
              <p className="text-indigo-600 font-black text-xl">{invoice.id}</p>
              <div className="pt-4 space-y-1 text-sm">
                <p className="font-bold text-slate-400">Date: <span className="text-slate-800">{invoice.date}</span></p>
                <p className="font-bold text-slate-400">Due Date: <span className="text-rose-500">{invoice.dueDate}</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 print:bg-white print:border-slate-200">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Customer Details</h4>
              <p className="font-black text-slate-800">{invoice.customer.name}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{invoice.customer.address}</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Payment Info</h4>
              <p className="text-sm text-slate-600 font-bold">Tax ID: <span className="text-slate-800">{invoice.customer.taxId}</span></p>
              <p className="text-sm text-slate-600 font-bold">Method: <span className="text-slate-800">Bank Transfer</span></p>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-800 text-[10px] font-black uppercase text-slate-400">
                <th className="py-4">Description</th>
                <th className="py-4 text-center">Qty</th>
                <th className="py-4 text-right">Price</th>
                <th className="py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-6 text-sm text-slate-700 font-bold">{item.name}</td>
                  <td className="py-6 text-center text-sm">{item.qty}</td>
                  <td className="py-6 text-right text-sm">฿{item.price.toLocaleString()}</td>
                  <td className="py-6 text-right font-black text-slate-800">฿{item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end pt-6">
            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-black uppercase">Subtotal</span>
                <span className="text-slate-800 font-black">฿{invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-black uppercase">VAT (7%)</span>
                <span className="text-slate-800 font-black">฿{invoice.vat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t-2 border-slate-800">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">Grand Total</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tighter">฿{invoice.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}