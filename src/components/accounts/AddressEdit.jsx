/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { MapPin, Receipt, RotateCcw, Loader } from "lucide-react";
import AddressBook from "./AddressBook";
import { useNavigate } from "react-router-dom";

const BRAND = { primary: "#79A68F", accent: "#A0D9F0" };

export default function EditAddress() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [shipAddresses, setShipAddresses] = useState([]);
  const [billAddresses, setBillAddresses] = useState([]);
  const [shipDefaultId, setShipDefaultId] = useState("");
  const [billDefaultId, setBillDefaultId] = useState("");
  const [isSameAddress, setIsSameAddress] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const userRes = await fetch(`${apiBaseUrl}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      if (userData.success) {
        setUser({
          name: userData.user.username,
          email: userData.user.email,
          avatar:
            userData.user.image_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.user.username}`,
        });
      }

      const addrRes = await fetch(`${apiBaseUrl}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const addrData = await addrRes.json();

      if (addrData.success) {
        const all = addrData.data;
        const ships = all.filter((a) => a.type === "shipping");
        setShipAddresses(ships);
        const defShip = ships.find((a) => a.is_default === 1);
        setShipDefaultId(defShip ? defShip.id : "");

        const bills = all.filter((a) => a.type === "billing");
        setBillAddresses(bills);
        const defBill = bills.find((a) => a.is_default === 1);
        setBillDefaultId(defBill ? defBill.id : "");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate, apiBaseUrl]);

  const handleSave = async (data, type) => {
    const token = localStorage.getItem("accessToken");
    const isEdit = !!data.id && String(data.id).length < 30;

    const payload = {
      recipient_name: data.recipientName,
      phone: data.phone,
      address_line1: data.addressLine,
      sub_district: data.subdistrict,
      district: data.district,
      province: data.province,
      zip_code: data.postalCode,
      type,
      is_default:
        (type === "shipping" && shipAddresses.length === 0) ||
        (type === "billing" && billAddresses.length === 0)
          ? 1
          : 0,
    };

    try {
      let res;
      if (isEdit) {
        res = await fetch(`${apiBaseUrl}/addresses/${data.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${apiBaseUrl}/addresses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Operation failed");

      await fetchData();
      alert(isEdit ? "แก้ไขที่อยู่สำเร็จ" : "เพิ่มที่อยู่สำเร็จ");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("ต้องการลบที่อยู่นี้ใช่ไหม?")) return;
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${apiBaseUrl}/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchData();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSetDefault = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${apiBaseUrl}/addresses/${id}/default`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Set default failed");
      await fetchData();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const shipDefault =
    shipAddresses.find((x) => x.id === shipDefaultId) ||
    shipAddresses[0] ||
    null;

  const shipDefaultPreview = shipDefault
    ? {
        label: "ที่อยู่จัดส่งหลัก",
        recipientName: shipDefault.recipient_name,
        phone: shipDefault.phone,
        addressLine: shipDefault.address_line1,
        subdistrict: shipDefault.sub_district,
        district: shipDefault.district,
        province: shipDefault.province,
        postalCode: shipDefault.zip_code,
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  // ✅ ไม่ใช้ AccountLayout อีกต่อไป
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">จัดการที่อยู่</h2>
            <p className="text-gray-500 text-sm">
              เพิ่มที่อยู่ได้หลายรายการ พร้อมแก้ไข/ลบ และเลือกค่าเริ่มต้น
            </p>
          </div>
          {/* <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            ออกจากระบบ
          </button> */}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AddressBook
            title="ที่อยู่จัดส่ง (Shipping)"
            icon={<MapPin size={22} />}
            toneColor={BRAND.accent}
            addresses={shipAddresses}
            defaultId={shipDefaultId}
            onSave={(data) => handleSave(data, "shipping")}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />

          <AddressBook
            title="ที่อยู่ออกใบเสร็จ (Billing)"
            icon={<Receipt size={22} />}
            toneColor={BRAND.primary}
            addresses={billAddresses}
            defaultId={billDefaultId}
            onSave={(data) => handleSave(data, "billing")}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
            sameAsLabel="ใช้ที่อยู่เดียวกันกับที่อยู่จัดส่ง"
            sameAsChecked={isSameAddress}
            onSameAsChange={setIsSameAddress}
            sameAsPreview={shipDefaultPreview}
          />
        </div>

        <div className="mt-8 flex justify-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <button
            type="button"
            onClick={fetchData}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={18} /> รีโหลดข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}