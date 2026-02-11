import React from "react";
import { Star, Search } from "lucide-react";

/**
 * ProductCard
 * - TailwindCSS styles (same as your inline version)
 * - Clickable card: pass onClick(product)
 */
export default function ProductCard({ product, onClick }) {
  if (!product) return null;

  const price = typeof product.price === "number" ? product.price : Number(product.price || 0);
  const oldPrice =
    product.oldPrice === null || product.oldPrice === undefined
      ? null
      : typeof product.oldPrice === "number"
        ? product.oldPrice
        : Number(product.oldPrice);

  const formatTHB = (n) =>
    new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(n);

  const handleClick = () => {
    if (typeof onClick === "function") onClick(product);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {product.badge && (
          <span
            className={`absolute top-3 left-3 ${
              product.badgeColor || "bg-red-500"
            } text-white text-xs font-bold px-2 py-1 rounded`}
          >
            {product.badge}
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <button
          type="button"
          className="absolute bottom-3 right-3 bg-white hover:bg-[#79A68F] text-gray-800 hover:text-white p-2 rounded-full shadow-md transition-colors transform translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-300"
          onClick={(e) => {
            // prevent double-calling when clicking the button itself
            e.stopPropagation();
            handleClick();
          }}
          aria-label="Quick view"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>

        <h3 className="font-bold text-gray-900 mb-2 truncate">{product.name}</h3>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#79A68F] font-bold text-lg">
              ฿{formatTHB(price)}
            </span>
            {oldPrice ? (
              <span className="text-gray-400 text-sm line-through ml-2">
                ฿{formatTHB(oldPrice)}
              </span>
            ) : null}
          </div>

          {/* <div className="flex text-yellow-400 text-xs" aria-label={`Rating ${product.rating || 0}`}>
            {[...Array(5)].map((_, i) => {
              const filled = i < Math.round(Number(product.rating || 0));
              return (
                <Star
                  key={i}
                  className={`w-3 h-3 ${filled ? "fill-current" : "text-gray-300"}`}
                />
              );
            })}
          </div> */}
        </div>
      </div>
    </div>
  );
}

