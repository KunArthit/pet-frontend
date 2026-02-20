// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("accessToken");

  if (!token || !storedUser) {
    // ❌ ถ้าไม่ได้ล็อกอิน → เด้งไปหน้า login
    return <Navigate to="/login" replace />;
  }

  try {
    const parsedUser = JSON.parse(storedUser);
    const userRole = parsedUser.role;

    if (allowedRoles.includes(userRole)) {
      // ✅ ผ่านเงื่อนไข role
      return children;
    } else {
      // ❌ ถ้า role ไม่ตรง → เด้งกลับหน้าหลัก
      return <Navigate to="/" replace />;
    }
  } catch (err) {
    console.error("Error parsing user data:", err);
    return <Navigate to="/login" replace />;
  }
}