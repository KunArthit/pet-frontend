// src/App.jsx
import "./App.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "./app/page/home/Home";
import DashBoard from "@/components/home/DashBoard";
import Error from "./app/page/error/Error";
import AboutPage from "@/components/about/AboutPage";
import CategoryPage from "./app/page/category/CategoryPage";
import LoginPage from "./app/page/auth/Login";
import RegisterPage from "./app/page/auth/Register";
import ForgotPassword from "./app/page/auth/ForgotPassword";
import ResetPassword from "./app/page/auth/ResetPassword";
import VerifyEmail from "./app/page/auth/VerifyEmail";
import ShopPage from "./app/page/shop/ShopPage";
import MyAccountPage from "./app/page/accounts/MyAccountPage";
import OrderHistory from "./components/accounts/OrderHistory";
import EditAccount from "./components/accounts/EditAccount";
import AddressEdit from "./components/accounts/AddressEdit";
import OrderDetail from "./components/order/OrderDetail";
import AdminLayout from "./app/page/admin/AdminLayout";
import AdminDashboard from "./app/page/admin/Dashboard";
import ProductManagement from "./app/page/admin/products/ProductManagement";
import AddProduct from "./app/page/admin/products/AddProduct";
import OrderManagement from "./app/page/admin/orders/OrderManagement";
import OrderDetailAdmin from "./app/page/admin/orders/OrderDetail";
import UserManagement from "./app/page/admin/usermanagements/UserManagement";
import UserCreate from "./app/page/admin/usermanagements/UserCreate";
import InvoiceManagement from "./app/page/admin/invoices/InvoiceManagement";
import InvoiceDetail from "./app/page/admin/invoices/InvoiceDetail";
import CategoryManagement from "./app/page/admin/categorys/CategoryManagement";
import CreateCategory from "./app/page/admin/categorys/CreateCategory";
import QuotationManagement from "./app/page/admin/quotations/QuotationManagement";
import QuotationDetail from "./app/page/admin/quotations/QuotationDetail";
import QuotationCreate from "./app/page/admin/quotations/QuotationCreate";
import PaymentManagement from "./app/page/admin/payments/PaymentManagement";
import PaymentDetail from "./app/page/admin/payments/PaymentDetail";
import Setting from "./app/page/admin/Setting";


// ฟังก์ชันเช็ค Token
const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  return token !== null && token !== "" && token !== "undefined";
};

// ✅ สร้าง Component สำหรับป้องกันหน้า (Protected Route)
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ✅ สร้าง Component สำหรับป้องกันหน้า Login (ถ้า Login แล้วห้ามเข้า)
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const routers = createBrowserRouter([
  // กลุ่ม Auth (ใช้ PublicRoute ครอบ ถ้า Login แล้วจะเด้งไปหน้าแรก)
  {
    path: "/login",
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: "/register",
    element: <PublicRoute><RegisterPage /></PublicRoute>,
  },
  {
    path: "/forgot-password",
    element: <PublicRoute><ForgotPassword /></PublicRoute>,
  },
  {
    path: "/reset-password",
    element: <PublicRoute><ResetPassword /></PublicRoute>,
  },
  {
    path: "/verify-email",
    element: <PublicRoute><VerifyEmail /></PublicRoute>,
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "products", element: <ProductManagement /> },
      { path: "products/add", element: <AddProduct /> },
      { path: "orders", element: <OrderManagement /> },
      { path: "orders/:id", element: <OrderDetailAdmin /> },
      { path: "users", element: <UserManagement /> },
      { path: "users/add", element: <UserCreate /> },
      { path: "invoices", element: <InvoiceManagement /> },
      { path: "invoices/:id", element: <InvoiceDetail /> },
      { path: "categories", element: <CategoryManagement /> },
      { path: "categories/add", element: <CreateCategory /> },
      { path: "quotations", element: <QuotationManagement /> },
      { path: "quotations/add", element: <QuotationCreate /> },
      { path: "quotations/:id", element: <QuotationDetail /> },
      { path: "payments", element: <PaymentManagement /> },
      { path: "payments/:id", element: <PaymentDetail /> },
      { path: "settings", element: <Setting /> },
    ],
  },

  // ✅ กลุ่มหน้าหลัก (ปลดล็อคให้เข้าได้ทุกคน)
  {
    path: "/",
    element: <Home />, // Home เข้าได้เสมอ
    errorElement: <Error />,
    children: [
      { index: true, element: <DashBoard /> },
      { path: "shop", element: <ShopPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "categories", element: <CategoryPage /> },      
      // 🔒 กลุ่ม My Account (ต้อง Login เท่านั้น)
      { 
        path: "my-account", 
        element: <ProtectedRoute><MyAccountPage /></ProtectedRoute> 
      },
      { 
        path: "my-account/orders", 
        element: <ProtectedRoute><OrderHistory /></ProtectedRoute> 
      },
      { 
        path: "my-account/edit", 
        element: <ProtectedRoute><EditAccount /></ProtectedRoute> 
      },
      { 
        path: "my-account/address-edit", 
        element: <ProtectedRoute><AddressEdit /></ProtectedRoute> 
      },
      { 
        path: "my-account/orders/:orderId", 
        element: <ProtectedRoute><OrderDetail /></ProtectedRoute> 
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={routers} />;
}

export default App;