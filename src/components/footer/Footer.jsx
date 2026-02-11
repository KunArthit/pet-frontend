import React from "react";
import { PawPrint, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer({
  onNavigate, // (pageKey) => void
  brandName = "PETTERAIN",
  description = "เราคือร้านค้าที่เข้าใจคนรักสัตว์ คัดสรรสินค้าคุณภาพเพื่อเพื่อนซี้สี่ขาของคุณ ให้เขามีความสุขและสุขภาพแข็งแรง",
  year = new Date().getFullYear(),
  companyLine = "Happy Paws Pet Shop. All rights reserved.",
}) {
  const go = (key) => {
    if (typeof onNavigate === "function") onNavigate(key);
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="h-6 w-6 text-[#79A68F]" />
              <span className="font-bold text-2xl">{brandName}</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {description}
            </p>

            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#79A68F] transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#79A68F] transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#79A68F] transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Menu */}
          <div>
            <h4 className="font-bold text-lg mb-4">เมนูลัด</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => go("home")}
                  className="hover:text-[#79A68F] transition text-left"
                >
                  หน้าแรก
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go("shop")}
                  className="hover:text-[#79A68F] transition text-left"
                >
                  สินค้าทั้งหมด
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go("about")}
                  className="hover:text-[#79A68F] transition text-left"
                >
                  เกี่ยวกับเรา
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-4">หมวดหมู่</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => go("shop")}
                  className="hover:text-[#79A68F] transition text-left"
                >
                  สุนัข
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go("shop")}
                  className="hover:text-[#79A68F] transition text-left"
                >
                  แมว
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go("shop")}
                  className="hover:text-[#79A68F] transition text-left"
                >
                  สัตว์เล็ก
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4">รับข่าวสาร</h4>
            <p className="text-gray-400 text-sm mb-4">
              รับส่วนลด 10% สำหรับการสั่งซื้อครั้งแรก
            </p>

            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                alert("ขอบคุณที่ติดตามข่าวสาร!");
              }}
            >
              <input
                type="email"
                placeholder="อีเมลของคุณ"
                className="bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#79A68F] border border-gray-700"
                required
              />
              <button
                type="submit"
                className="bg-[#79A68F] hover:bg-[#5E8570] text-white px-4 py-2 rounded font-semibold transition"
              >
                สมัครรับข่าวสาร
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            &copy; {year} {companyLine}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
