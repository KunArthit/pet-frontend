import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/products/ProductCard";
import Detail from "./Detail.jsx";
import ShopSidebar from "./ShopSidebar.jsx";

export default function ShopView({
  title = "สินค้าทั้งหมด",
  subtitle = "เลือกสิ่งที่ดีที่สุดเพื่อเจ้าตัวเล็กของคุณ",
  onAddToCart,
}) {
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("popular");
  const [category, setCategory] = useState("ทั้งหมด");
  const [maxPrice, setMaxPrice] = useState(5000);

  const apiBaseUrl = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

  // --------------------------------------------------------------------------
  // 🔄 Fetch Data & Apply URL Filter
  // --------------------------------------------------------------------------
  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [prodRes, catRes] = await Promise.all([
          fetch(`${apiBaseUrl}/products?limit=1000`),
          fetch(`${apiBaseUrl}/categories`)
        ]);

        const prodResult = await prodRes.json();
        const catResult = await catRes.json();

        let categoryLookup = {};
        let availableCategories = [];

        if (catResult.success) {
          setDbCategories(catResult.data);
          availableCategories = catResult.data;

          catResult.data.forEach(c => {
            categoryLookup[c.id] = c.name;
          });
        }

        if (prodResult.success) {
          // ✅ เพิ่ม filter เอาเฉพาะสินค้าที่ is_active !== 0
          const activeProducts = prodResult.data.filter(p => p.is_active !== 0);

          const mappedProducts = activeProducts.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: Number(p.price),
            image: p.image_url || "https://placehold.co/300x300?text=No+Image",
            category: categoryLookup[p.category_id] || "ทั่วไป",
            categoryId: p.category_id,
            rating: 4.5,
            stock: p.stock_quantity,
            createdAt: p.created_at,
            is_active: p.is_active, // เก็บไว้ด้วยเผื่อใช้
          }));

          setProducts(mappedProducts);
        } else {
          throw new Error("ไม่สามารถโหลดข้อมูลสินค้าได้");
        }

        // ✅ อ่าน URL Param เพื่อ set category อัตโนมัติ
        const paramSlug = searchParams.get("category");
        if (paramSlug) {
          const matchedCat = availableCategories.find(c => c.slug === paramSlug);
          if (matchedCat) {
            setCategory(matchedCat.name);
          }
        }

      } catch (err) {
        console.error("Data Load Error:", err);
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อข้อมูล");
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, [apiBaseUrl, searchParams]);

  // --------------------------------------------------------------------------
  // 🔍 Client-side Filtering Logic
  // --------------------------------------------------------------------------
  const categoryOptions = useMemo(() => {
    const names = dbCategories.map(c => c.name);
    return ["ทั้งหมด", ...names];
  }, [dbCategories]);

  const filtered = useMemo(() => {
    let list = [...products];

    // ✅ ป้องกันซ้ำ (เผื่อข้อมูลใน state มีสินค้าที่ inactive ติดมาภายหลัง)
    list = list.filter(p => p.is_active !== 0);

    // Search
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        return name.includes(q) || cat.includes(q);
      });
    }

    // Category Filter
    if (category !== "ทั้งหมด") {
      list = list.filter((p) => p.category === category);
    }

    // Price
    list = list.filter((p) => (p.price || 0) <= maxPrice);

    // Sort
    switch (sortKey) {
      case "latest":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "popular":
      default:
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return list;
  }, [products, query, category, maxPrice, sortKey]);

  // --------------------------------------------------------------------------
  // 🎨 Render
  // --------------------------------------------------------------------------
  return (
    <section className="pt-28 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
            <p className="text-gray-500 mt-1">
              {subtitle} • พบ {filtered.length} รายการ
            </p>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาสินค้า..."
                className="w-full sm:w-64 rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
            >
              <option value="popular">ยอดนิยม</option>
              <option value="latest">ล่าสุด</option>
              <option value="price-asc">ราคา: ต่ำ → สูง</option>
              <option value="price-desc">ราคา: สูง → ต่ำ</option>
            </select>
          </div>
        </div>

        {/* Sidebar + Product List */}
        <div className="flex flex-col lg:flex-row gap-8">
          <ShopSidebar
            categories={categoryOptions}
            category={category}
            onCategoryChange={setCategory}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            maxPriceLimit={5000}
          />

          <main className="w-full lg:w-3/4">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100 p-4">
                    <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && error && (
              <div className="text-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm">
                <div className="text-red-500 font-medium mb-2 text-lg">⚠️ เกิดข้อผิดพลาด</div>
                <p className="text-gray-500 mb-6">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                >
                  ลองใหม่อีกครั้ง
                </button>
              </div>
            )}

            {!isLoading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onClick={() => setSelected(p)}
                    />
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="mt-10 text-center py-16 bg-white rounded-3xl border border-gray-100">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg font-medium">ไม่พบสินค้าที่ค้นหา</p>
                    <p className="text-gray-400 text-sm mt-2">ในหมวดหมู่: {category}</p>
                    <button 
                      onClick={() => {
                        setQuery("");
                        setCategory("ทั้งหมด");
                        setMaxPrice(5000);
                        window.history.pushState({}, '', '/shop');
                      }}
                      className="mt-6 text-emerald-600 font-semibold hover:underline"
                    >
                      ล้างตัวกรองทั้งหมด
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ✅ Modal แสดงรายละเอียดสินค้า */}
      {selected && (
        <Detail
          product={selected}
          onClose={() => setSelected(null)}
          onAddToCart={(qty) => onAddToCart?.(selected, qty)}
        />
      )}
    </section>
  );
}