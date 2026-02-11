import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Save, Plus, Trash2, User, 
  FileText, DollarSign, Calculator, Search, X, CheckCircle2
} from "lucide-react";

export default function QuotationCreate() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    note: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [items, setItems] = useState([
    { id: Date.now(), name: "", price: 0, qty: 1 }
  ]);

  const [showToast, setShowToast] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const vat = subtotal * 0.07;
    return {
      subtotal,
      vat,
      grandTotal: subtotal + vat
    };
  }, [items]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", price: 0, qty: 1 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName) {
      alert("กรุณาระบุชื่อลูกค้า");
      return;
    }
    const payload = {
      ...formData,
      items,
      ...totals,
      quotationNumber: `QT-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    console.log("Saving Quotation Data:", payload);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/admin/quotations");
    }, 2000);
  };

  return (
    /* ขยาย max-w ให้ใหญ่ขึ้นเป็น 1400px */
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
      
      {showToast && (
        <div className="fixed top-10 right-10 z-[100] animate-in slide-in-from-right-8">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 size={24} />
            <span className="font-bold">สร้างใบเสนอราคาสำเร็จแล้ว!</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/quotations")} className="p-2 hover:bg-white rounded-xl border border-slate-200 transition-all text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800">สร้างใบเสนอราคา</h2>
            <p className="text-slate-500 text-sm">ระบุรายละเอียดเพื่อออกเอกสารใหม่</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Save size={18} /> บันทึกข้อมูล
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          
          <section className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-500 mb-6 font-bold uppercase text-xs tracking-widest">
              <User size={16} /> ข้อมูลผู้รับ
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-tighter">ชื่อลูกค้า / บริษัท *</label>
                <input 
                  type="text" 
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-700 transition-all" 
                  placeholder="ระบุชื่อผู้ติดต่อ"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-tighter">เบอร์โทรศัพท์</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                  placeholder="08X-XXX-XXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-tighter">อีเมล</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                  placeholder="example@mail.com"
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-indigo-500 font-bold uppercase text-xs tracking-widest">
                <FileText size={16} /> รายการสินค้า
              </div>
              <button onClick={addItem} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-100 transition-all flex items-center gap-1">
                <Plus size={14} /> เพิ่มรายการ
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="group relative grid grid-cols-12 gap-4 p-5 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-200 transition-all">
                  
                  {/* ช่องรายละเอียด: ลดลงเหลือ 5 ส่วน */}
                  <div className="col-span-12 md:col-span-5">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">รายละเอียดสินค้า</label>
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      className="w-full bg-white px-4 py-2.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700" 
                      placeholder="ระบุรายการสินค้า..."
                    />
                  </div>

                  {/* ช่องราคา: ขยายเป็น 2 ส่วน */}
                  <div className="col-span-6 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">ราคาต่อหน่วย</label>
                    <input 
                      type="number" 
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                      className="w-full bg-white px-4 py-2.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500/20 font-black text-slate-700" 
                    />
                  </div>

                  {/* ช่องจำนวน: ขยายเป็น 2 ส่วน (เพื่อให้ใส่ตัวเลขยาวๆ ได้) */}
                  <div className="col-span-6 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block text-center">จำนวน</label>
                    <input 
                      type="number" 
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, "qty", Number(e.target.value))}
                      className="w-full bg-white px-4 py-2.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500/20 font-black text-slate-700 text-center" 
                    />
                  </div>

                  {/* ช่องยอดรวม: ขยายเป็น 3 ส่วน */}
                  <div className="col-span-12 md:col-span-3 text-right">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block underline underline-offset-4 decoration-indigo-200">ยอดรวม</label>
                    <div className="py-2.5 font-black text-slate-800 text-lg">
                      ฿{(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                  
                  {items.length > 1 && (
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute -right-2 -top-2 bg-white text-rose-500 p-2 rounded-full shadow-lg border border-rose-100 opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-500 mb-8 font-bold uppercase text-xs tracking-widest">
              <Calculator size={16} /> สรุปยอดเงินสุทธิ
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold uppercase">รวมเงิน</span>
                <span className="text-slate-800 font-black">฿{totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold uppercase">ภาษี (7%)</span>
                <span className="text-slate-800 font-black">฿{totals.vat.toLocaleString()}</span>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                <span className="text-sm font-black text-indigo-600 uppercase">ยอดสุทธิ</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                  ฿{totals.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-500 mb-4 font-bold uppercase text-xs tracking-widest">
              <DollarSign size={16} /> บันทึกเพิ่มเติม
            </div>
            <textarea 
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              placeholder="เงื่อนไขการวางมัดจำ..."
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none min-h-[120px] resize-none"
            />
          </section>
        </div>
      </div>
    </div>
  );
}