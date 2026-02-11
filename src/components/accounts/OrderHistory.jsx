import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ChevronRight,
  Search,
  Clock,
  CheckCircle2,
  Truck,
} from "lucide-react";

// 🎨 สีหลัก
const BRAND = {
  primary: "#79A68F", // เขียว
  accent: "#A0D9F0", // ฟ้า
};

const OrderHistory = () => {
  const user = {
    name: "สมชาย ใจดี",
    email: "somchai.j@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai",
  };

  const orders = [
    {
      id: "ORD-2025001",
      date: "20 ธ.ค. 2024",
      total: "2,450.00",
      status: "delivered",
      items: 3,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
    },
    {
      id: "ORD-2025002",
      date: "15 ธ.ค. 2024",
      total: "890.00",
      status: "shipped",
      items: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
    },
    {
      id: "ORD-2025003",
      date: "10 ธ.ค. 2024",
      total: "1,200.00",
      status: "processing",
      items: 2,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
    },
  ];

  // 🔹 ฟังก์ชันแปลงสถานะ
  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return {
          label: "จัดส่งสำเร็จ",
          color: BRAND.primary,
          icon: <CheckCircle2 size={14} />,
          bg: `${BRAND.primary}15`,
        };
      case "shipped":
        return {
          label: "อยู่ระหว่างขนส่ง",
          color: BRAND.accent,
          icon: <Truck size={14} />,
          bg: `${BRAND.accent}25`,
        };
      default:
        return {
          label: "กำลังเตรียมสินค้า",
          color: "#6B7280",
          icon: <Clock size={14} />,
          bg: "#F3F4F6",
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">ประวัติการสั่งซื้อ</h2>
          <p className="text-gray-500 text-sm">
            ตรวจสอบสถานะและรายการย้อนหลังทั้งหมดของคุณ
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-[320px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="ค้นหาเลขที่คำสั่งซื้อ..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 transition-all bg-white shadow-sm"
            style={{
              borderColor: "#E5E7EB",
              "--tw-ring-color": BRAND.accent,
            }}
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const status = getStatusStyle(order.status);
          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#A0D9F050] transition-all overflow-hidden group"
            >
              <div className="p-5 flex flex-col md:flex-row items-center gap-6">
                {/* Image */}
                <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <img
                    src={order.image}
                    alt="order-preview"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <span className="font-bold text-lg text-gray-900">
                      {order.id}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold self-center md:self-start"
                      style={{
                        backgroundColor: status.bg,
                        color: status.color,
                      }}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex flex-col gap-1">
                    <p>
                      วันที่สั่งซื้อ:{" "}
                      <span className="text-gray-700">{order.date}</span>
                    </p>
                    <p>
                      รายการสินค้า:{" "}
                      <span className="text-gray-700">{order.items} รายการ</span>
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-center md:text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                      ยอดคำสั่งซื้อรวม
                    </p>
                    <p className="text-2xl font-black text-gray-800">
                      ฿{order.total}
                    </p>
                  </div>

                  <Link
                    to={`/my-account/orders/${order.id}`}
                    className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-xl transition-all w-full md:w-auto justify-center shadow-sm hover:shadow-md active:scale-95 text-white"
                    style={{ backgroundColor: BRAND.accent }}
                  >
                    ดูรายละเอียด <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 mt-10">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={40} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            ยังไม่มีรายการสั่งซื้อ
          </h3>
          <p className="text-gray-400 mt-1 max-w-xs mx-auto">
            ดูเหมือนคุณจะยังไม่ได้สั่งซื้ออะไรเลย ลองไปดูสินค้าที่น่าสนใจของเราดูไหม?
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block px-8 py-3 rounded-2xl text-white font-bold transition-all shadow-lg hover:opacity-90 active:scale-95"
            style={{ backgroundColor: BRAND.primary }}
          >
            เริ่มช้อปปิ้งเลย
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;