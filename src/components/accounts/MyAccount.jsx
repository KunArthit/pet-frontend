import React, { useMemo, useState, useEffect } from "react";
import { Package, Pencil, Loader, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const BRAND = { primary: "#79A68F", accent: "#A0D9F0" };

const MyAccountDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/users/me");
        const data = response.data;

        if (data.success) {
          setUser({
            name: data.user.username || data.user.first_name || "User",
            email: data.user.email,
            phone: data.user.phone || "-",
            role: data.user.role || "member",
            avatar:
              data.user.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.username}`,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const stats = useMemo(
    () => [
      {
        label: "คำสั่งซื้อทั้งหมด",
        value: "0",
        icon: <Package size={20} />,
        color: BRAND.accent,
        sub: "ประวัติการสั่งซื้อของคุณ",
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <div className="text-gray-400">
          <Package size={48} />
        </div>
        <h2 className="text-xl font-bold text-gray-700">
          ไม่สามารถโหลดข้อมูลผู้ใช้ได้
        </h2>
        <p className="text-gray-500">กรุณาเข้าสู่ระบบใหม่อีกครั้ง</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          ไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      <div className="flex min-h-screen">
        <main className="flex-1">
          <div className="max-w-6xl mx-auto p-5 sm:p-8">
            {/* Header */}
            <header className="hidden md:flex justify-between items-center mb-8">
              <div>
                <p className="text-xs text-gray-500">แดชบอร์ด</p>
                <h1 className="text-3xl font-extrabold text-gray-900">
                  ยินดีต้อนรับกลับมา,{" "}
                  <span style={{ color: BRAND.primary }}>{user.name}</span> 👋
                </h1>
                <p className="text-gray-500 mt-1">
                  จัดการข้อมูลส่วนตัว และตรวจสอบสถานะคำสั่งซื้อของคุณได้ที่นี่
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/my-account/edit")}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 border border-gray-200 hover:bg-gray-50 transition text-sm font-bold"
                  style={{ color: BRAND.primary }}
                >
                  <Pencil size={16} />
                  แก้ไขข้อมูล
                </button>

                {/* <button
                  type="button"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 transition text-sm font-bold"
                >
                  <LogOut size={16} />
                  ออกจากระบบ
                </button> */}
              </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <div
                    className="h-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${stat.color}, ${BRAND.accent})`,
                    }}
                  />
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-4xl font-extrabold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">{stat.sub}</p>
                    </div>
                    <div
                      className="p-3 rounded-2xl border border-gray-100 group-hover:scale-[1.03] transition"
                      style={{
                        backgroundColor: `${stat.color}18`,
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-extrabold text-gray-900">
                  ข้อมูลส่วนตัวเบื้องต้น
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  ตรวจสอบข้อมูลของคุณให้ถูกต้อง เพื่อความสะดวกในการจัดส่ง
                </p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoItem label="ชื่อผู้ใช้งาน" value={user.name} />
                <InfoItem label="อีเมล" value={user.email} />
                <InfoItem label="เบอร์โทรศัพท์" value={user.phone} />
                <InfoItem label="สถานะสมาชิก" value={user.role} badge />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, badge = false }) => (
  <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-5">
    <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
    {badge ? (
      <div className="mt-2">
        <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
          {value}
        </span>
      </div>
    ) : (
      <p className="text-gray-900 font-bold mt-2">{value || "-"}</p>
    )}
  </div>
);

export default MyAccountDashboard;