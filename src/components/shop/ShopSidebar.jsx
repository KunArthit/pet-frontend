import React from "react";

export default function ShopSidebar({
  categories = [],
  category,
  onCategoryChange,
  maxPrice,
  onMaxPriceChange,
  maxPriceLimit = 2000,
}) {
  return (
    <aside className="w-full lg:w-1/4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {/* Category */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">หมวดหมู่</h3>

          <div className="space-y-3">
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-3 cursor-pointer hover:text-[#79A68F] transition"
              >
                {/* ใช้ radio เพราะเลือกได้ 1 หมวด ตาม state ปัจจุบันของคุณ */}
                <input
                  type="radio"
                  name="shop-category"
                  className="text-[#79A68F] focus:ring-[#79A68F]"
                  checked={category === cat}
                  onChange={() => onCategoryChange(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-2">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">ช่วงราคา</h3>

          <input
            type="range"
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            min="0"
            max={maxPriceLimit}
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          />

          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>฿0</span>
            <span>฿{maxPrice.toLocaleString()}</span>
          </div>

          <button
            type="button"
            onClick={() => onMaxPriceChange(maxPriceLimit)}
            className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            ล้างช่วงราคา
          </button>
        </div>
      </div>
    </aside>
  );
}
