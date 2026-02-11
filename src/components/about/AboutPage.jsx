// src/component/about/AboutPage.jsx
import React from "react";
import {
  CheckCircle,
  Heart,
  Leaf,
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    { title: "คุณภาพ (Quality)", desc: "คัดสรรสินค้าเกรดคุณภาพ ปลอดภัยต่อสัตว์เลี้ยง" },
    { title: "ความสุข (Happiness)", desc: "เราเชื่อว่าความสุขของน้องๆ คือความสุขของคุณ" },
    {
      title: "ความยั่งยืน (Sustainability)",
      desc: "สนับสนุนสินค้าที่เป็นมิตรต่อสิ่งแวดล้อมและยั่งยืน",
    },
  ];

  const highlights = [
    { icon: CheckCircle, label: "ของแท้ 100%" },
    { icon: Heart, label: "ใส่ใจทุกรายละเอียด" },
    { icon: Leaf, label: "ผลิตภัณฑ์ออร์แกนิค" },
    { icon: Users, label: "ชุมชนคนรักสัตว์" },
  ];

  return (
    <div className="pt-28 pb-16 min-h-screen bg-white animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#79A68F] font-bold tracking-wider uppercase text-sm mb-2 block">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            เกี่ยวกับ PETTERAIN
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            มากกว่าร้านขายของสัตว์เลี้ยง คือพื้นที่ที่เข้าใจความรักที่คุณมีต่อเพื่อนตัวน้อย
            เรามุ่งมั่นคัดสรรสิ่งที่ดีที่สุดเพื่อพวกเขา
          </p>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl group">
            <img
              src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80"
              alt="Team"
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              จุดเริ่มต้นเล็กๆ สู่ความตั้งใจที่ยิ่งใหญ่
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              PETTERAIN ก่อตั้งขึ้นในปี 2020 จากกลุ่มคนรักสัตว์ที่อยากให้ “การเลือกซื้อ”
              เป็นเรื่องง่ายและมั่นใจได้ เราจึงคัดสรรสินค้าคุณภาพ
              ตรวจสอบแหล่งที่มา และให้คำแนะนำอย่างจริงใจ
              เพื่อให้น้องๆ มีสุขภาพดีและมีความสุขทุกวัน
            </p>

            <div className="grid grid-cols-2 gap-6">
              {highlights.map((h, idx) => {
                const Icon = h.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="bg-[#79A68F]/10 p-2 rounded-full text-[#79A68F]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-900">{h.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-gray-50 rounded-3xl p-8 sm:p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              สิ่งที่เรายึดมั่น
            </h2>
            <p className="text-gray-500">
              แนวคิดหลักที่ทำให้เราเลือกสิ่งที่ดีที่สุดให้เพื่อนสี่ขาของคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition text-center"
              >
                <div className="w-16 h-16 bg-[#9BC2AE]/30 rounded-full flex items-center justify-center text-[#79A68F] mx-auto mb-6">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">ติดต่อเรา</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm text-[#79A68F]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">ที่อยู่ร้าน</h4>
                  <p className="text-gray-500 text-sm">
                    123 ถนนสุขุมวิท, กรุงเทพฯ 10110
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm text-[#79A68F]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">โทรศัพท์</h4>
                  <p className="text-gray-500 text-sm">02-123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm text-[#79A68F]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">อีเมล</h4>
                  <p className="text-gray-500 text-sm">hello@petterain.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[400px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg relative">
            <img
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1200&q=80"
              className="w-full h-full object-cover filter grayscale opacity-70"
              alt="Map"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
                <MapPin className="w-5 h-5 text-[#79A68F] fill-current" />
                <span className="font-bold text-gray-800">PETTERAIN HQ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
