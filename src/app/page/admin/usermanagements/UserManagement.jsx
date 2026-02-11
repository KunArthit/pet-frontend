import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  UserPlus, 
  Mail, 
  ShieldCheck, 
  UserX, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  UserCheck,
  ShieldAlert
} from "lucide-react";

const initialUsers = [
  { id: 1, name: "สมชาย รักสัตว์", email: "somchai@example.com", role: "Customer", status: "Active", joined: "2024-01-15" },
  { id: 2, name: "Admin Petterain", email: "admin@petterain.com", role: "Admin", status: "Active", joined: "2023-12-01" },
  { id: 3, name: "วิภาวดี แมวเหมียว", email: "viphawadee@test.com", role: "Customer", status: "Banned", joined: "2024-02-10" },
  { id: 4, name: "John Doe", email: "john.d@gmail.com", role: "Customer", status: "Pending", joined: "2024-03-05" },
];

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">จัดการสมาชิก</h2>
          <p className="text-slate-500 text-sm">ตรวจสอบสิทธิ์และสถานะการใช้งานของสมาชิกทั้งหมด</p>
        </div>
        <button 
        onClick={() => navigate("/admin/users/add")}
        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200">
          <UserPlus size={20} />
          เพิ่มพนักงาน
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UserStatCard icon={UserCheck} label="สมาชิกทั้งหมด" value={users.length} color="bg-indigo-50 text-indigo-600" />
        <UserStatCard icon={ShieldCheck} label="แอดมิน" value="2" color="bg-purple-50 text-purple-600" />
        <UserStatCard icon={CheckCircle2} label="ใช้งานปกติ" value="3" color="bg-emerald-50 text-emerald-600" />
        <UserStatCard icon={UserX} label="ถูกระงับ" value="1" color="bg-rose-50 text-rose-600" />
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="ค้นหาด้วยชื่อ หรือ อีเมล..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* User Table */}
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold border border-slate-200 uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Mail size={10} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role === "Admin" ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase">
                          <ShieldAlert size={12} /> Admin
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase">
                          Customer
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4">
                    <StatusIndicator status={user.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function UserStatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${color}`}><Icon size={22}/></div>
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function StatusIndicator({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Banned: "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${styles[status]}`}>
      {status === "Active" && "ใช้งานปกติ"}
      {status === "Pending" && "รอการยืนยัน"}
      {status === "Banned" && "ระงับการใช้งาน"}
    </span>
  );
}