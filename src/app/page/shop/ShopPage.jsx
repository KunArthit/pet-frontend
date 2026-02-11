import React from "react";
import ShopView from "@/components/shop/ShopView";
import { mockProducts } from "@/components/data/mockProducts";

export default function ShopPage() {
  return (
    <ShopView
      products={mockProducts}
      onAddToCart={(product, qty) => {
        console.log("add to cart", product, qty);
      }}
    />
  );
}
