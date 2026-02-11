/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "./Banner";
import Category from "./Category";
import HotProduct from "./HotProduct";

function DashBoard() {
  const navigate = useNavigate();

  // --- State ---
  const [categories, setCategories] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // API Endpoint
  const apiBaseUrl = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // ดึง Categories และ Products พร้อมกัน
        // หมายเหตุ: Products ดึงมาแค่ 4 ตัวพอ (Limit จาก Server เลยเพื่อความไว)
        const [catRes, prodRes] = await Promise.all([
          fetch(`${apiBaseUrl}/categories`),
          fetch(`${apiBaseUrl}/products?limit=4`) 
        ]);

        const catResult = await catRes.json();
        const prodResult = await prodRes.json();

        // 1. จัดการ Categories
        if (catResult.success) {
          const mappedCats = catResult.data.map((c) => ({
            key: c.slug,
            label: c.name,
            image: c.image_url || "https://placehold.co/400x400?text=No+Image",
            slug: c.slug,
          }));
          // ✅ ตัดให้เหลือแค่ 4 ตัวแรก
          setCategories(mappedCats.slice(0, 4));
        }

        // 2. จัดการ Hot Products
        if (prodResult.success) {
          const mappedProds = prodResult.data.map((p) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            image: p.image_url || "https://placehold.co/300x300?text=No+Image",
            rating: 4.5,
            sold: p.stock_quantity > 0 ? 100 : 0,
          }));
          // ✅ ตัดให้เหลือแค่ 4 ตัวแรก (กันเหนียว เผื่อ API ส่งมาเกิน)
          setHotProducts(mappedProds.slice(0, 4));
        }

      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiBaseUrl]);

  const handleCategorySelect = (cat) => {
    navigate(`/shop?category=${encodeURIComponent(cat.slug)}`);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="-mt-20">
        <Banner switchPage={(page) => navigate(`/${page}`)} />
      </div>

      {/* ✅ ส่งไปแค่ 4 ตัว (ตัดมาแล้วใน State) */}
      <Category 
        categories={categories} 
        onSelect={handleCategorySelect}
      />
      
      {/* เพิ่มปุ่มดูหมวดหมู่ทั้งหมด */}
      <div className="text-center -mt-8 mb-12">
        <button 
            onClick={() => {
                navigate("/categories");
                window.scrollTo(0, 0);
            }}
            className="text-[#79A68F] font-semibold hover:underline text-lg transition-colors hover:text-[#5E8570]"
        >
            ดูหมวดหมู่ทั้งหมด
        </button>
      </div>

      {/* ✅ ส่งไปแค่ 4 ตัว */}
      <HotProduct
        products={hotProducts}
        onViewAll={() => {
            navigate("/shop");
            window.scrollTo(0, 0);
        }}
        onProductClick={(product) => {
           // ตัวอย่าง: ไปหน้ารายละเอียดสินค้า (ถ้าทำไว้)
           // navigate(`/shop/${product.id}`); 
           console.log("Click:", product);
        }}
      />
    </>
  );
}

export default DashBoard;