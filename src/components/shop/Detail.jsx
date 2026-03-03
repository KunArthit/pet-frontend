/* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable no-unused-vars */
// import React, { useMemo, useState } from "react";
// import { X, Minus, Plus, ShoppingBag, Star, Heart } from "lucide-react";

// export default function Detail({ product, onClose, onAddToCart }) {
//   const [qty, setQty] = useState(1);

//   const stars = useMemo(() => {
//     const r = Number(product?.rating || 0);
//     const rounded = Math.max(0, Math.min(5, Math.round(r)));
//     return Array.from({ length: 5 }).map((_, i) => i < rounded);
//   }, [product]);

//   const dec = () => setQty((v) => Math.max(1, v - 1));
//   const inc = () => setQty((v) => v + 1);

//   if (!product) return null;

//   return (
//     <div className="fixed inset-0 z-[60]" aria-modal="true" role="dialog">
//       {/* Backdrop */}
//       <button
//         type="button"
//         className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//         onClick={onClose}
//         aria-label="close"
//       />

//       {/* Modal */}
//       <div className="relative z-[61] min-h-full flex items-center justify-center p-4">
//         <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
//           {/* Close */}
//           <button
//             type="button"
//             onClick={onClose}
//             className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
//             aria-label="close detail"
//           >
//             <X className="w-5 h-5 text-gray-700" />
//           </button>

//           <div className="grid grid-cols-1 md:grid-cols-2">
//             {/* Image */}
//             <div className="relative bg-gray-100 h-64 md:h-full min-h-[380px]">
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="absolute inset-0 w-full h-full object-cover"
//               />

//               {product.badge ? (
//                 <div className="absolute top-4 left-4">
//                   <span
//                     className={`${
//                       product.badgeColor || "bg-red-500"
//                     } text-white text-xs font-bold px-2 py-1 rounded-lg`}
//                   >
//                     {product.badge}
//                   </span>
//                 </div>
//               ) : null}
//             </div>

//             {/* Info */}
//             <div className="p-8 md:p-10">
//               <p className="text-sm text-gray-500 mb-2">{product.category}</p>
//               <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
//                 {product.name}
//               </h2>

//               {/* <div className="flex items-center gap-2 mb-4">
//                 <div className="flex text-yellow-400">
//                   {stars.map((filled, i) => (
//                     <Star
//                       key={i}
//                       className={`w-4 h-4 ${filled ? "fill-current" : "text-gray-300"}`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-gray-500">
//                   {product.rating ? `${product.rating}` : "—"}
//                 </span>
//               </div> */}

//               <div className="flex items-end gap-3 mb-6">
//                 <span className="text-3xl font-extrabold text-emerald-600">
//                   ฿{product.price}
//                 </span>
//                 {product.oldPrice ? (
//                   <span className="text-lg text-gray-400 line-through mb-1">
//                     ฿{product.oldPrice}
//                   </span>
//                 ) : null}
//               </div>

//               <p className="text-gray-600 leading-relaxed mb-8">
//                 {product.description || "—"}
//               </p>

//               {/* Qty */}
//               <div className="mb-8">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   จำนวน
//                 </label>
//                 <div className="inline-flex items-center border border-gray-200 rounded-full overflow-hidden">
//                   <button
//                     type="button"
//                     onClick={dec}
//                     className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition"
//                     aria-label="decrease"
//                   >
//                     <Minus className="w-4 h-4 text-gray-700" />
//                   </button>
//                   <div className="w-14 text-center font-semibold text-gray-900">
//                     {qty}
//                   </div>
//                   <button
//                     type="button"
//                     onClick={inc}
//                     className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition"
//                     aria-label="increase"
//                   >
//                     <Plus className="w-4 h-4 text-gray-700" />
//                   </button>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => onAddToCart?.(qty)}
//                   className="flex-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 font-bold shadow-lg transition flex items-center justify-center gap-2"
//                 >
//                   <ShoppingBag className="w-5 h-5" />
//                   ใส่ตะกร้า
//                 </button>

//                 <button
//                   type="button"
//                   className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition"
//                   aria-label="favorite"
//                 >
//                   <Heart className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Hint */}
//               <p className="text-xs text-gray-400 mt-4">
//                 * ถ้าต้องการให้ Detail ไปเป็น “หน้า” แยก (route) บอกผมได้ เดี๋ยวผมจัดแบบ react-router ให้
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



/* eslint-disable no-unused-vars */
import React, { useMemo, useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingBag, Star, Heart } from "lucide-react";
import { useShop } from "../../context/ShopContext"; 

export default function Detail({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ เพิ่ม State เช็ค Login
  
  const { addToCart, wishlistItems, toggleWishlist } = useShop(); 

  // ✅ เช็ค Token ตอนเปิด Modal
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const stars = useMemo(() => {
    const r = Number(product?.rating || 0);
    const rounded = Math.max(0, Math.min(5, Math.round(r)));
    return Array.from({ length: 5 }).map((_, i) => i < rounded);
  }, [product]);

  const dec = () => setQty((v) => Math.max(1, v - 1));
  const inc = () => setQty((v) => v + 1);

  if (!product) return null;

  const isWishlisted = wishlistItems?.some((item) => item.id === product.id) || false;

  const formatTHB = (n) => new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(n);
  const price = typeof product.price === "number" ? product.price : Number(product.price || 0);
  const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;

  const handleAddToCart = async () => {
    await addToCart({ ...product, quantity: qty });
    alert(`เพิ่ม ${product.name} จำนวน ${qty} ชิ้น ลงตะกร้าแล้ว!`);
    onClose(); 
  };

  const handleToggleWishlist = async () => {
    await toggleWishlist(product);
  };

  return (
    <div className="fixed inset-0 z-[60]" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="close"
      />

      {/* Modal */}
      <div className="relative z-[61] min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            aria-label="close detail"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative bg-gray-100 h-64 md:h-full min-h-[380px]">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {product.badge ? (
                <div className="absolute top-4 left-4">
                  <span
                    className={`${
                      product.badgeColor || "bg-red-500"
                    } text-white text-xs font-bold px-2 py-1 rounded-lg`}
                  >
                    {product.badge}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Info */}
            <div className="p-8 md:p-10 flex flex-col h-full">
              <p className="text-sm font-bold text-[#79A68F] mb-2">{product.category}</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-end gap-3 mb-6 mt-2">
                <span className="text-3xl font-extrabold text-[#79A68F]">
                  ฿{formatTHB(price)}
                </span>
                {oldPrice ? (
                  <span className="text-lg text-gray-400 line-through mb-1">
                    ฿{formatTHB(oldPrice)}
                  </span>
                ) : null}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {product.description || "รายละเอียดสินค้าเบื้องต้น ช่วยให้ได้รับสารอาหารที่ครบถ้วนและช่วยให้มีสุขภาพที่แข็งแรง"}
              </p>

              {/* ✅ เช็ค Login ก่อนแสดงปุ่ม */}
              {isLoggedIn ? (
                <>
                  {/* Qty */}
                  <div className="mb-8 mt-auto">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      จำนวน
                    </label>
                    <div className="inline-flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
                      <button
                        type="button"
                        onClick={dec}
                        className="w-11 h-11 flex items-center justify-center hover:bg-white hover:text-[#79A68F] transition bg-transparent"
                        aria-label="decrease"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="w-14 text-center font-semibold text-gray-900 text-lg">
                        {qty}
                      </div>
                      <button
                        type="button"
                        onClick={inc}
                        className="w-11 h-11 flex items-center justify-center hover:bg-white hover:text-[#79A68F] transition bg-transparent"
                        aria-label="increase"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 rounded-2xl bg-[#79A68F] hover:bg-[#5E8570] text-white py-3.5 px-6 font-bold shadow-lg shadow-[#79A68F]/30 transition flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      ใส่ตะกร้า
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                        isWishlisted 
                          ? "border-rose-500 bg-rose-50 text-rose-500" 
                          : "border-gray-200 text-gray-400 hover:border-rose-200 hover:text-rose-500"
                      }`}
                      aria-label="favorite"
                    >
                      <Heart className={`w-6 h-6 transition-transform ${isWishlisted ? "fill-current scale-110" : ""}`} />
                    </button>
                  </div>
                </>
              ) : (
                /* ❌ กรณีที่ยังไม่ Login */
                <div className="mt-auto bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                  <p className="text-gray-600 mb-3 text-sm font-medium">
                    กรุณาเข้าสู่ระบบเพื่อสั่งซื้อสินค้าและเก็บเข้ารายการโปรด
                  </p>
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="w-full rounded-xl bg-gray-900 hover:bg-gray-800 text-white py-3 font-bold transition-colors"
                  >
                    ไปที่หน้าเข้าสู่ระบบ
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}