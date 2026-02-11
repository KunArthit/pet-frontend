// hero.jsx
import React from "react";
import { ShoppingCart, ChevronDown } from "lucide-react";

export default function Hero({ switchPage }) {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Pets Banner"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-block p-2 px-4 bg-[#79A68F]/90 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6 tracking-wide uppercase">
          ยินดีต้อนรับสู่โลกของสัตว์เลี้ยง
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
          PET TERRAIN CO.,LTD
        </h1>

        <p className="text-xl md:text-2xl text-gray-100 font-light drop-shadow-md">
          Premium products for pets, including food
        </p>
        <p className="text-xl md:text-2xl text-gray-100 mb-5 font-light drop-shadow-md">
          and body care products.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => switchPage?.("shop")}
            className="bg-[#79A68F] hover:bg-[#5E8570] text-white py-4 px-10 rounded-full text-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-[#79A68F]/50 flex items-center gap-3 group font-hand font-normal tracking-wide"
          >
            <ShoppingCart className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            Shop Now
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/80">
        <ChevronDown className="w-8 h-8" />
      </div>
    </section>
  );
}
