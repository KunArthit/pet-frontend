import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download, Mail, Send, FileCheck, Building2, MapPin, Phone,User } from "lucide-react";

export default function QuotationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button onClick={() => navigate("/admin/quotations")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-colors">
          <ArrowLeft size={20} /> กลับไปหน้ารวม
        </button>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"><Printer size={18}/> พิมพ์</button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all"><Send size={18}/> ส่งให้ลูกค้า</button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"><FileCheck size={18}/> อนุมัติเป็นออเดอร์</button>
        </div>
      </div>

      {/* Main Quotation Paper */}
      <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Ribbon Status */}
        <div className="bg-indigo-600 h-2 w-full" />
        
        <div className="p-12 space-y-12">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl mb-2 italic">
                PETTERAIN
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                123/45 ถนนนวมินทร์ แขวงนวมินทร์<br />
                เขตบึงกุ่ม กรุงเทพมหานคร 10240<br />
                เลขผู้เสียภาษี: 0-1234-56789-01-2
              </p>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-black text-slate-800 mb-2 uppercase tracking-tight">ใบเสนอราคา</h1>
              <p className="text-indigo-600 font-bold text-lg">{id || "QT-2026-001"}</p>
              <div className="mt-4 space-y-1 text-sm">
                <p className="text-slate-400 font-bold">วันที่ออก: <span className="text-slate-800">2026-02-05</span></p>
                <p className="text-slate-400 font-bold">วันหมดอายุ: <span className="text-rose-500">2026-03-05</span></p>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-2 gap-12 py-8 border-y border-slate-100">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">ข้อมูลลูกค้า</h4>
              <div className="flex items-start gap-3">
                <Building2 className="text-slate-300 mt-1" size={18}/>
                <div>
                  <p className="font-black text-slate-800 text-lg">โรงแรมสุนัขแฮปปี้ (สำนักงานใหญ่)</p>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                    88 ถนนพระราม 9 แขวงห้วยขวาง<br />เขตห้วยขวาง กรุงเทพฯ 10310
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">ข้อมูลการติดต่อ</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-slate-600 text-sm"><User size={16} className="text-slate-300"/> คุณสิรินธร (ผู้จัดการ)</div>
                <div className="flex items-center gap-3 text-slate-600 text-sm"><Phone size={16} className="text-slate-300"/> 02-555-xxxx</div>
                <div className="flex items-center gap-3 text-slate-600 text-sm"><Mail size={16} className="text-slate-300"/> contact@happyhotel.com</div>
              </div>
            </div>
          </div>

          {/* Table Items */}
          <div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-800 text-[10px] font-black uppercase text-slate-400">
                  <th className="py-4">รายการสินค้า / รายละเอียด</th>
                  <th className="py-4 text-center">จำนวน</th>
                  <th className="py-4 text-right">ราคาต่อหน่วย</th>
                  <th className="py-4 text-right">จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="group">
                  <td className="py-6">
                    <p className="font-black text-slate-800 text-sm">อาหารสุนัขเกรดพรีเมียม (บรรจุกระสอบ 20kg)</p>
                    <p className="text-xs text-slate-400 mt-1">สูตรลูกสุนัข โปรตีนสูง บำรุงขน</p>
                  </td>
                  <td className="py-6 text-center font-bold text-slate-600">10</td>
                  <td className="py-6 text-right font-bold text-slate-600">1,200.00</td>
                  <td className="py-6 text-right font-black text-slate-800 text-sm">12,000.00</td>
                </tr>
                <tr>
                  <td className="py-6">
                    <p className="font-black text-slate-800 text-sm">แชมพูอาบน้ำสูตรกำจัดเห็บหมัด (1000ml)</p>
                    <p className="text-xs text-slate-400 mt-1">สำหรับสุนัขขนยาว กลิ่นหอมสดชื่น</p>
                  </td>
                  <td className="py-6 text-center font-bold text-slate-600">10</td>
                  <td className="py-6 text-right font-bold text-slate-600">380.00</td>
                  <td className="py-6 text-right font-black text-slate-800 text-sm">3,800.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-3 bg-slate-50 p-8 rounded-3xl">
              <div className="flex justify-between text-sm text-slate-500 font-bold">
                <span>รวมเงิน (Subtotal)</span>
                <span>15,800.00</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 font-bold">
                <span>ภาษีมูลค่าเพิ่ม (VAT 7%)</span>
                <span>1,106.00</span>
              </div>
              <div className="flex justify-between text-xl font-black text-indigo-600 pt-3 border-t border-slate-200">
                <span>ยอดรวมสุทธิ</span>
                <span>฿16,906.00</span>
              </div>
            </div>
          </div>

          {/* Signature/Notes */}
          <div className="grid grid-cols-2 gap-12 pt-12">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">หมายเหตุ</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                * ราคานี้รวมค่าขนส่งเฉพาะในกรุงเทพฯ และปริมณฑลแล้ว<br />
                * สินค้าพร้อมจัดส่งภายใน 3-5 วันทำการหลังจากได้รับใบสั่งซื้อ
              </p>
            </div>
            <div className="flex flex-col items-center">
               <div className="w-full border-b border-slate-300 mt-8 mb-2" />
               <p className="text-xs font-bold text-slate-600">ผู้อนุมัติรายการ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}