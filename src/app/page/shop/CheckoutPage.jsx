import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  MapPin, 
  Receipt,
  Truck, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  QrCode,
  Loader,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../../context/ShopContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, fetchData } = useShop();
  
  const [step, setStep] = useState(1); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // --- ข้อมูลที่ดึงจาก API ---
  const [addresses, setAddresses] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedBilling, setSelectedBilling] = useState(null);

  // โชว์/ซ่อน Modal QR Code
  const [showQR, setShowQR] = useState(false);

  // คำนวณยอดเงิน
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 2000 ? 0 : 50;
  const total = subtotal + shippingFee;

  const apiBaseUrl = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

  // -------------------------------------------------------------
  // 1. ดึงข้อมูลที่อยู่จาก API
  // -------------------------------------------------------------
  useEffect(() => {
    const loadAddresses = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setIsLoadingAddresses(true);
        const res = await fetch(`${apiBaseUrl}/addresses`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success && data.data.length > 0) {
          setAddresses(data.data);
          
          // ✅ แยกหาค่า Default ของแต่ละ Type
          const defaultShipping = data.data.find(a => a.is_default === 1 && a.type === "shipping") 
                                  || data.data.find(a => a.type === "shipping");
          const defaultBilling = data.data.find(a => a.is_default === 1 && a.type === "billing") 
                                  || data.data.find(a => a.type === "billing");
          
          if (defaultShipping) setSelectedShipping(defaultShipping.id);
          if (defaultBilling) setSelectedBilling(defaultBilling.id);
        }
      } catch (error) {
        console.error("Fetch addresses error:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [apiBaseUrl, navigate]);

  // ✅ 2. กรองข้อมูลที่อยู่แยกตาม Type (เพื่อนำไปโชว์ใน Step 1 และ Step 2)
  const shippingAddresses = addresses.filter(a => a.type === "shipping");
  const billingAddresses = addresses.filter(a => a.type === "billing");

  // ฟังก์ชันช่วยจัดรูปแบบที่อยู่ให้เป็น Text ยาว
  const formatAddress = (addr) => {
    if (!addr) return "";
    const parts = [addr.address_line1, addr.address_line2, addr.sub_district, addr.district, addr.province, addr.zip_code];
    return parts.filter(Boolean).join(" ");
  };

  // -------------------------------------------------------------
  // 3. ยิง API ยืนยันการสั่งซื้อ
  // -------------------------------------------------------------
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("accessToken");
      
      const orderPayload = {
        shipping_address_id: selectedShipping,
        billing_address_id: selectedBilling, 
        shipping_cost: shippingFee,
        payment_method: "qr"
      };

      const res = await fetch(`${apiBaseUrl}/orders`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      if (data.success) {
        fetchData(); // ล้างตะกร้า
        setShowQR(false); // ปิด QR 
        alert("ขอบคุณครับ เราได้รับรายการชำระเงินของคุณแล้ว!");
        navigate(`/my-account/orders/${data.data.order_number}`);
      } else {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการสั่งซื้อ");
      }
    } catch (error) {
      console.error("Place order error", error);
      alert(error.message || "เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------
  // UI States
  // -------------------------------------------------------------
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ไม่มีสินค้าให้ชำระเงิน</h2>
            <button onClick={() => navigate("/shop")} className="text-[#79A68F] font-bold hover:underline">กลับไปเลือกสินค้า</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 font-sans relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Progress Bar */}
        <div className="flex items-center justify-center mb-10">
          {[
            { n: 1, t: "ที่อยู่จัดส่ง", icon: <MapPin className="w-4 h-4" /> },
            { n: 2, t: "ที่อยู่ออกใบเสร็จ", icon: <Receipt className="w-4 h-4" /> },
            { n: 3, t: "ยืนยัน & ชำระเงิน", icon: <CheckCircle2 className="w-4 h-4" /> }
          ].map((s, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step >= s.n ? "bg-[#79A68F] border-[#79A68F] text-white shadow-lg shadow-[#79A68F]/30" : "bg-white border-gray-200 text-gray-400"
                }`}>
                  {step > s.n ? <CheckCircle2 className="w-6 h-6" /> : s.icon}
                </div>
                <span className={`absolute -bottom-7 text-xs font-bold whitespace-nowrap ${step >= s.n ? "text-[#79A68F]" : "text-gray-400"}`}>{s.t}</span>
              </div>
              {idx < 2 && (
                <div className={`w-20 sm:w-32 h-1 mx-2 rounded-full transition-colors ${step > s.n ? "bg-[#79A68F]" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          
          {/* Left Column: Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ========================================================= */}
            {/* Step 1: ที่อยู่จัดส่ง (Shipping Address) */}
            {/* ========================================================= */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                    <MapPin className="text-[#79A68F]" /> เลือกที่อยู่จัดส่งพัสดุ
                  </h2>
                  <button onClick={() => navigate("/my-account/address-edit")} className="text-sm font-bold text-[#79A68F] hover:underline">
                    + เพิ่มที่อยู่
                  </button>
                </div>

                {isLoadingAddresses ? (
                  <div className="flex justify-center py-10"><Loader className="animate-spin text-[#79A68F] w-8 h-8" /></div>
                ) : shippingAddresses.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">คุณยังไม่มีข้อมูลที่อยู่จัดส่ง</p>
                    <button onClick={() => navigate("/my-account/address-edit")} className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold">เพิ่มที่อยู่ใหม่</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* ✅ ลูปเฉพาะ shippingAddresses */}
                    {shippingAddresses.map((addr) => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedShipping(addr.id)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedShipping === addr.id ? "border-[#79A68F] bg-[#79A68F]/5" : "border-gray-100 hover:border-[#79A68F]/30"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900">{addr.recipient_name}</span>
                              {addr.is_default === 1 && <span className="text-[10px] bg-[#79A68F] text-white px-2 py-0.5 rounded-full">เริ่มต้น</span>}
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{addr.phone}</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{formatAddress(addr)}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedShipping === addr.id ? "border-[#79A68F]" : "border-gray-300"}`}>
                            {selectedShipping === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-[#79A68F]" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <button 
                  disabled={!selectedShipping}
                  onClick={() => setStep(2)}
                  className={`w-full mt-8 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2 ${
                    selectedShipping ? "bg-[#79A68F] text-white hover:bg-[#5E8570]" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  ถัดไป: เลือกที่อยู่ออกใบเสร็จ <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* ========================================================= */}
            {/* Step 2: ที่อยู่ออกใบเสร็จ (Billing Address) */}
            {/* ========================================================= */}
            {step === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-gray-400 hover:text-[#79A68F] mb-4 text-sm font-bold transition">
                   <ChevronLeft className="w-4 h-4" /> ย้อนกลับ
                </button>
                
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                    <Receipt className="text-[#79A68F]" /> เลือกที่อยู่ออกใบเสร็จ
                  </h2>
                  <button onClick={() => navigate("/my-account/address-edit")} className="text-sm font-bold text-[#79A68F] hover:underline">
                    + เพิ่มที่อยู่
                  </button>
                </div>

                {/* ✅ ปุ่มคัดลอกที่อยู่จัดส่งมาใช้ */}
                <button 
                  onClick={() => setSelectedBilling(selectedShipping)}
                  className={`w-full mb-6 py-3 border border-dashed rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    selectedBilling === selectedShipping 
                      ? "border-[#79A68F] bg-[#79A68F]/10 text-[#79A68F]" 
                      : "border-gray-300 text-gray-500 hover:border-[#79A68F] hover:bg-[#79A68F]/5 hover:text-[#79A68F]"
                  }`}
                >
                  {selectedBilling === selectedShipping && <CheckCircle2 className="w-5 h-5" />}
                  ใช้ที่อยู่เดียวกับที่อยู่จัดส่ง
                </button>

                {/* ✅ โชว์เฉพาะ Billing หรือโชว์ Empty ถ้าไม่มี */}
                {billingAddresses.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mb-6">
                    <p className="text-gray-500 text-sm">คุณไม่มีที่อยู่ออกใบเสร็จในระบบ<br/>กรุณากด "เพิ่มที่อยู่" หรือเลือก "ใช้ที่อยู่เดียวกับที่อยู่จัดส่ง"</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {billingAddresses.map((addr) => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedBilling(addr.id)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedBilling === addr.id ? "border-[#79A68F] bg-[#79A68F]/5" : "border-gray-100 hover:border-[#79A68F]/30"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900">{addr.recipient_name}</span>
                              {addr.is_default === 1 && <span className="text-[10px] bg-[#79A68F] text-white px-2 py-0.5 rounded-full">เริ่มต้น</span>}
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{addr.phone}</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{formatAddress(addr)}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBilling === addr.id ? "border-[#79A68F]" : "border-gray-300"}`}>
                            {selectedBilling === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-[#79A68F]" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  disabled={!selectedBilling}
                  onClick={() => setStep(3)}
                  className={`w-full mt-8 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2 ${
                    selectedBilling ? "bg-[#79A68F] text-white hover:bg-[#5E8570]" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  ถัดไป: ตรวจสอบรายการสั่งซื้อ <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* ========================================================= */}
            {/* Step 3: Review & Generate QR */}
            {/* ========================================================= */}
            {step === 3 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-in zoom-in-95 duration-300">
                <button onClick={() => setStep(2)} className="flex items-center gap-1 text-gray-400 hover:text-[#79A68F] mb-4 text-sm font-bold transition">
                   <ChevronLeft className="w-4 h-4" /> แก้ไขที่อยู่ออกใบเสร็จ
                </button>
                <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2 mb-6">
                  <CheckCircle2 className="text-[#79A68F]" /> ตรวจสอบรายการและชำระเงิน
                </h2>
                
                <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><MapPin size={14}/> จัดส่งไปที่</p>
                          <p className="text-sm font-bold text-gray-900">{addresses.find(a => a.id === selectedShipping)?.recipient_name}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{formatAddress(addresses.find(a => a.id === selectedShipping))}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Receipt size={14}/> ออกใบเสร็จที่</p>
                          <p className="text-sm font-bold text-gray-900">{addresses.find(a => a.id === selectedBilling)?.recipient_name}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{formatAddress(addresses.find(a => a.id === selectedBilling))}</p>
                      </div>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="font-bold text-gray-900 text-sm">รายการสินค้า ({cartItems.length})</p>
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-gray-500">จำนวน {item.quantity} x ฿{item.price.toLocaleString()}</p>
                        </div>
                        <p className="text-xs font-bold text-gray-900">฿{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowQR(true)}
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition shadow-lg shadow-[#79A68F]/30 flex items-center justify-center gap-2 bg-[#79A68F] text-white hover:bg-[#5E8570]`}
                >
                  <QrCode size={24} /> สร้าง QR Code เพื่อชำระเงิน
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-32">
              <h3 className="text-lg font-extrabold text-gray-900 mb-6">สรุปยอดชำระ</h3>
              <div className="space-y-4 pb-6 border-b border-gray-50">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>ยอดรวมสินค้า</span>
                  <span className="font-bold text-gray-900">฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>ค่าจัดส่ง</span>
                  <span className="font-bold text-[#79A68F]">{shippingFee === 0 ? "ฟรี" : `฿${shippingFee}`}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-6 mb-8">
                <span className="text-base font-bold text-gray-900">ยอดสุทธิ</span>
                <span className="text-3xl font-extrabold text-[#79A68F]">฿{total.toLocaleString()}</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                <div className="flex items-center gap-3 text-[11px] font-bold text-gray-600">
                   <ShieldCheck className="w-4 h-4 text-[#79A68F]" /> ชำระเงินผ่าน PromptPay
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold text-gray-600">
                   <Truck className="w-4 h-4 text-[#79A68F]" /> จัดส่งรวดเร็ว ปลอดภัย
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 🟢 MODAL: จำลองหน้าจอแสกน QR Code */}
      {/* ========================================================= */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative">
            
            {/* Header */}
            <div className="bg-[#1C3E5E] p-6 text-center relative">
              <button 
                onClick={() => setShowQR(false)} 
                className="absolute top-4 right-4 text-white/70 hover:text-white transition"
              >
                <X size={24} />
              </button>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/PromptPay-logo.png/1200px-PromptPay-logo.png" alt="PromptPay" className="h-8 mx-auto mb-2 object-contain" />
              <p className="text-white text-sm">แสกนคิวอาร์โค้ดเพื่อชำระเงิน</p>
            </div>

            {/* QR Image */}
            <div className="p-8 text-center bg-gray-50">
               {/* 💡 รูป QR ปลอม */}
               <div className="w-48 h-48 bg-white mx-auto p-2 rounded-xl border border-gray-200 shadow-sm mb-4">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PETTERAIN_PAY_${total}`} alt="QR Code" className="w-full h-full opacity-90" />
               </div>
               
               <p className="text-gray-500 text-xs mb-1">บริษัท เพ็ทเทอเรน จำกัด</p>
               <p className="text-3xl font-extrabold text-[#1C3E5E] mb-6">฿{total.toLocaleString()}</p>

               {/* ปุ่มจำลองสถานการณ์โอน */}
               <button 
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="w-full py-4 bg-[#79A68F] text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#5E8570] transition shadow-md"
               >
                 {isProcessing ? <Loader className="animate-spin w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}
                 {isProcessing ? "กำลังตรวจสอบยอดเงิน..." : "จำลองการโอนสำเร็จ"}
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}