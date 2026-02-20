import React, { createContext, useContext, useState } from "react";

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShopContextType {
  cartItems: CartItem[];
  wishlistItems: any[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  updateCartQuantity: (id: number, newQty: number) => void;
  removeCartItem: (id: number) => void;
  removeWishlist: (id: number) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Royal Canin อาหารสุนัขโต พันธุ์เล็ก",
      category: "อาหารสุนัข",
      price: 850,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      name: "คอนโดแมว 3 ชั้น พร้อมของเล่น",
      category: "อุปกรณ์สัตว์เลี้ยง",
      price: 1290,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=300&q=80",
    }
  ]);

  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 3,
      name: "แชมพูสุนัขสูตรอ่อนโยน ลดอาการคัน",
      category: "อาบน้ำและทำความสะอาด",
      price: 350,
      inStock: true,
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 4,
      name: "ขนมแมวเลีย Toro Toro รสปลาทูน่า",
      category: "ขนมสัตว์เลี้ยง",
      price: 120,
      inStock: false,
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80",
    }
  ]);

  // ✅ เพิ่มฟังก์ชัน Add to Cart
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // ถ้ามีอยู่แล้ว ให้บวก quantity เพิ่ม 1
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      // ถ้ายังไม่มี ให้เพิ่มเข้าไปใหม่
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: number, newQty: number) => {
    if (newQty < 1) return;
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const removeCartItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const removeWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <ShopContext.Provider value={{
      cartItems,
      wishlistItems,
      addToCart,           // ✅ ส่งออกไปให้หน้าอื่นใช้
      updateCartQuantity,
      removeCartItem,
      removeWishlist
    }}>
      {children}
    </ShopContext.Provider>
  );
};