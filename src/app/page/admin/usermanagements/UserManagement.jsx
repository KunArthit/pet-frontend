import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  UserPlus,
  Mail,
  ShieldCheck,
  UserX,
  CheckCircle2,
  UserCheck,
  ShieldAlert,
  Edit3,
  Trash2,
  Crown,
} from "lucide-react";

const apiEndpoint =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ โหลด currentUser จาก localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  // ✅ โหลดข้อมูลจาก API
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${apiEndpoint}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }); 
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.users || data.data || [];
      setUsers(list);
      console.log("🧩 First user data:", list[0]);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ filter users
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // ✅ บันทึกการแก้ไข
  const handleSaveEdit = async () => {
    if (!editingUser) return;
    const userId = editingUser.id;
    
    try {
      const res = await fetch(`${apiEndpoint}/users/${editingUser.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          username: editingUser.username,
          email: editingUser.email,
          phone: editingUser.phone,
          is_active: editingUser.is_active,
          role: editingUser.role,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("ไม่สามารถแก้ไขข้อมูลได้");
    }
  };

  // ✅ ลบผู้ใช้
  const handleDelete = async (user) => {
    try {
      const res = await fetch(`${apiEndpoint}/users/${user.user_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchUsers();
      setConfirmDelete(null);
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("ลบผู้ใช้ไม่สำเร็จ");
    }
  };

  // ✅ ตรวจสิทธิ์
  const canManage = (targetUser) => {
    if (!currentUser) return false;
    if (currentUser.role === "super_admin") return true;
    if (currentUser.role === "admin" && targetUser.role === "user") return true;
    return currentUser.user_id === targetUser.user_id;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">จัดการสมาชิก</h2>
          <p className="text-slate-500 text-sm">
            ตรวจสอบสิทธิ์และสถานะการใช้งานของสมาชิกทั้งหมด
          </p>
        </div>
        {(currentUser?.role === "admin" || currentUser?.role === "super_admin") && (
          <button
            onClick={() => navigate("/admin/users/add")}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
          >
            <UserPlus size={20} />
            เพิ่มพนักงาน
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UserStatCard
          icon={UserCheck}
          label="สมาชิกทั้งหมด"
          value={users.length}
          color="bg-indigo-50 text-indigo-600"
        />
        <UserStatCard
          icon={ShieldCheck}
          label="Admin"
          value={users.filter((u) => u.role === "admin").length}
          color="bg-purple-50 text-purple-600"
        />
        <UserStatCard
          icon={Crown}
          label="Super Admin"
          value={users.filter((u) => u.role === "super_admin").length}
          color="bg-amber-50 text-amber-600"
        />
        <UserStatCard
          icon={UserX}
          label="ถูกระงับ"
          value={users.filter((u) => u.is_active === 0).length}
          color="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อ หรือ อีเมล..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">ข้อมูลสมาชิก</th>
                <th className="px-6 py-4">ระดับสิทธิ์ (Role)</th>
                <th className="px-6 py-4">วันที่เข้าร่วม</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-400">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-400">
                    ไม่พบข้อมูลผู้ใช้
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.user_id}
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold border border-slate-200 uppercase">
                          {user.username?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">
                            {user.username}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail size={10} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {new Date(user.created_at).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-6 py-4">
                      <StatusIndicator
                        status={user.is_active === 1 ? "Active" : "Banned"}
                      />
                    </td>

                    {/* ✅ ปุ่มจัดการ */}
                    <td className="px-6 py-4 text-center">
                      {canManage(user) && (
                        <div className="flex justify-center gap-2">
                          {/* ปากกาสีเขียว */}
                          <button
                            onClick={() => setEditingUser({ ...user })}
                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"
                            title="แก้ไข"
                          >
                            <Edit3 size={16} />
                          </button>

                          {/* ถังขยะสีแดง */}
                          <button
                            onClick={() => setConfirmDelete(user)}
                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
                            title="ลบ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: แก้ไข */}
      {editingUser && (
        <EditModal
          user={editingUser}
          setUser={setEditingUser}
          onSave={handleSaveEdit}
          onClose={() => setEditingUser(null)}
          currentUser={currentUser}
        />
      )}

      {/* Modal: ลบ */}
      {confirmDelete && (
        <DeleteModal
          user={confirmDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete)}
        />
      )}
    </div>
  );
}

/* ---------- SUB COMPONENTS ---------- */

function RoleBadge({ role }) {
  const styles = {
    user: "bg-slate-100 text-slate-600",
    admin: "bg-purple-50 text-purple-600",
    super_admin: "bg-amber-50 text-amber-600",
  };
  const label = {
    user: "User",
    admin: "Admin",
    super_admin: "Super Admin",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
        styles[role] || styles.user
      }`}
    >
      {role === "super_admin" && (
        <Crown size={12} className="inline mr-1" />
      )}
      {label[role] || "User"}
    </span>
  );
}

function StatusIndicator({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Banned: "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
        styles[status]
      }`}
    >
      {status === "Active" ? "ใช้งานปกติ" : "ระงับการใช้งาน"}
    </span>
  );
}

function EditModal({ user, setUser, onSave, onClose, currentUser }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
        <h3 className="font-bold text-lg mb-3">แก้ไขข้อมูลสมาชิก</h3>
        <input
          className="w-full mb-2 border rounded-lg p-2"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
        <input
          className="w-full mb-2 border rounded-lg p-2"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <select
          className="w-full mb-2 border rounded-lg p-2"
          value={user.is_active}
          onChange={(e) =>
            setUser({ ...user, is_active: Number(e.target.value) })
          }
        >
          <option value={1}>ใช้งาน</option>
          <option value={0}>ระงับ</option>
        </select>

        {currentUser?.role === "super_admin" && (
          <select
            className="w-full mb-2 border rounded-lg p-2"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="super_admin" disabled>
              Super Admin
            </option>
          </select>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600"
          >
            ยกเลิก
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ user, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
        <h3 className="font-bold text-lg mb-4 text-rose-600">
          ยืนยันการลบผู้ใช้
        </h3>
        <p className="text-slate-600 mb-4">
          ต้องการลบ "{user.username}" ใช่หรือไม่?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white font-bold"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
}

function UserStatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}