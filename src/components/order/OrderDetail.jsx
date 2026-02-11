import React, { useMemo } from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  Receipt,
  Truck,
  CreditCard,
  Download,
  ExternalLink,
} from "lucide-react";

const BRAND = { primary: "#79A68F", accent: "#A0D9F0" };

const OrderDetail = () => {
  // ✅ ต้องมี user ไม่งั้น AccountSidebar จะ error
  const user = {
    name: "สมชาย ใจดี",
    email: "somchai.j@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai",
  };

  const orderInfo = {
    id: "ORD-2025001",
    status: "delivered", // processing | shipped | delivered
    date: "20 ธ.ค. 2024",
    shippingMethod: "Kerry Express",
    trackingNo: "KER-123456789",
    paymentMethod: "บัตรเครดิต (Visa •••• 4242)",
    items: [
      {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 1200,
        qty: 1,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
      },
      {
        id: 2,
        name: "Smart Watch Series 7",
        price: 1250,
        qty: 1,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100",
      },
    ],
    billing: {
      name: "สมชาย ใจดี",
      address: "123 ม.5 ถ.แจ้งวัฒนะ ต.ปากเกร็ด อ.ปากเกร็ด จ.นนทบุรี 11120",
    },
    shipping: {
      name: "สมชาย ใจดี",
      address: "123 ม.5 ถ.แจ้งวัฒนะ ต.ปากเกร็ด อ.ปากเกร็ด จ.นนทบุรี 11120",
    },
  };

  // ✅ เหมือนตัวอย่าง OrderHistory
  const sidebarItems = useMemo(() => getAccountSidebarItems(), []);

  const subtotal = useMemo(() => {
    return (orderInfo.items || []).reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0),
      0
    );
  }, [orderInfo.items]);

  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const statusMeta = useMemo(() => {
    switch (orderInfo.status) {
      case "processing":
        return {
          label: "กำลังเตรียมสินค้า",
          bg: "#F3F4F6",
          dot: "#6B7280",
          color: "#374151",
        };
      case "shipped":
        return {
          label: "อยู่ระหว่างขนส่ง",
          bg: `${BRAND.accent}25`,
          dot: BRAND.accent,
          color: "#0F766E",
        };
      case "delivered":
      default:
        return {
          label: "จัดส่งสำเร็จแล้ว",
          bg: `${BRAND.primary}15`,
          dot: BRAND.primary,
          color: BRAND.primary,
        };
    }
  }, [orderInfo.status]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      {/* ✅ ให้ Sidebar อยู่ซ้ายแบบรูป: วาง AccountSidebar ก่อน main */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AccountSidebar
          user={user}
          items={sidebarItems}
          activeKey={ACCOUNT_NAV_KEYS.orders}
          onLogout={() => console.log("logout")}
          tipText="ใช้ช่องค้นหาเพื่อหาเลขที่คำสั่งซื้อได้ไวขึ้น"
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex items-center text-gray-500 hover:text-gray-800 transition-colors w-fit"
              >
                <ArrowLeft size={20} className="mr-2" /> ย้อนกลับ
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <Download size={16} /> ดาวน์โหลดใบเสร็จ
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm hover:opacity-95 active:scale-[0.99]"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  สั่งซื้ออีกครั้ง
                </button>
              </div>
            </div>

            {/* Main Order Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    คำสั่งซื้อ #{orderInfo.id}
                  </h1>
                  <p className="text-sm text-gray-500">
                    สั่งซื้อเมื่อ {orderInfo.date}
                  </p>
                </div>

                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl h-fit w-fit"
                  style={{ backgroundColor: statusMeta.bg, color: statusMeta.color }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: statusMeta.dot }}
                  />
                  <span className="text-sm font-bold">{statusMeta.label}</span>
                </div>
              </div>

              {/* Tracking & Delivery */}
              <div className="p-6 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-100">
                <div className="flex gap-3">
                  <Truck className="text-[#A0D9F0]" size={24} />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      ขนส่งโดย
                    </p>
                    <p className="text-sm font-semibold">{orderInfo.shippingMethod}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Package className="text-[#A0D9F0]" size={24} />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      เลขติดตามพัสดุ
                    </p>
                    <button
                      type="button"
                      onClick={() => console.log("open tracking", orderInfo.trackingNo)}
                      className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:underline"
                      title="เปิดหน้าติดตามพัสดุ"
                    >
                      {orderInfo.trackingNo} <ExternalLink size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CreditCard className="text-[#A0D9F0]" size={24} />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      วิธีชำระเงิน
                    </p>
                    <p className="text-sm font-semibold">{orderInfo.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Item List */}
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-gray-700 mb-4">
                  รายการสินค้า ({orderInfo.items.length})
                </h3>

                {orderInfo.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">จำนวน: {item.qty}</p>
                    </div>

                    <p className="font-bold text-gray-800">
                      ฿{(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary Footer */}
              <div className="p-6 bg-white border-t border-gray-100 flex justify-end">
                <div className="w-full md:w-72 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>รวมยอดสินค้า</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>ค่าจัดส่ง</span>
                    <span className="text-[#79A68F] font-semibold">
                      {shippingFee === 0 ? "ฟรี" : `฿${shippingFee.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="font-bold text-gray-800">ยอดชำระสุทธิ</span>
                    <span className="font-extrabold text-xl text-gray-800">
                      ฿{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={18} className="text-[#A0D9F0]" />
                  <h3 className="font-bold text-gray-700">ที่อยู่จัดส่ง</h3>
                </div>
                <p className="text-sm font-bold text-gray-800 mb-1">
                  {orderInfo.shipping.name}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {orderInfo.shipping.address}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt size={18} className="text-[#79A68F]" />
                  <h3 className="font-bold text-gray-700">ที่อยู่ออกใบเสร็จ</h3>
                </div>
                <p className="text-sm font-bold text-gray-800 mb-1">
                  {orderInfo.billing.name}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {orderInfo.billing.address}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDetail;
