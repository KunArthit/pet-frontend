import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  Hash, 
  CreditCard, 
  AlertCircle,
  ExternalLink,
  Image as ImageIcon
} from "lucide-react";

export default function PaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/admin/payments")} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold transition-colors">
          <ArrowLeft size={20} /> กลับไปหน้าจัดการ
        </button>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-all border border-rose-100">
            <XCircle size={18} /> ปฏิเสธการชำระ
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all">
            <CheckCircle2 size={18} /> ยืนยันยอดเงิน
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Slip Image */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ImageIcon size={16} /> หลักฐานการโอนเงิน (Slip)
          </h3>
          <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="aspect-[3/4] rounded-2xl bg-slate-100 overflow-hidden relative group cursor-zoom-in">
              {/* รูปจำลองสลิป */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                <ImageIcon size={48} className="mb-2" />
                <p className="text-xs font-bold uppercase">รูปภาพหลักฐานจากลูกค้า</p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop" 
                alt="Slip Preview" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all">
              <ExternalLink size={14} /> ขยายดูรูปใหญ่
            </button>
          </div>
        </div>

        {/* Right: Payment Info */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <AlertCircle size={16} /> รายละเอียดการตรวจสอบ
          </h3>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <div className="space-y-4">
              <InfoRow icon={Hash} label="Transaction ID" value={id || "PAY-1001"} />
              <InfoRow icon={CreditCard} label="ชำระเข้าบัญชี" value="ธนาคารกสิกรไทย (PETTERAIN)" />
              <InfoRow icon={User} label="ผู้แจ้งชำระ" value="วิภาวดี แมวเหมียว" />
              <InfoRow icon={Calendar} label="วันที่/เวลาโอน" value="09 ก.พ. 2026 | 10:15 น." />
            </div>

            <div className="pt-6 border-t border-slate-50">
              <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-tight">ยอดที่ต้องชำระ (Order)</span>
                  <span className="text-slate-800 text-lg">฿4,650.00</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold border-t border-slate-200 pt-3">
                  <span className="text-indigo-500 uppercase tracking-tight">ยอดโอนในสลิป</span>
                  <span className="text-indigo-600 text-2xl font-black">฿4,650.00</span>
                </div>
              </div>
              <p className="mt-4 text-[10px] text-center text-emerald-600 font-bold bg-emerald-50 py-2 rounded-lg border border-emerald-100">
                ✅ ยอดเงินตรงกับราคาสินค้าในคำสั่งซื้อ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 bg-slate-50 text-slate-400 rounded-lg"><Icon size={16} /></div>
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}