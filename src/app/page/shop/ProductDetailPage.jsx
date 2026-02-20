import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Heart, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Star, 
  ChevronLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Loader 
} from "lucide-react";
import { useShop } from "../../../context/ShopContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useShop();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // -------------------------------------------------------------
  // [MOCK DATA] ข้อมูลจำลองสำหรับแสดงผลไปก่อน
  // -------------------------------------------------------------
  const mockProduct = {
    id: id || "1",
    name: "Royal Canin อาหารสุนัขโต พันธุ์เล็ก (Mini Adult) ชนิดเม็ด",
    category: "อาหารสุนัข",
    price: 850,
    originalPrice: 990,
    rating: 4.8,
    reviews: 124,
    sold: 530,
    inStock: true,
    stockQty: 15,
    description: "อาหารสุนัขโต พันธุ์เล็ก อายุ 10 เดือน - 8 ปี รักษาน้ำหนักให้อยู่ในระดับที่เหมาะสม มีแอล-คาร์นิทีน ช่วยกระตุ้นการเผาผลาญไขมัน ความน่ากินสูง ตอบโจทย์ความช่างเลือกของสุนัขพันธุ์เล็ก ด้วยกลิ่นหอมเฉพาะตัว ขนสวยสุขภาพดี ด้วยกลุ่มสารอาหารดูแลผิว และ EPA&DHA",
    features: [
      "รักษาน้ำหนักให้อยู่ในระดับที่เหมาะสม",
      "ขนสวยเงางาม สุขภาพผิวหนังดี",
      "ดูแลสุขภาพฟัน ลดการสะสมของหินปูน",
      "ความน่ากินสูง หอม อร่อย"
    ],
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=600&q=80"
    ]
  };

  useEffect(() => {
    // -------------------------------------------------------------
    // [API DRAFT] โครงร่างสำหรับดึงข้อมูลจาก API จริง
    // -------------------------------------------------------------
    const loadDetail = async () => {
      setIsLoading(true);
      try {
        // [TODO: ใส่ API สำหรับดึงข้อมูลสินค้าตรงนี้]
        // const response = await fetch(`API_ENDPOINT/products/${id}`);
        // const data = await response.json();
        
        // จำลองการดีเลย์ของเน็ตเวิร์ก 0.5 วินาที แล้วใส่ Mock Data
        setTimeout(() => {
          setProduct(mockProduct);
          setActiveImage(mockProduct.images[0]);
          setIsLoading(false);
        }, 500);

      } catch (error) {
        console.error("Error fetching product details:", error);
        setIsLoading(false);
      }
    };

    if (id) loadDetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const decreaseQty = () => setQuantity(prev => Math.max(1, prev - 1));
  const increaseQty = () => setQuantity(prev => Math.min(product?.stockQty || 1, prev + 1));

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity });
    alert(`เพิ่มลงตะกร้า ${quantity} ชิ้น เรียบร้อย!`);
    
    // -------------------------------------------------------------
    // [API DRAFT] โครงร่างสำหรับส่งข้อมูลไปบันทึกตะกร้าใน Database
    // -------------------------------------------------------------
    // const payload = { productId: product.id, quantity };
    // await fetch(`API_ENDPOINT/cart`, { method: 'POST', body: JSON.stringify(payload) });
  };

  const handleToggleWishlist = async () => {
    // อัปเดต UI ให้เปลี่ยนสีทันทีก่อนรอ API เพื่อความลื่นไหล
    setIsWishlisted(!isWishlisted); 

    // -------------------------------------------------------------
    // [API DRAFT] โครงร่างสำหรับส่งข้อมูลไปบันทึก Wishlist ใน Database
    // -------------------------------------------------------------
    // try {
    //   await fetch(`API_ENDPOINT/wishlist`, { 
    //      method: 'POST', 
    //      body: JSON.stringify({ productId: product.id }) 
    //   });
    // } catch (e) {
    //   // ถ้า API error ให้ Revert UI กลับ
    //   setIsWishlisted(!isWishlisted); 
    //   console.error("Failed to toggle wishlist");
    // }
  };

  // State: Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader className="animate-spin text-[#79A68F] w-12 h-12" />
      </div>
    );
  }

  // State: Error / Not Found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-800">
        <h2 className="text-2xl font-bold mb-4">ไม่พบสินค้า</h2>
        <button onClick={() => navigate("/shop")} className="text-[#79A68F] hover:underline">
          กลับไปหน้าสินค้าทั้งหมด
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1 text-gray-500 hover:text-[#79A68F] transition font-semibold text-sm bg-gray-50 hover:bg-[#79A68F]/10 px-3 py-1.5 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" /> ย้อนกลับ
          </button>
          <div className="text-sm text-gray-400 flex items-center gap-2 hidden sm:flex">
            <span className="cursor-pointer hover:text-[#79A68F]" onClick={() => navigate("/")}>หน้าแรก</span>
            <span>/</span>
            <span className="cursor-pointer hover:text-[#79A68F]" onClick={() => navigate("/shop")}>สินค้าทั้งหมด</span>
            <span>/</span>
            <span className="text-[#79A68F] font-semibold">{product.category}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 relative">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="px-6 py-2 bg-gray-900 text-white font-bold rounded-full text-lg shadow-xl">สินค้าหมด</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(img)} 
                  className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                    activeImage === img ? "border-[#79A68F] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            <p className="text-[#79A68F] font-bold tracking-wide mb-2">{product.category}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>

            {/* Ratings & Sold */}
            <div className="flex items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold text-gray-900 text-base">{product.rating}</span>
                <span className="text-gray-500">({product.reviews} รีวิว)</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="text-gray-600 font-medium">ขายแล้ว {product.sold} ชิ้น</div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="text-gray-600 font-medium">เหลือ {product.stockQty} ชิ้น</div>
            </div>

            {/* Pricing */}
            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-extrabold text-[#79A68F]">
                ฿{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through font-semibold mb-1">
                    ฿{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="px-2 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-md mb-2">
                    ลด {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Descriptions & Features */}
            <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-wrap">
              {product.description}
            </p>

            {product.features && product.features.length > 0 && (
              <ul className="space-y-2 mb-8">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#79A68F]" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="h-px bg-gray-100 w-full mb-8" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center justify-between bg-gray-50 p-1.5 rounded-2xl border border-gray-200 sm:w-36 shrink-0 h-14">
                <button onClick={decreaseQty} disabled={quantity <= 1 || !product.inStock} className="w-10 h-10 rounded-xl bg-white shadow-sm text-gray-600 hover:text-[#79A68F] disabled:opacity-50"><Minus className="w-5 h-5 mx-auto" /></button>
                <span className="font-bold text-lg">{quantity}</span>
                <button onClick={increaseQty} disabled={quantity >= product.stockQty || !product.inStock} className="w-10 h-10 rounded-xl bg-white shadow-sm text-gray-600 hover:text-[#79A68F] disabled:opacity-50"><Plus className="w-5 h-5 mx-auto" /></button>
              </div>

              <button onClick={handleAddToCart} disabled={!product.inStock} className={`flex-1 flex items-center justify-center gap-3 h-14 rounded-2xl font-bold text-lg transition-all ${product.inStock ? "bg-[#79A68F] text-white hover:bg-[#5E8570] shadow-lg shadow-[#79A68F]/30 hover:-translate-y-0.5" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                <ShoppingCart className="w-6 h-6" /> {product.inStock ? "หยิบใส่ตะกร้า" : "สินค้าหมด"}
              </button>

              <button onClick={handleToggleWishlist} className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl border-2 transition-all ${isWishlisted ? "border-rose-500 bg-rose-50 text-rose-500" : "border-gray-200 bg-white text-gray-400 hover:border-rose-200 hover:text-rose-500"}`}>
                <Heart className={`w-6 h-6 transition-transform ${isWishlisted ? "fill-current scale-110" : ""}`} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-[#79A68F]" />
                <span className="text-xs font-bold text-gray-700">ของแท้ 100%<br/><span className="text-gray-500 font-medium">รับประกันคุณภาพ</span></span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                <Truck className="w-6 h-6 text-[#79A68F]" />
                <span className="text-xs font-bold text-gray-700">ส่งฟรีทั่วประเทศ<br/><span className="text-gray-500 font-medium">เมื่อซื้อครบ 2,000.-</span></span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                <RotateCcw className="w-6 h-6 text-[#79A68F]" />
                <span className="text-xs font-bold text-gray-700">คืนสินค้าได้<br/><span className="text-gray-500 font-medium">ภายใน 7 วัน</span></span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}