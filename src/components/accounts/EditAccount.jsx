import React, { useState, useEffect } from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.jsx";

const BRAND = { primary: "#79A68F", accent: "#A0D9F0" };

const EditAccount = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    description: "",
  });
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", phone: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const apiBaseUrl = import.meta.env.VITE_API_ENDPOINT;

  const showDialog = (title, description) => {
    setDialog({ open: true, title, description });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token");

        const response = await fetch(`${apiBaseUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch");

        const result = await response.json();
        if (result.success) {
          const u = result.user;
          setUser(u);
          setFormData({ username: u.username || "", phone: u.phone || "" });
        }
      } catch (error) {
        console.error("Load user error:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [apiBaseUrl, navigate]);

  const handleProfileChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!user) return;
    setIsSaving(true);
    const token = localStorage.getItem("accessToken");

    try {
      if (formData.username !== user.username || formData.phone !== user.phone) {
        const resProfile = await fetch(`${apiBaseUrl}/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: formData.username,
            phone: formData.phone,
          }),
        });
        const resJson = await resProfile.json();
        if (!resProfile.ok)
          throw new Error(resJson.message || "Failed to update profile");
      }

      if (passwordData.newPassword) {
        if (!passwordData.oldPassword || passwordData.oldPassword.length < 6) {
          showDialog("กรุณากรอกข้อมูลให้ครบ", "กรุณากรอกรหัสผ่านปัจจุบันให้ถูกต้อง (อย่างน้อย 6 ตัวอักษร)");
          setIsSaving(false);
          return;
        }
        if (passwordData.newPassword.length < 6) {
          showDialog("รหัสผ่านสั้นเกินไป", "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
          setIsSaving(false);
          return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          showDialog("รหัสผ่านไม่ตรงกัน", "กรุณากรอกรหัสผ่านใหม่ให้ตรงกันทั้งสองช่อง");
          setIsSaving(false);
          return;
        }

        const resPass = await fetch(`${apiBaseUrl}/users/${user.id}/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        });

        const passJson = await resPass.json();
        if (!resPass.ok)
          throw new Error(passJson.message || "Failed to update password");
      }

      showDialog("บันทึกสำเร็จ", "ข้อมูลของคุณได้รับการอัปเดตเรียบร้อยแล้ว");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Update error:", error);
      showDialog("เกิดข้อผิดพลาด", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  const avatarUrl =
    user?.image_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
          แก้ไขข้อมูลส่วนตัว
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="relative group">
              <div
                className="w-32 h-32 rounded-full overflow-hidden border-4"
                style={{ borderColor: BRAND.accent }}
              >
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                className="absolute bottom-1 right-1 p-2 rounded-full bg-white shadow-lg border border-gray-100 text-gray-600 hover:text-[#79A68F]"
                onClick={() => showDialog("ยังไม่พร้อมใช้งาน", "ฟีเจอร์อัปโหลดรูปจะเปิดใช้ในอนาคต")}
              >
                <Camera size={18} />
              </button>
            </div>
            <div className="text-center mt-4">
              <h3 className="font-semibold text-gray-800">{user?.username}</h3>
              <p className="text-xs text-gray-400 uppercase mt-1">
                {user?.role || "สมาชิกทั่วไป"}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-700 mb-6 flex items-center gap-2">
                <User size={18} style={{ color: BRAND.primary }} /> ข้อมูลทั่วไป
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="ชื่อผู้ใช้"
                  name="username"
                  icon={<User size={16} />}
                  value={formData.username}
                  onChange={handleProfileChange}
                />
                <InputField label="อีเมล" icon={<Mail size={16} />} value={user?.email || ""} disabled />
                <InputField
                  label="เบอร์โทรศัพท์"
                  name="phone"
                  icon={<Phone size={16} />}
                  value={formData.phone}
                  onChange={handleProfileChange}
                />
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-700 mb-6 flex items-center gap-2">
                <Lock size={18} style={{ color: BRAND.accent }} /> เปลี่ยนรหัสผ่าน
              </h4>

              <div className="space-y-4">
                <InputField
                  label="รหัสผ่านปัจจุบัน"
                  name="oldPassword"
                  type={showPassword ? "text" : "password"}
                  icon={<Lock size={16} />}
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <InputField
                      label="รหัสผ่านใหม่"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="อย่างน้อย 6 ตัวอักษร"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <InputField
                    label="ยืนยันรหัสผ่านใหม่"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-xl text-gray-500 font-semibold hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-8 py-2.5 rounded-xl text-white font-semibold shadow-md hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: BRAND.primary }}
              >
                {isSaving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <AlertDialog open={dialog.open} onOpenChange={(open) => setDialog({ ...dialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialog({ ...dialog, open: false })}>
              ตกลง
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Helper input
const InputField = ({ label, name, icon, type = "text", value, onChange, placeholder, disabled = false }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-600 ml-1">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full py-2.5 rounded-xl border ${
          icon ? "pl-10" : "pl-4"
        } pr-4 transition-all outline-none text-gray-700 ${
          disabled
            ? "bg-gray-50 cursor-not-allowed border-gray-200 text-gray-500"
            : "border-gray-200 focus:border-[#A0D9F0] focus:ring-2 focus:ring-[#A0D9F020]"
        }`}
      />
    </div>
  </div>
);

export default EditAccount;