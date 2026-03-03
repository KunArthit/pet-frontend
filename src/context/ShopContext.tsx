// import React, { createContext, useContext, useState } from "react";

// interface CartItem {
//   id: number;
//   name: string;
//   category: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface ShopContextType {
//   cartItems: CartItem[];
//   wishlistItems: any[];
//   addToCart: (product: Omit<CartItem, 'quantity'>) => void;
//   updateCartQuantity: (id: number, newQty: number) => void;
//   removeCartItem: (id: number) => void;
//   removeWishlist: (id: number) => void;
// }

// const ShopContext = createContext<ShopContextType | undefined>(undefined);

// export const useShop = () => useContext(ShopContext);

// export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cartItems, setCartItems] = useState([
//     {
//       id: 1,
//       name: "Royal Canin อาหารสุนัขโต พันธุ์เล็ก",
//       category: "อาหารสุนัข",
//       price: 850,
//       quantity: 1,
//       image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=300&q=80",
//     },
//     {
//       id: 2,
//       name: "คอนโดแมว 3 ชั้น พร้อมของเล่น",
//       category: "อุปกรณ์สัตว์เลี้ยง",
//       price: 1290,
//       quantity: 2,
//       image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=300&q=80",
//     }
//   ]);

//   const [wishlistItems, setWishlistItems] = useState([
//     {
//       id: 3,
//       name: "แชมพูสุนัขสูตรอ่อนโยน ลดอาการคัน",
//       category: "อาบน้ำและทำความสะอาด",
//       price: 350,
//       inStock: true,
//       image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=300&q=80",
//     },
//     {
//       id: 4,
//       name: "ขนมแมวเลีย Toro Toro รสปลาทูน่า",
//       category: "ขนมสัตว์เลี้ยง",
//       price: 120,
//       inStock: false,
//       image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80",
//     }
//   ]);

//   // ✅ เพิ่มฟังก์ชัน Add to Cart
//   const addToCart = (product: Omit<CartItem, 'quantity'>) => {
//     setCartItems((prev) => {
//       const existing = prev.find(item => item.id === product.id);
//       if (existing) {
//         // ถ้ามีอยู่แล้ว ให้บวก quantity เพิ่ม 1
//         return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
//       }
//       // ถ้ายังไม่มี ให้เพิ่มเข้าไปใหม่
//       return [...prev, { ...product, quantity: 1 }];
//     });
//   };

//   const updateCartQuantity = (id: number, newQty: number) => {
//     if (newQty < 1) return;
//     setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQty } : item));
//   };

//   const removeCartItem = (id: number) => {
//     setCartItems(cartItems.filter(item => item.id !== id));
//   };

//   const removeWishlist = (id: number) => {
//     setWishlistItems(wishlistItems.filter(item => item.id !== id));
//   };

//   return (
//     <ShopContext.Provider value={{
//       cartItems,
//       wishlistItems,
//       addToCart,           // ✅ ส่งออกไปให้หน้าอื่นใช้
//       updateCartQuantity,
//       removeCartItem,
//       removeWishlist
//     }}>
//       {children}
//     </ShopContext.Provider>
//   );
// };

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom"; // ✅ 1. นำเข้า useNavigate

// --- Interfaces ---
export interface CartItem {
  id: number;
  cartItemId: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  inStock?: boolean;
  stock: number;
}

interface ShopContextType {
  cartItems: CartItem[];
  wishlistItems: CartItem[];
  addToCart: (product: any) => Promise<boolean>; // ✅ เปลี่ยนเป็น Promise<boolean>
  updateCartQuantity: (productId: number, newQty: number) => Promise<void>;
  removeCartItem: (productId: number) => Promise<void>;
  toggleWishlist: (product: any) => Promise<boolean>; // ✅ เปลี่ยนเป็น Promise<boolean>
  removeWishlist: (productId: number) => Promise<void>;
  fetchData: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
};

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<CartItem[]>([]);
  const navigate = useNavigate(); // ✅ 2. เรียกใช้งาน navigate
  const debounceTimers = useRef<{ [key: number]: ReturnType<typeof setTimeout> }>({});

  const apiBaseUrl =
    import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

  const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setCartItems([]);
      setWishlistItems([]);
      return;
    }
    try {
      const cartRes = await fetch(`${apiBaseUrl}/carts`, {
        headers: getHeaders(),
      });
      const cartJson = await cartRes.json();
      if (cartJson.success) {
        const mappedCart = cartJson.data.map((item: any) => ({
          id: item.product_id,
          cartItemId: item.id,
          name: item.product_name || item.name,
          price: Number(item.product_price || item.price || 0),
          quantity: item.quantity,
          image: item.image_url || "https://placehold.co/300x300?text=No+Image",
          category: "สินค้า",
          stock: item.stock_quantity || item.stock || 99,
        }));
        setCartItems(mappedCart);
      }

      const wishRes = await fetch(`${apiBaseUrl}/wishlists`, {
        headers: getHeaders(),
      });
      const wishJson = await wishRes.json();
      if (wishJson.success) {
        const mappedWish = wishJson.data.map((item: any) => ({
          id: item.product_id,
          wishlistId: item.id,
          name: item.product_name || item.name,
          price: Number(item.product_price || item.price || 0),
          quantity: 1,
          image: item.image_url || "https://placehold.co/300x300?text=No+Image",
          category: "สินค้า",
          inStock: true,
          stock: item.stock_quantity || item.stock || 99,
        }));
        setWishlistItems(mappedWish);
      }
    } catch (error) {
      console.error("Failed to fetch cart/wishlist", error);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ 3. ดักจับถ้ายังไม่ Login ให้ Return False และเด้งไปหน้า Login
  const addToCart = async (product: any): Promise<boolean> => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนทำรายการ");
      navigate("/login"); // พุ่งไปหน้า Login
      return false; // ส่งสถานะกลับไปบอก UI ว่าทำงานไม่สำเร็จ
    }

    const qty = product.quantity || 1;
    const productStock = product.stock || product.stockQty || 99;

    let isOverStock = false;

    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        const nextQty = exists.quantity + qty;
        if (nextQty > productStock) {
          alert("ไม่สามารถเพิ่มสินค้าได้ เนื่องจากเกินจำนวนในสต๊อก");
          isOverStock = true;
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQty } : item,
        );
      }
      return [
        {
          id: product.id,
          cartItemId: 0,
          name: product.name,
          price: product.price,
          quantity: qty,
          image: product.image,
          category: product.category,
          stock: productStock,
        },
        ...prev,
      ];
    });

    if (isOverStock) return false;

    try {
      await fetch(`${apiBaseUrl}/carts`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ product_id: product.id, quantity: qty }),
      });
      fetchData();
      return true; // สำเร็จ
    } catch (error) {
      fetchData();
      return false;
    }
  };

  const updateCartQuantity = async (productId: number, newQty: number) => {
    if (newQty < 1) return;

    const item = cartItems.find((c) => c.id === productId);
    if (!item || !item.cartItemId) return;

    // เช็คตอนกดเพิ่ม/ลดในหน้าตะกร้า
    if (newQty > item.stock) {
      alert("ระบุจำนวนเกินสต๊อกที่มีอยู่");
      return;
    }

    // 1. อัปเดต UI ทันที (Optimistic Update) ให้ผู้ใช้เห็นตัวเลขเปลี่ยนปุ๊บปั๊บ
    setCartItems((prev) =>
      prev.map((c) => (c.id === productId ? { ...c, quantity: newQty } : c)),
    );

    // 2. เคลียร์ Timer ตัวเก่าทิ้ง ถ้าผู้ใช้กดรัวๆ
    if (debounceTimers.current[item.cartItemId]) {
      clearTimeout(debounceTimers.current[item.cartItemId]);
    }

    // 3. ตั้งเวลาใหม่ (หน่วง 500 มิลลิวินาที) ค่อยยิง API
    debounceTimers.current[item.cartItemId] = setTimeout(async () => {
      try {
        await fetch(`${apiBaseUrl}/carts/${item.cartItemId}/quantity`, {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ quantity: newQty }), // ส่งค่าล่าสุดไปอัปเดตครั้งเดียว
        });
      } catch (error) {
        // ถ้าพัง ให้โหลดข้อมูลที่ถูกต้องจาก DB กลับมาทับ
        fetchData();
      }
    }, 500); // 👈 ปรับตัวเลขตรงนี้ได้ (500ms = ครึ่งวินาที)
  };

  const removeCartItem = async (productId: number) => {
    const item = cartItems.find((c) => c.id === productId);
    if (!item || !item.cartItemId) return;
    setCartItems((prev) => prev.filter((c) => c.id !== productId));
    try {
      await fetch(`${apiBaseUrl}/carts/${item.cartItemId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
    } catch (error) {
      fetchData();
    }
  };

  // ✅ 4. ดักจับใน Wishlist ด้วย
  const toggleWishlist = async (product: any): Promise<boolean> => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนทำรายการ");
      navigate("/login");
      return false;
    }

    const existing = wishlistItems.find((w) => w.id === product.id);

    if (existing) {
      setWishlistItems((prev) => prev.filter((w) => w.id !== product.id));
      try {
        await fetch(`${apiBaseUrl}/wishlists/${(existing as any).wishlistId}`, {
          method: "DELETE",
          headers: getHeaders(),
        });
      } catch (error) {
        fetchData();
      }
    } else {
      setWishlistItems((prev) => [
        {
          id: product.id,
          cartItemId: 0,
          wishlistId: 0,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          category: product.category,
          stock: 99,
        },
        ...prev,
      ]);
      try {
        await fetch(`${apiBaseUrl}/wishlists`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ product_id: product.id }),
        });
        fetchData();
      } catch (error) {
        fetchData();
      }
    }
    return true;
  };

  const removeWishlist = async (productId: number) => {
    const item: any = wishlistItems.find((w) => w.id === productId);
    if (!item || !item.wishlistId) return;
    setWishlistItems((prev) => prev.filter((w) => w.id !== productId));
    try {
      await fetch(`${apiBaseUrl}/wishlists/${item.wishlistId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
    } catch (error) {
      fetchData();
    }
  };

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        updateCartQuantity,
        removeCartItem,
        toggleWishlist,
        removeWishlist,
        fetchData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
