import { ShoppingBag } from "lucide-react";
import ProductCard from "../products/ProductCard";
import { useNavigate } from "react-router-dom";

export default function BestsellerPreview({
  products = [],
  title = "สินค้าขายดี",
  subtitle = "คัดสรรสิ่งที่ดีที่สุดเพื่อเจ้าตัวเล็กของคุณ",
  maxItems = 4,
  onProductClick,
  showViewAllButton = true,
}) {
  const items = Array.isArray(products) ? products.slice(0, maxItems) : [];
  const navigate = useNavigate();

  return (
    <section className="pt-20 pb-18 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-500">{subtitle}</p>
          </div>

          {showViewAllButton ? (
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="hidden md:flex items-center text-[#79A68F] font-semibold hover:text-[#5E8570] transition"
            >
              ดูทั้งหมด <ShoppingBag className="ml-2 w-4 h-4" />
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((p) => (
            <ProductCard
              key={p.id ?? `${p.name}-${p.price}`}
              product={p}
              onClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
