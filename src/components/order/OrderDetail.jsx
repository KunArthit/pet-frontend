/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  Receipt,
  Truck,
  CreditCard,
  Download,
  ExternalLink,
  AlertCircle,
  Wallet,
  Loader,
  UploadCloud,
  X,
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";

const BRAND = { primary: "#79A68F", accent: "#A0D9F0" };

const OrderDetail = () => {
  const { orderId: orderNumber } = useParams();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  // --- State สำหรับ Upload Slip ---
  const fileInputRef = useRef(null);
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // -------------------------------------------------------------
  // ดึงข้อมูลบิลจาก Backend
  // -------------------------------------------------------------
  const fetchOrderDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("unauthorized");
      if (!orderNumber) throw new Error("not_found");

      const response = await fetch(`${apiBaseUrl}/orders/${orderNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 401) throw new Error("unauthorized");
      if (response.status === 404) throw new Error("not_found");
      if (!response.ok) throw new Error("fetch_error");

      const data = await response.json();
      
      if (data.success) {
        setOrderInfo(data.data);
      } else {
        throw new Error(data.message || "data_error");
      }
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      if (err.message === "unauthorized") {
        navigate("/login");
      } else if (err.message === "not_found") {
        setError("ไม่พบข้อมูลคำสั่งซื้อนี้ หรือคุณไม่มีสิทธิ์เข้าถึง");
      } else {
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderNumber, apiBaseUrl, navigate]);

  // -------------------------------------------------------------
  // จัดการการเลือกรูปสลิป
  // -------------------------------------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("กรุณาอัปโหลดเฉพาะไฟล์รูปภาพ (JPG, PNG)");
        return;
      }
      setSlipFile(file);
      const objectUrl = URL.createObjectURL(file);
      setSlipPreview(objectUrl);
    }
  };

  const clearSlip = () => {
    setSlipFile(null);
    setSlipPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // -------------------------------------------------------------
  // ฟังก์ชันอัปโหลดสลิป
  // -------------------------------------------------------------
  const handleUploadSlip = async () => {
    if (!slipFile || !orderInfo) return;
    setIsUploading(true);

    try {
      const token = localStorage.getItem("accessToken");
      
      // 1. ขอดึง payment_id ออกมาก่อน (โดยเรียก /payments/pay)
      const payRes = await fetch(`${apiBaseUrl}/payments/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          order_id: orderInfo.id, 
          amount: Number(orderInfo.total_amount),
          payment_method: orderInfo.payment_method || "qr"
        })
      });
      const payData = await payRes.json();

      if (!payData.success || !payData.data?.payment_id) {
        throw new Error("ไม่สามารถเริ่มเซสชันการชำระเงินได้");
      }

      const paymentId = payData.data.payment_id;

      // 2. เตรียมข้อมูลรูปภาพด้วย FormData
      const formData = new FormData();
      formData.append("slip_image", slipFile);
      formData.append("transfer_at", new Date().toISOString());

      // 3. ยิง API Upload Slip 
      const uploadRes = await fetch(`${apiBaseUrl}/payments/${paymentId}/upload-slip`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      const uploadData = await uploadRes.json();

      if (uploadData.success) {
        // 4. (Optional) ยิง API อัปเดตสถานะออเดอร์เป็น Processing
        try {
          await fetch(`${apiBaseUrl}/orders/${orderInfo.id}/status`, {
             method: "PATCH",
             headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`
             },
             body: JSON.stringify({ status: "processing" })
          });
        } catch (e) {
          console.log("Status update endpoint might not exist yet.");
        }

        alert(orderInfo.status === "processing" ? "อัปเดตสลิปสำเร็จ!" : "ส่งหลักฐานการชำระเงินสำเร็จ!");
        clearSlip();
        fetchOrderDetail(); 
      } else {
        throw new Error(uploadData.message || "อัปโหลดสลิปไม่สำเร็จ");
      }

    } catch (error) {
      console.error("Upload slip error:", error);
      alert(error.message || "เกิดข้อผิดพลาดในการอัปโหลดสลิป กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsUploading(false);
    }
  };

  // -------------------------------------------------------------
  // จัดการสถานะ สี และ ไอคอน
  // -------------------------------------------------------------
  const statusMeta = useMemo(() => {
    if (!orderInfo) return {};
    switch (orderInfo.status?.toLowerCase()) {
      case "processing":
        return { label: "กำลังตรวจสอบยอดเงิน", bg: "#DBEAFE", dot: "#3B82F6", color: "#1D4ED8" };
      case "shipped":
        return { label: "อยู่ระหว่างขนส่ง", bg: `${BRAND.accent}25`, dot: BRAND.accent, color: "#0F766E" };
      case "completed":
        return { label: "จัดส่งสำเร็จแล้ว", bg: `${BRAND.primary}15`, dot: BRAND.primary, color: BRAND.primary };
      case "paid":
        return { label: "ชำระเงินเรียบร้อย", bg: "#D1FAE5", dot: "#10B981", color: "#059669" };
      case "cancelled":
        return { label: "ยกเลิกแล้ว", bg: "#FEE2E2", dot: "#EF4444", color: "#B91C1C" };
      case "pending":
      default:
        return { label: "รอชำระเงิน", bg: "#FEF3C7", dot: "#F59E0B", color: "#D97706" };
    }
  }, [orderInfo?.status]);

  // -------------------------------------------------------------
  // UI States (Loading & Error)
  // -------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-20">
         <Loader className="w-12 h-12 text-[#79A68F] animate-spin mb-4" />
         <div className="font-bold text-gray-500">กำลังโหลดข้อมูลคำสั่งซื้อ...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-20 px-4 text-center">
        <AlertCircle size={60} className="text-red-400 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{error}</h2>
        <button onClick={() => navigate("/my-account/orders")} className="px-8 py-3 bg-[#79A68F] text-white font-bold rounded-xl hover:bg-[#5E8570] transition shadow-lg shadow-[#79A68F]/30">
          กลับไปหน้าประวัติคำสั่งซื้อ
        </button>
      </div>
    );
  }

  if (!orderInfo) return null;

  const formattedDate = new Date(orderInfo.created_at).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // ตัวแปรเช็คว่าควรแสดงกล่องอัปโหลดสลิปหรือไม่ (แสดงตอน pending และ processing)
  const canUploadSlip = orderInfo.status === "pending" || orderInfo.status === "processing";
  // ถ้าระบบ Backend ส่ง orderInfo.slip_image มาให้ จะแสดงรูปนั้นเป็นค่าเริ่มต้น
  const displaySlip = slipPreview || orderInfo.slip_image;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pt-28 pb-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-[#79A68F] transition-colors w-fit font-bold px-2 py-1"
          >
            <ArrowLeft size={20} className="mr-2" /> ย้อนกลับ
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors text-gray-700"
            >
              <Download size={18} /> ดาวน์โหลดใบเสร็จ
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 🟢 ส่วนสำหรับแนบสลิป (แสดงเฉพาะสถานะ Pending และ Processing) */}
        {/* ========================================================= */}
        {canUploadSlip && (
          <div className={`bg-white rounded-3xl p-6 sm:p-8 border-2 shadow-sm relative overflow-hidden transition-colors ${orderInfo.status === 'processing' ? 'border-blue-200' : 'border-amber-200'}`}>
            <div className={`absolute top-0 left-0 w-2 h-full ${orderInfo.status === 'processing' ? 'bg-blue-400' : 'bg-amber-400'}`}></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl ${orderInfo.status === 'processing' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                 {orderInfo.status === 'processing' ? <CheckCircle2 size={24} /> : <Wallet size={24} />}
              </div>
              <div>
                 <h2 className="text-xl font-extrabold text-gray-900">
                    {orderInfo.status === 'processing' ? "รอการตรวจสอบยอดเงิน" : "แจ้งชำระเงิน"}
                 </h2>
                 <p className="text-sm text-gray-500">
                    {orderInfo.status === 'processing' 
                      ? "ระบบได้รับสลิปของคุณแล้ว หากคุณส่งสลิปผิด สามารถอัปโหลดใหม่ได้ที่นี่" 
                      : <span>กรุณาโอนเงินจำนวน <span className="font-bold text-amber-600">฿{Number(orderInfo.total_amount).toLocaleString()}</span> และแนบสลิปที่นี่</span>}
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* ข้อมูลบัญชีร้านค้า (Mockup) */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-full flex flex-col justify-center">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">โอนเงินเข้าบัญชี</p>
                 <div className="flex items-center gap-4 mb-4">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Kasikornbank_Logo.svg/1200px-Kasikornbank_Logo.svg.png" alt="KBank" className="h-8 object-contain" />
                    <div>
                      <p className="font-bold text-gray-900">ธนาคารกสิกรไทย</p>
                      <p className="text-xl font-black text-[#79A68F] tracking-wider">123-4-56789-0</p>
                    </div>
                 </div>
                 <p className="text-sm text-gray-600 font-medium">ชื่อบัญชี: <span className="text-gray-900">บจก. เพ็ทเทอเรน</span></p>
              </div>

              {/* อัปโหลดรูปสลิป */}
              <div>
                {!displaySlip ? (
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-gray-50 hover:border-[#79A68F] transition-all group"
                  >
                    <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#79A68F]/10 group-hover:text-[#79A68F] transition-colors">
                       <UploadCloud size={30} />
                    </div>
                    <p className="font-bold text-gray-700">คลิกเพื่ออัปโหลดสลิปโอนเงิน</p>
                    <p className="text-xs text-gray-400 mt-2">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                  </div>
                ) : (
                  <div className="relative border-2 border-gray-200 rounded-2xl overflow-hidden group">
                    {/* กรณีมีรูปจาก Backend มาให้ จะเติม Base URL ให้ถ้าจำเป็น */}
                    <img 
                      src={displaySlip.startsWith('http') || displaySlip.startsWith('blob:') ? displaySlip : `${apiBaseUrl.replace("/api", "")}${displaySlip}`} 
                      alt="Slip Preview" 
                      className="w-full h-48 object-contain bg-gray-50" 
                    />
                    
                    {/* ปุ่มปิด (แสดงเฉพาะตอนที่ User เพิ่งเลือกรูปใหม่เท่านั้น) */}
                    {slipPreview && (
                      <button 
                        onClick={clearSlip}
                        className="absolute top-2 right-2 p-1.5 bg-gray-900/50 hover:bg-red-500 text-white rounded-full transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                    
                    <div className="absolute bottom-0 left-0 w-full p-3 bg-white/90 backdrop-blur border-t border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-2 truncate pr-4">
                        <ImageIcon size={16} className="text-[#79A68F] shrink-0" />
                        <span className="text-xs font-bold text-gray-700 truncate">
                          {slipFile ? slipFile.name : "สลิปที่แนบไว้ล่าสุด"}
                        </span>
                      </div>
                      
                      {/* ปุ่มเปลี่ยนรูป */}
                      {!slipPreview && (
                        <button 
                          onClick={() => fileInputRef.current.click()}
                          className="text-xs font-bold text-blue-600 hover:underline shrink-0"
                        >
                          เปลี่ยนรูป
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/jpeg, image/png" 
                  className="hidden" 
                />

                {/* ปุ่มยืนยัน แสดงเมื่อมีการเลือกรูป "ใหม่" เท่านั้น */}
                {slipFile && (
                  <button 
                    disabled={isUploading}
                    onClick={handleUploadSlip}
                    className={`w-full mt-4 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      isUploading ? "bg-gray-400 text-white cursor-wait" : "bg-[#79A68F] text-white hover:bg-[#5E8570] shadow-lg shadow-[#79A68F]/30"
                    }`}
                  >
                    {isUploading ? <Loader className="animate-spin w-5 h-5" /> : <UploadCloud size={20} />}
                    {isUploading ? "กำลังอัปโหลด..." : (orderInfo.status === "processing" ? "อัปเดตสลิปใหม่" : "ยืนยันการชำระเงิน")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Order Info Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm font-bold text-[#79A68F] mb-1">รายละเอียดคำสั่งซื้อ</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                #{orderInfo.order_number}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                วันที่ทำรายการ: {formattedDate}
              </p>
            </div>

            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl h-fit border-2"
              style={{ backgroundColor: statusMeta.bg, color: statusMeta.color, borderColor: `${statusMeta.dot}30` }}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${orderInfo.status === 'processing' ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: statusMeta.dot }}
              />
              <span className="font-bold">{statusMeta.label}</span>
            </div>
          </div>

          {/* Tracking & Delivery */}
          <div className="p-6 sm:p-8 bg-gray-50/50 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-gray-100">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100"><Truck className="text-[#79A68F]" size={22} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">สถานะการจัดส่ง</p>
                <p className="text-sm font-bold text-gray-800 mt-1">
                  {orderInfo.tracking_number ? "อยู่ระหว่างจัดส่ง" : "รอดำเนินการ"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100"><Package className="text-[#79A68F]" size={22} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">เลขพัสดุ</p>
                {orderInfo.tracking_number ? (
                  <button className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline mt-1">
                    {orderInfo.tracking_number} <ExternalLink size={14} />
                  </button>
                ) : (
                  <p className="text-sm font-medium text-gray-500 mt-1">-</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100"><CreditCard className="text-[#79A68F]" size={22} /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">วิธีชำระเงิน</p>
                <p className="text-sm font-bold text-gray-800 mt-1 capitalize">
                  {orderInfo.payment_method?.replace('_', ' ') || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Item List */}
          <div className="p-6 sm:p-8 space-y-4">
            <h3 className="font-extrabold text-gray-900 mb-6 flex items-center gap-2 text-lg">
              รายการสินค้า 
              <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg">{(orderInfo.items || []).length}</span>
            </h3>

            <div className="space-y-4">
              {(orderInfo.items || []).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={28} className="text-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    <p className="text-base font-bold text-gray-900 line-clamp-2">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5 font-mono bg-gray-50 w-fit px-2 py-0.5 rounded-md border border-gray-100">
                      SKU: {item.product_sku || "-"}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                       <p className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                         ฿{Number(item.price).toLocaleString()} <span className="text-gray-400 mx-1">x</span> <span className="font-bold text-gray-800">{item.quantity}</span>
                       </p>
                       <p className="font-black text-gray-900 text-lg">
                         ฿{(item.price * item.quantity).toLocaleString()}
                       </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Footer */}
          <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100 flex flex-col items-end rounded-b-3xl">
            <div className="w-full md:w-80 space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>ยอดรวมสินค้า</span>
                <span className="font-bold text-gray-900">
                  ฿{(orderInfo.total_amount - orderInfo.shipping_cost).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>ค่าจัดส่ง</span>
                <span className="font-bold" style={{ color: BRAND.primary }}>
                  {Number(orderInfo.shipping_cost) === 0 ? "ฟรี" : `฿${Number(orderInfo.shipping_cost).toLocaleString()}`}
                </span>
              </div>

              <div className="h-px w-full bg-gray-200 my-2" />

              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-800">ยอดชำระสุทธิ</span>
                <span className="font-black text-3xl" style={{ color: BRAND.primary }}>
                  ฿{Number(orderInfo.total_amount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-50">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                 <MapPin size={22} />
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg">ที่อยู่จัดส่ง</h3>
            </div>
            <div className="space-y-3">
              <p className="text-base font-bold text-gray-900">{orderInfo.shipping_name}</p>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{orderInfo.shipping_address}</p>
              <p className="text-sm font-medium text-gray-800 pt-2 flex items-center gap-2">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">เบอร์ติดต่อ:</span> {orderInfo.shipping_phone}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-50">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                 <Receipt size={22} />
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg">ที่อยู่ออกใบเสร็จ</h3>
            </div>
            <div className="space-y-3">
              <p className="text-base font-bold text-gray-900">{orderInfo.billing_name}</p>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{orderInfo.billing_address}</p>
              <p className="text-sm font-medium text-gray-800 pt-2 flex items-center gap-2">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">เบอร์ติดต่อ:</span> {orderInfo.billing_phone}
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default OrderDetail;