// src/component/category/Categories.jsx
import { useMemo, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Categories({
  shopPath = "/shop",
  title = "หมวดหมู่สินค้า",
  subtitle = "เลือกดูสินค้าตามประเภทสัตว์เลี้ยงที่คุณรัก...",
}) {
  const navigate = useNavigate();

  // 1. สร้าง State เก็บข้อมูลและสถานะการโหลด
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. กำหนด API Endpoint
  // ถ้า Backend ของคุณ Group route ไว้ที่ /api ก็ใช้ /api ตามนี้
  const apiEndpoint =
    import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

  // 3. ดึงข้อมูลจาก API เมื่อ Component โหลดเสร็จ
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/categories`);
        const result = await response.json();

        if (result.success) {
          // 4. แปลงข้อมูล (Map Data) จาก Backend ให้เข้ากับ UI
          const mappedData = result.data.map((cat) => ({
            label: cat.name, // Backend ส่ง name -> UI ใช้ label
            slug: cat.slug, // ตรงกัน
            // Backend ไม่มี description เราเลยสร้างข้อความอัตโนมัติแทน
            desc: cat.description || `รวมสินค้าคุณภาพสำหรับ${cat.name}`,
            // รูปภาพ ถ้าไม่มีจาก DB ให้ใช้รูป Placeholder
            image:
              cat.image_url ||
              "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
          }));

          setCategories(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [apiEndpoint]);

  // ส่วนของ Brands (ยังคง Hardcode ไว้ก่อน เพราะยังไม่มี API)
  const brands = useMemo(
    () => ["ROYAL CANIN", "PEDIGREE", "WHISKAS", "ME-O", "SMARTHEART"],
    [],
  );

  const goShop = (slug) => {
    // ส่ง slug ไป เช่น /shop?category=dog
    navigate(`${shopPath}?category=${encodeURIComponent(slug)}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="pt-28 pb-16 min-h-screen bg-white animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#79A68F] font-bold tracking-wider uppercase text-sm mb-2 block">
            Categories
          </span>
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* --- ส่วนแสดงผลหมวดหมู่ --- */}
        {isLoading ? (
          // ✅ แสดง Skeleton Loader ตอนกำลังโหลด
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-gray-100 animate-pulse border border-gray-200"
              />
            ))}
          </div>
        ) : (
          // ✅ แสดงข้อมูลจริงเมื่อโหลดเสร็จ
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => goShop(cat.slug)}
                  className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-lg text-left transition-all hover:shadow-xl"
                >
                  <img
                    src={cat.image}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={cat.label}
                    onError={(e) => {
                      // Fallback กรณีรูปโหลดไม่ได้
                      e.target.src =
                        "https://placehold.co/800x600?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {cat.label}
                    </h2>
                    <p className="text-gray-200 mb-4 text-sm">{cat.desc}</p>
                    <span className="inline-flex items-center text-white font-semibold bg-[#79A68F] px-4 py-2 rounded-full text-sm group-hover:bg-[#5E8570] transition">
                      ดูสินค้า <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-10">
                ยังไม่มีหมวดหมู่สินค้าในขณะนี้
              </div>
            )}
          </div>
        )}

        {/* --- ส่วน Brands (เหมือนเดิม) --- */}
        <div className="bg-gray-50 rounded-3xl p-10 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            แบรนด์ยอดนิยมที่เราไว้วางใจ
          </h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60">
            {brands.map((brand) => (
              <span
                key={brand}
                className="text-2xl font-bold text-gray-400 hover:text-[#79A68F] transition cursor-pointer"
                onClick={() => navigate(shopPath)}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
