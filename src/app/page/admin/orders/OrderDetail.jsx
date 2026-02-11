import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Printer, Truck, MapPin, 
  User, CreditCard, Package, Phone, Mail 
} from "lucide-react";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ข้อมูลจำลอง (Mock Data)
  const order = {
    id: id || "ORD-9901",
    date: "2024-03-20 14:30",
    status: "Pending",
    customer: {
      name: "วิภาวดี แมวเหมียว",
      email: "viphawadee@example.com",
      phone: "081-234-5678",
      address: "123/45 หมู่บ้านเพ็ทเทอร์เรน ซอย 5 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110"
    },
    items: [
      { id: 1, name: "อาหารสุนัขเกรดพรีเมียม 10kg", price: 1250, qty: 2, total: 2500 },
      { id: 2, name: "คอนโดแมว 3 ชั้น", price: 2000, qty: 1, total: 2000 },
    ],
    shippingFee: 150,
    total: 4650,
    paymentMethod: "โอนเงินผ่านธนาคาร (K-Bank)"
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/admin/orders")}
            className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-800">{order.id}</h2>
              <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase">
                {order.status}
              </span>
            </div>
            <p className="text-slate-500 text-sm">สั่งซื้อเมื่อ {order.date}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Printer size={18} /> พิมพ์ใบเสร็จ
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <Truck size={18} /> จัดส่งสินค้า
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items & Payment */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center gap-2 text-indigo-600">
              <Package size={20} />
              <h3 className="font-bold text-slate-800">รายการสินค้า</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black">
                  <tr>
                    <th className="px-6 py-4">สินค้า</th>
                    <th className="px-6 py-4 text-center">จำนวน</th>
                    <th className="px-6 py-4 text-right">รวม</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-700 text-sm">{item.name}</p>
                        <p className="text-xs text-slate-400">฿{item.price.toLocaleString()} / ชิ้น</p>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-600 text-sm">x{item.qty}</td>
                      <td className="px-6 py-4 text-right font-black text-slate-800 text-sm">฿{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">รวมค่าสินค้า</span>
                <span className="text-slate-800 font-bold">฿{(order.total - order.shippingFee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">ค่าจัดส่ง</span>
                <span className="text-slate-800 font-bold">฿{order.shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t border-slate-200">
                <span className="font-black text-slate-800">ยอดรวมสุทธิ</span>
                <span className="font-black text-indigo-600">฿{order.total.toLocaleString()}</span>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 mb-4">
              <CreditCard size={20} />
              <h3 className="font-bold text-slate-800">ข้อมูลการชำระเงิน</h3>
            </div>
            <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
              {order.paymentMethod}
            </p>
          </section>
        </div>

        {/* Right: Customer & Shipping */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 mb-6">
              <User size={20} />
              <h3 className="font-bold text-slate-800">ข้อมูลลูกค้า</h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><User size={18}/></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase">ชื่อผู้รับ</p><p className="text-sm font-bold text-slate-700">{order.customer.name}</p></div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><Phone size={18}/></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase">เบอร์โทรศัพท์</p><p className="text-sm font-bold text-slate-700">{order.customer.phone}</p></div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><Mail size={18}/></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase">อีเมล</p><p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{order.customer.email}</p></div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 mb-4">
              <MapPin size={20} />
              <h3 className="font-bold text-slate-800">ที่อยู่จัดส่ง</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {order.customer.address}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}