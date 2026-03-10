import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  ChevronRight,
  Search,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  FilterX,
  Loader // ✅ อย่าลืม import Loader
} from "lucide-react";

const BRAND = { primary: "#79A68F", accent: "#A0D9F0" };

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // State สำหรับ Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // ✅ 1. เพิ่ม State สำหรับสถานะ Loading ของ Filter และข้อมูลที่กรองแล้ว
  const [isFiltering, setIsFiltering] = useState(false);
  const [displayedOrders, setDisplayedOrders] = useState([]);

  // ดึงข้อมูลครั้งแรก
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:8080/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          setError("เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่");
          return; 
        }

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
          setDisplayedOrders(data.data); // กำหนดค่าเริ่มต้น
        } else {
          throw new Error(data.message || "ไม่สามารถโหลดข้อมูลได้");
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("ไม่สามารถโหลดประวัติการสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // ✅ 2. Logic กรองข้อมูล + หน่วงเวลา 500ms (Debounce)
  useEffect(() => {
    if (orders.length === 0) return;

    // เปิดสถานะ Loading ของตัวกรอง
    setIsFiltering(true);

    // ตั้งเวลา 500ms
    const timer = setTimeout(() => {
      const result = orders.filter((order) => {
        // 2.1 กรองตาม Order ID
        const matchSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase());

        // 2.2 กรองตามสถานะ
        const matchStatus = filterStatus === "all" || order.status?.toLowerCase() === filterStatus;

        // 2.3 กรองตามวันที่
        let matchDate = true;
        if (filterDate) {
          const d = new Date(order.created_at);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          const localDateStr = `${year}-${month}-${day}`;
          matchDate = localDateStr === filterDate;
        }

        return matchSearch && matchStatus && matchDate;
      });

      setDisplayedOrders(result);
      setIsFiltering(false); // ปิดสถานะ Loading เมื่อกรองเสร็จ
    }, 500); // ระยะเวลา delay (500 ms)

    // ถ้ามีการพิมพ์หรือเปลี่ยน filter ใหม่ก่อนครบ 500ms ให้ล้างเวลาเก่าทิ้ง (Debounce)
    return () => clearTimeout(timer);
  }, [orders, searchQuery, filterStatus, filterDate]);

  // ฟังก์ชันล้างตัวกรอง
  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterDate("");
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return { label: "จัดส่งสำเร็จ", color: BRAND.primary, icon: <CheckCircle2 size={14} />, bg: `${BRAND.primary}15` };
      case "shipped":
        return { label: "อยู่ระหว่างขนส่ง", color: "#0F766E", icon: <Truck size={14} />, bg: `${BRAND.accent}40` };
      case "paid":
        return { label: "ชำระเงินแล้ว", color: "#10B981", icon: <CheckCircle2 size={14} />, bg: "#D1FAE5" };
      case "pending":
        return { label: "รอชำระเงิน", color: "#F59E0B", icon: <Clock size={14} />, bg: "#FEF3C7" };
      case "cancelled":
        return { label: "ยกเลิก", color: "#EF4444", icon: <AlertCircle size={14} />, bg: "#FEE2E2" };
      case "processing":
        return { label: "รอการตรวจสอบยอดเงิน", color: "#1D4ED8", icon: <AlertCircle size={14} />, bg: "#DBEAFE" };
      default:
        return { label: "กำลังเตรียมสินค้า", color: "#6B7280", icon: <Clock size={14} />, bg: "#F3F4F6" };
    }
  };

  // Main Loading (ตอนโหลดข้อมูลจาก API ครั้งแรก)
  if (loading)
    return <div className="text-center py-20 font-bold text-gray-500">กำลังโหลดข้อมูล...</div>;
  
  if (error)
    return (
      <div className="text-center py-20 text-red-500 flex flex-col items-center">
        <AlertCircle size={40} className="mb-2" />
        <p className="font-bold text-lg">{error}</p>
        {error.includes("เข้าสู่ระบบใหม่") && (
          <Link to="/login" className="mt-4 px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100">
            ไปหน้าเข้าสู่ระบบ
          </Link>
        )}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10">
      
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">ประวัติการสั่งซื้อ</h2>
        <p className="text-gray-500 text-sm mt-1">
          ตรวจสอบสถานะและรายการย้อนหลังทั้งหมดของคุณ
        </p>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาเลขที่คำสั่งซื้อ..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#79A68F]/50 transition-all bg-white shadow-sm text-sm"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="py-2.5 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#79A68F]/50 bg-white shadow-sm text-sm text-gray-700 cursor-pointer min-w-[150px]"
        >
          <option value="all">สถานะทั้งหมด</option>
          <option value="pending">รอชำระเงิน</option>
          <option value="paid">ชำระเงินแล้ว</option>
          <option value="processing">กำลังเตรียมสินค้า</option>
          <option value="shipped">อยู่ระหว่างขนส่ง</option>
          <option value="delivered">จัดส่งสำเร็จ</option>
          <option value="cancelled">ยกเลิก</option>
        </select>

        {/* Date Filter */}
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="py-2.5 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#79A68F]/50 bg-white shadow-sm text-sm text-gray-700 cursor-pointer flex-1"
          />
          
          {(searchQuery || filterStatus !== "all" || filterDate) && (
            <button
              onClick={clearFilters}
              title="ล้างตัวกรอง"
              className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors border border-red-100"
            >
              <FilterX size={20} />
            </button>
          )}
        </div>
      </div>
      
      {/* ✅ 3. แสดงผล (ถ้ากำลังโหลดให้โชว์ Loader ถ้าไม่ให้โชว์รายการ) */}
      {isFiltering ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
          <Loader className="w-10 h-10 text-[#79A68F] animate-spin mb-4" />
          <p className="font-bold text-gray-500">กำลังค้นหาข้อมูล...</p>
        </div>
      ) : (
        <>
          {/* Orders List */}
          <div className="space-y-4">
            {displayedOrders.map((order) => {
              const status = getStatusStyle(order.status);
              const formattedDate = new Date(order.created_at).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#79A68F]/40 transition-all overflow-hidden group"
                >
                  <div className="p-5 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-gray-300 flex-shrink-0">
                      <Package size={36} />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <span className="font-extrabold text-lg text-gray-900">
                          {order.order_number}
                        </span>
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit mx-auto md:mx-0"
                          style={{ backgroundColor: status.bg, color: status.color }}
                        >
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex flex-col gap-1">
                        <p>วันที่สั่งซื้อ: <span className="text-gray-700 font-medium">{formattedDate}</span></p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                      <div className="text-center md:text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                          ยอดคำสั่งซื้อรวม
                        </p>
                        <p className="text-2xl font-black text-gray-800">
                          ฿{Number(order.total_amount).toLocaleString()}
                        </p>
                      </div>
                      <Link
                        to={`/my-account/orders/${order.order_number}`}
                        className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-xl transition-all w-full md:w-auto justify-center shadow-sm hover:shadow-md text-white"
                        style={{ backgroundColor: BRAND.primary }}
                      >
                        ดูรายละเอียด <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty States (ไม่มีออเดอร์เลยแต่แรก) */}
          {orders.length === 0 && !error && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 mt-6">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">ยังไม่มีรายการสั่งซื้อ</h3>
              <p className="text-gray-400 mt-1 max-w-xs mx-auto">
                ดูเหมือนคุณจะยังไม่ได้สั่งซื้ออะไรเลย ลองไปดูสินค้าที่น่าสนใจของเราดูไหม?
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-block px-8 py-3 rounded-2xl text-white font-bold transition-all shadow-lg hover:opacity-90 active:scale-95"
                style={{ backgroundColor: BRAND.primary }}
              >
                เริ่มช้อปปิ้งเลย
              </Link>
            </div>
          )}

          {/* Empty States (มีออเดอร์แต่ Filter ไม่เจอ) */}
          {orders.length > 0 && displayedOrders.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 mt-6">
              <Search size={40} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-700">ไม่พบคำสั่งซื้อที่ค้นหา</h3>
              <p className="text-gray-500 text-sm mt-1 mb-4">ลองเปลี่ยนคำค้นหา หรือล้างตัวกรองดูนะครับ</p>
              <button
                onClick={clearFilters}
                className="text-sm font-bold text-[#79A68F] hover:underline"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderHistory;