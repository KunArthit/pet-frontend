// src/pages/admin/Dashboard.jsx
import React from "react";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

// ข้อมูลจำลองสำหรับกราฟเส้น (ยอดขาย 7 วัน)
const salesData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 5000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 1890 },
  { name: "Sat", sales: 2390 },
  { name: "Sun", sales: 3490 },
];

// ข้อมูลจำลองสำหรับกราฟแท่ง (หมวดหมู่สินค้าขายดี)
const categoryData = [
  { name: "อาหารสุนัข", value: 400 },
  { name: "อาหารแมว", value: 300 },
  { name: "ของเล่น", value: 200 },
  { name: "อุปกรณ์", value: 278 },
];

const COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* --- Section 1: Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="รายได้รวมวันนี้" 
          value="฿12,450" 
          icon={DollarSign} 
          trend="+12.5%" 
          trendUp={true} 
          color="bg-emerald-500"
        />
        <StatCard 
          title="คำสั่งซื้อใหม่" 
          value="48" 
          icon={ShoppingBag} 
          trend="+5.2%" 
          trendUp={true} 
          color="bg-indigo-500"
        />
        <StatCard 
          title="ลูกค้าใหม่" 
          value="12" 
          icon={Users} 
          trend="-2.1%" 
          trendUp={false} 
          color="bg-purple-500"
        />
        <StatCard 
          title="อัตราการซื้อ" 
          value="3.2%" 
          icon={TrendingUp} 
          trend="+0.8%" 
          trendUp={true} 
          color="bg-amber-500"
        />
      </div>

      {/* --- Section 2: Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* กราฟยอดขาย (กว้าง 2 ส่วน) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">แนวโน้มยอดขาย (7 วันล่าสุด)</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg p-1 px-2 text-slate-500 outline-none">
              <option>สัปดาห์นี้</option>
              <option>สัปดาห์ที่แล้ว</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* กราฟแท่งหมวดหมู่ (กว้าง 1 ส่วน) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6">หมวดหมู่ยอดนิยม</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={80} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
             {categoryData.map((item, i) => (
               <div key={i} className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                   <span className="text-slate-500">{item.name}</span>
                 </div>
                 <span className="font-bold text-slate-700">{item.value} ชิ้น</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* --- Section 3: Recent Orders Table --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">คำสั่งซื้อล่าสุด</h3>
          <button className="text-indigo-600 text-sm font-semibold hover:underline">ดูทั้งหมด</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">ลูกค้า</th>
                <th className="px-6 py-4 font-semibold">สถานะ</th>
                <th className="px-6 py-4 font-semibold">ยอดรวม</th>
                <th className="px-6 py-4 font-semibold">เวลา</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { id: "#ORD-7721", user: "สมชาย รักสัตว์", status: "สำเร็จ", price: "฿1,200", time: "2 นาทีที่แล้ว" },
                { id: "#ORD-7722", user: "วิภาวดี แมวเหมียว", status: "รอดำเนินการ", price: "฿450", time: "15 นาทีที่แล้ว" },
                { id: "#ORD-7723", user: "John Doe", status: "จัดส่งแล้ว", price: "฿2,890", time: "1 ชม. ที่แล้ว" },
              ].map((order, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.user}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === "สำเร็จ" ? "bg-emerald-100 text-emerald-600" :
                      order.status === "รอดำเนินการ" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{order.price}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Sub-component สำหรับ Stat Card
function StatCard({ title, value, icon: Icon, trend, trendUp, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${color} text-white shadow-lg shadow-inherit/20`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? "text-emerald-500" : "text-rose-500"}`}>
          {trend}
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-slate-400 text-sm font-medium">{title}</h4>
        <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
      </div>
    </div>
  );
}