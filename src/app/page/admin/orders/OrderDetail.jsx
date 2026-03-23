import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Truck,
  MapPin,
  User,
  CreditCard,
  Package,
  Phone,
  Mail,
  Loader,
  AlertCircle,
  Save,
  XCircle,
} from "lucide-react";

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State สำหรับจัดการสถานะบิลที่แก้ไข
  const [newStatus, setNewStatus] = useState("");
  const [cancelReason, setCancelReason] = useState(""); // ✅ เพิ่ม State สำหรับเก็บเหตุผลการยกเลิก
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { id: "pending", label: "รอชำระเงิน" },
    { id: "processing", label: "รอตรวจยอดเงิน" },
    { id: "paid", label: "รอการจัดส่ง" },
    { id: "shipped", label: "กำลังจัดส่ง" },
    { id: "completed", label: "ส่งสำเร็จ" },
    { id: "cancelled", label: "ยกเลิก" },
  ];

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") || localStorage.getItem("token");
        const res = await fetch(`${apiEndpoint}/orders/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setOrder(data.data);
          setNewStatus(data.data.status);
          setCancelReason(data.data.cancel_reason || ""); // ดึงเหตุผลเก่ามาแสดง (ถ้ามี)
        } else {
          throw new Error(data.message || "ไม่พบข้อมูลคำสั่งซื้อ");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  // ฟังก์ชันอัปเดตสถานะบิล
  const handleUpdateStatus = async () => {
    if (newStatus === order.status) return; 
    
    // บังคับให้กรอกเหตุผลถ้ายกเลิก
    if (newStatus === "cancelled" && !cancelReason.trim()) {
      alert("กรุณาระบุเหตุผลการยกเลิกคำสั่งซื้อ");
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      
      // ✅ สร้าง Payload
      const payload = { status: newStatus };
      
      if (newStatus === "cancelled") {
        payload.cancel_reason = cancelReason;
      } else {
        // ✅ ถ้าเปลี่ยนจากยกเลิกเป็นอย่างอื่น ให้ส่ง String ว่างไปกัน API Error 422
        // Backend จะรับไปแล้วแปลงเป็น null ลง Database ให้อัตโนมัติ
        payload.cancel_reason = "";
      }

      const res = await fetch(`${apiEndpoint}/orders/${order.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setOrder({ 
          ...order, 
          status: newStatus, 
          cancel_reason: newStatus === "cancelled" ? cancelReason : null 
        });
        
        // ✅ ถ้าเปลี่ยนกลับเป็นสถานะอื่น ให้เคลียร์ข้อความใน State ด้วย หน้าจอจะได้หายไป
        if (newStatus !== "cancelled") {
          setCancelReason("");
        }
        
        alert("อัปเดตสถานะเรียบร้อยแล้ว");
      } else {
        throw new Error(data.message || "อัปเดตสถานะไม่สำเร็จ");
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert(err.message);
      setNewStatus(order.status); 
      setCancelReason(order.cancel_reason || "");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader className="animate-spin text-indigo-600 w-12 h-12" />
        <p className="text-slate-500 font-bold">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="w-16 h-16 text-rose-500" />
        <p className="text-xl font-bold text-slate-800">
          {error || "ไม่พบข้อมูลคำสั่งซื้อ"}
        </p>
        <button
          onClick={() => navigate("/admin/orders")}
          className="text-indigo-600 font-bold underline"
        >
          กลับไปหน้ารายการ
        </button>
      </div>
    );
  }

  const subtotal = order.total_amount - order.shipping_cost;
  const formattedDate = new Date(order.created_at).toLocaleString("th-TH");

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
              <h2 className="text-2xl font-black text-slate-800">
                {order.order_number}
              </h2>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-slate-500 text-sm">
              สั่งซื้อเมื่อ {formattedDate}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* ส่วนควบคุมสถานะบิล */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 relative z-20">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden pr-1 shadow-sm">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="px-4 py-2.5 bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {newStatus !== order.status && (
                <button
                  onClick={handleUpdateStatus}
                  disabled={
                    isUpdating ||
                    (newStatus === "cancelled" && !cancelReason.trim())
                  }
                  className="p-1.5 bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  title="บันทึกสถานะ"
                >
                  {isUpdating ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                </button>
              )}
            </div>

            {/* ✅ กล่องระบุเหตุผล (โชว์เฉพาะตอนเลือก "ยกเลิก" แต่ยังไม่เซฟ) */}
            {newStatus === "cancelled" && newStatus !== order.status && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white p-3 rounded-xl border border-slate-200 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  ระบุเหตุผลที่ยกเลิก <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="เช่น สินค้าหมด, ลูกค้าติดต่อไม่ได้..."
                  className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500/20"
                  rows="2"
                />
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Printer size={18} /> พิมพ์ใบเสร็จ
          </button>
        </div>
      </div>

      {/* ✅ โชว์เหตุผลการยกเลิก (ถ้าออเดอร์นี้เคยถูกยกเลิกไปแล้ว) */}
      {order.status === "cancelled" && order.cancel_reason && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3">
          <XCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-rose-800">
              คำสั่งซื้อถูกยกเลิกแล้ว
            </p>
            <p className="text-sm text-rose-600">
              เหตุผล: {order.cancel_reason}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items & Payment */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center gap-2 text-indigo-600">
              <Package size={20} />
              <h3 className="font-bold text-slate-800">รายการสินค้า</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black">
                  <tr>
                    <th className="px-6 py-4">สินค้า</th>
                    <th className="px-6 py-4 text-center">จำนวน</th>
                    <th className="px-6 py-4 text-right">รวม</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(order.items || []).map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-full h-full p-3 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 text-sm line-clamp-1">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-slate-400">
                            ฿{Number(item.price).toLocaleString()} / ชิ้น
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-600 text-sm">
                        x{item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-800 text-sm">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50/50 space-y-3 rounded-b-3xl">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">รวมค่าสินค้า</span>
                <span className="text-slate-800 font-bold">
                  ฿{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">ค่าจัดส่ง</span>
                <span className="text-slate-800 font-bold">
                  ฿{Number(order.shipping_cost).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-lg pt-3 border-t border-slate-200">
                <span className="font-black text-slate-800">ยอดรวมสุทธิ</span>
                <span className="font-black text-indigo-600 text-xl">
                  ฿{Number(order.total_amount).toLocaleString()}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <CreditCard size={20} />
                <h3 className="font-bold text-slate-800">ข้อมูลการชำระเงิน</h3>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 uppercase font-bold">
                {order.payment_method?.replace("_", " ") || "-"}
              </p>
            </div>
            {order.slip_image && (
              <div className="w-full sm:w-48 shrink-0">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                  หลักฐานการโอนเงิน
                </p>
                <a
                  href={`${apiEndpoint.replace("/api", "")}${order.slip_image}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`${apiEndpoint.replace("/api", "")}${order.slip_image}`}
                    alt="Slip"
                    className="w-full h-32 object-contain bg-slate-50 rounded-xl border border-slate-200 cursor-zoom-in hover:opacity-90 transition-opacity"
                  />
                </a>
              </div>
            )}
          </section>
        </div>

        {/* Right: Customer & Shipping */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 mb-6">
              <User size={20} />
              <h3 className="font-bold text-slate-800">ข้อมูลการจัดส่ง</h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    ชื่อผู้รับ
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {order.shipping_name}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    เบอร์โทรศัพท์
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {order.shipping_phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <MapPin size={18} />
                <h3 className="font-bold text-slate-800 text-sm">
                  ที่อยู่จัดส่ง
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {order.shipping_address}
              </p>
            </div>
          </section>

          {order.billing_address && (
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <Mail size={18} />
                <h3 className="font-bold text-slate-800 text-sm">
                  ที่อยู่ออกใบเสร็จ
                </h3>
              </div>
              <p className="text-sm font-bold text-slate-700 mb-1">
                {order.billing_name}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-2">
                {order.billing_address}
              </p>
              <p className="text-xs font-bold text-slate-500">
                โทร: {order.billing_phone}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const meta = {
    pending: {
      label: "รอชำระเงิน",
      css: "bg-amber-50 text-amber-600 border-amber-100",
    },
    processing: {
      label: "รอตรวจยอดเงิน",
      css: "bg-blue-50 text-blue-600 border-blue-100",
    },
    paid: {
      label: "รอการจัดส่ง",
      css: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    shipped: {
      label: "กำลังจัดส่ง",
      css: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100",
    },
    completed: {
      label: "ส่งสำเร็จ",
      css: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    cancelled: {
      label: "ยกเลิก",
      css: "bg-rose-50 text-rose-600 border-rose-100",
    },
  };

  const current = meta[status?.toLowerCase()] || {
    label: status,
    css: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-black border ${current.css}`}
    >
      {current.label}
    </span>
  );
}
