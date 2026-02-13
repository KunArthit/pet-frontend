/* eslint-disable no-unused-vars */
import React from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../../context/ShopContext";

export default function WishlistPage() {
  const navigate = useNavigate();

  // ✅ ดึง addToCart มาจาก Context
  const { wishlistItems, removeWishlist, addToCart } = useShop();

  const goToDetail = (item) => { navigate("/shop"); };

  // ✅ สร้างฟังก์ชันจัดการตอนกดหยิบใส่ตะกร้า
  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`เพิ่ม "${item.name}" ลงในตะกร้าแล้ว!`);
    
    // (Optional) ถ้าอยากให้พอกดใส่ตะกร้าแล้ว หายไปจาก Wishlist เลย ให้เปิดคอมเมนต์บรรทัดล่างนี้ครับ
    // removeWishlist(item.id); 
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="p-6 bg-rose-50 rounded-full mb-6">
          <Heart className="w-16 h-16 text-rose-500 fill-current" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">รายการที่บันทึกไว้ว่างเปล่า</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          คุณยังไม่ได้บันทึกสินค้าใดๆ เลย กดรูปหัวใจที่สินค้าเพื่อบันทึกไว้ดูภายหลัง
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="px-8 py-3 border-2 border-[#79A68F] text-[#79A68F] font-bold rounded-xl hover:bg-emerald-50 transition"
        >
          ไปดูสินค้าที่น่าสนใจ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-rose-500 fill-current" />
          <h1 className="text-3xl font-extrabold text-gray-900">รายการที่บันทึก</h1>
          <span className="ml-2 bg-gray-200 text-gray-600 py-1 px-3 rounded-full text-sm font-bold">
            {wishlistItems.length} รายการ
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-center transition-all hover:shadow-md">
              
              <div 
                onClick={() => goToDetail(item)}
                className="w-full sm:w-28 sm:h-28 h-48 shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 relative cursor-pointer group"
              >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">สินค้าหมด</span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col sm:flex-row justify-between w-full gap-4">
                <div>
                  <p className="text-sm font-bold text-[#79A68F] mb-1">{item.category}</p>
                  <h3 
                    onClick={() => goToDetail(item)}
                    className="text-lg font-bold text-gray-900 line-clamp-2 cursor-pointer hover:text-[#79A68F] transition-colors"
                  >
                    {item.name}
                  </h3>
                  <p className="text-xl font-extrabold text-[#79A68F] mt-2">
                    ฿{item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex sm:flex-col flex-row gap-3 items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                  <button 
                    onClick={() => removeWishlist(item.id)}
                    className="text-gray-400 hover:text-rose-500 transition flex items-center gap-1 text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" /> ลบรายการนี้
                  </button>
                  
                  {/* ✅ เรียกใช้ handleAddToCart ตรงนี้ */}
                  <button 
                    disabled={!item.inStock}
                    onClick={() => handleAddToCart(item)}
                    className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition w-full sm:w-auto justify-center ${
                      item.inStock 
                        ? "bg-[#79A68F] text-white hover:bg-[#5E8570] shadow-md shadow-[#79A68F]/30" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" /> 
                    {item.inStock ? "หยิบใส่ตะกร้า" : "สินค้าหมด"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}