import React from "react";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../../context/ShopContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateCartQuantity, removeCartItem } = useShop();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 2000 ? 0 : 50; 
  const total = subtotal + shippingFee;

  const goToDetail = (item) => { navigate(`/product/${item.id}`); };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="p-6 bg-emerald-50 rounded-full mb-6"><ShoppingBag className="w-16 h-16 text-emerald-600" /></div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">ตะกร้าสินค้าของคุณว่างเปล่า</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">ดูเหมือนคุณจะยังไม่ได้เพิ่มสินค้าใดๆ ลงในตะกร้า ลองดูสินค้าที่น่าสนใจในร้านของเราสิ</p>
        <button onClick={() => navigate("/shop")} className="px-8 py-3 bg-[#79A68F] text-white font-bold rounded-xl hover:bg-[#5E8570] transition shadow-lg shadow-[#79A68F]/30">เลือกซื้อสินค้าเลย</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">ตะกร้าสินค้าของฉัน</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-4">
            {cartItems.map((item) => {
              // เช็คเงื่อนไข Disabled ปุ่ม
              const isMinusDisabled = item.quantity <= 1;
              const isPlusDisabled = item.quantity >= item.stock;

              return (
                <div key={item.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-all hover:shadow-md">
                  <div onClick={() => goToDetail(item)} className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 cursor-pointer group">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between h-full w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-[#79A68F] mb-1">{item.category}</p>
                        <h3 onClick={() => goToDetail(item)} className="text-lg font-bold text-gray-900 line-clamp-2 cursor-pointer hover:text-[#79A68F] transition-colors">{item.name}</h3>
                        {/* ⚠️ เตือนเมื่อสินค้าใกล้หมด หรือกดจนเต็มแม็กซ์แล้ว */}
                        {isPlusDisabled && (
                          <p className="text-xs font-bold text-rose-500 mt-1">ถึงจำนวนสต๊อกสูงสุดแล้ว</p>
                        )}
                      </div>
                      <button onClick={() => removeCartItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"><Trash2 className="w-5 h-5" /></button>
                    </div>
                    <div className="flex items-end justify-between mt-4">
                      <p className="text-2xl font-extrabold text-gray-900">฿{(item.price * item.quantity).toLocaleString()}</p>
                      
                      {/* กลุ่มปุ่มเพิ่ม-ลดจำนวน */}
                      <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)} 
                          disabled={isMinusDisabled}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg shadow-sm transition ${isMinusDisabled ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-white text-gray-600 hover:text-[#79A68F]"}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <span className="w-6 text-center font-bold text-gray-900">{item.quantity}</span>
                        
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)} 
                          disabled={isPlusDisabled}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg shadow-sm transition ${isPlusDisabled ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-white text-gray-600 hover:text-[#79A68F]"}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* ขวา: สรุปยอด */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-32">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">สรุปคำสั่งซื้อ</h2>
              <div className="space-y-4 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between"><span>ยอดรวมสินค้า ({cartItems.length} ชิ้น)</span><span className="font-bold text-gray-900">฿{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>ค่าจัดส่ง</span><span className="font-bold text-gray-900">{shippingFee === 0 ? <span className="text-[#79A68F]">ส่งฟรี</span> : `฿${shippingFee}`}</span></div>
              </div>
              <div className="flex justify-between items-end mb-8"><span className="text-base font-bold text-gray-900">ยอดสุทธิ</span><span className="text-3xl font-extrabold text-[#79A68F]">฿{total.toLocaleString()}</span></div>
              <button onClick={() => alert("ระบบกำลังพาท่านไปหน้าชำระเงิน...")} className="w-full py-4 rounded-2xl bg-[#79A68F] text-white font-bold text-lg hover:bg-[#5E8570] transition shadow-lg shadow-[#79A68F]/30 flex items-center justify-center gap-2">ดำเนินการชำระเงิน <ArrowRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}