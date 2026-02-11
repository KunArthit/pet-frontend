import React, { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Star, X, Check, ChevronDown } from "lucide-react";

// ✅ Import ข้อมูลจากไฟล์ JSON
import provincesData from "../../data/provinces.json"; 
import districtsData from "../../data/districts.json";
import subdistrictsData from "../../data/subdistricts.json";

const emptyAddress = () => ({
  id: null,
  recipientName: "",
  phone: "",
  addressLine: "",
  subdistrict: "",
  district: "",
  province: "",
  postalCode: "",
  isDefault: false, // ✅ เพิ่มสถานะ Default
});

export default function AddressBook({
  title,
  icon,
  toneColor,
  disabled = false,
  addresses = [],
  defaultId,
  onSave,
  onDelete,
  onSetDefault,
  sameAsLabel,
  sameAsChecked,
  onSameAsChange,
  sameAsPreview,
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyAddress());

  const openAdd = () => {
    setEditing(null);
    setDraft(emptyAddress());
    setOpen(true);
  };

  const openEdit = (addr) => {
    setEditing(addr);
    setDraft({
      id: addr.id,
      recipientName: addr.recipient_name,
      phone: addr.phone,
      addressLine: addr.address_line1,
      subdistrict: addr.sub_district,
      district: addr.district,
      province: addr.province,
      postalCode: addr.zip_code,
      isDefault: addr.id === defaultId || addr.is_default === 1,
    });
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
    setDraft(emptyAddress());
  };

  const handleSubmit = () => {
    // ✅ FIX: กรณีเลือก "ใช้ที่อยู่เดียวกัน" ให้ส่งข้อมูลกลับไปบันทึก
    if (typeof sameAsChecked === "boolean" && sameAsChecked) {
      if (!sameAsPreview) {
        alert("ไม่พบข้อมูลที่อยู่จัดส่งหลัก");
        return;
      }
      
      const finalData = {
        ...sameAsPreview,
        id: draft.id, // ใช้ ID เดิมถ้าเป็นการแก้ไข
        isDefault: draft.isDefault // ใช้ค่า checkbox ใน modal นี้
      };

      if (onSave) onSave(finalData);
      close();
      return;
    }

    // กรณีปกติ (กรอกเอง)
    if (
      !draft.recipientName ||
      !draft.phone ||
      !draft.addressLine ||
      !draft.province ||
      !draft.district ||
      !draft.subdistrict
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (onSave) onSave(draft);
    close();
  };

  return (
    <section
      className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${toneColor}20`, color: toneColor }}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{title}</h3>
            <p className="text-xs text-gray-500">จัดการรายการที่อยู่ของคุณ</p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition text-sm"
        >
          <Plus className="w-4 h-4" /> เพิ่ม
        </button>
      </div>

      {/* List */}
      <div className="space-y-3 flex-1">
        {addresses.length === 0 ? (
          <div className="p-8 rounded-xl bg-gray-50 text-sm text-gray-500 text-center border border-dashed border-gray-200">
            ยังไม่มีรายการที่อยู่
          </div>
        ) : (
          addresses.map((a) => {
            const isDefault = a.is_default === 1 || a.id === defaultId;
            return (
              <div
                key={a.id}
                className={`p-4 rounded-2xl border transition ${
                  isDefault
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-gray-100 bg-white hover:bg-gray-50/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-gray-900 truncate">
                        {a.recipient_name}
                      </p>
                      {isDefault && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          <Star className="w-3 h-3 fill-current" /> ค่าเริ่มต้น
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{a.phone}</p>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                      {a.address_line1}
                      <br />
                      {a.sub_district} {a.district} {a.province} {a.zip_code}
                    </p>

                    {!isDefault && (
                      <button
                        type="button"
                        onClick={() => onSetDefault && onSetDefault(a.id)}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-emerald-600 transition-colors"
                      >
                        <Star className="w-3 h-3" /> ตั้งเป็นค่าเริ่มต้น
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(a)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 transition"
                      title="แก้ไข"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete && onDelete(a.id)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-red-600 transition"
                      title="ลบ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                  {editing ? "Edit Address" : "New Address"}
                </p>
                <h4 className="text-xl font-extrabold text-gray-900">
                  {editing ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
                </h4>
              </div>
              <button
                type="button"
                onClick={close}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <AddressFormControlled
                value={draft}
                onChange={setDraft}
                disabled={!!sameAsChecked}
              />

              {/* ✅ Checkbox: ตั้งเป็นค่าเริ่มต้น */}
              {!sameAsChecked && (
                <div className="mt-4 flex items-center gap-3">
                  <div 
                    onClick={() => setDraft({ ...draft, isDefault: !draft.isDefault })}
                    className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition ${
                      draft.isDefault ? "bg-emerald-500 border-emerald-500" : "border-gray-300 bg-white"
                    }`}
                  >
                    {draft.isDefault && <Check size={14} className="text-white" />}
                  </div>
                  <label 
                    onClick={() => setDraft({ ...draft, isDefault: !draft.isDefault })}
                    className="text-sm text-gray-700 cursor-pointer select-none"
                  >
                    ตั้งเป็นที่อยู่เริ่มต้น
                  </label>
                </div>
              )}

              {/* Toggle: Same as shipping */}
              {typeof sameAsChecked === "boolean" && typeof onSameAsChange === "function" && (
                <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-100 transition-all hover:border-emerald-200 cursor-pointer"
                     onClick={() => onSameAsChange(!sameAsChecked)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                        sameAsChecked ? "bg-emerald-500 border-emerald-500" : "bg-white border-gray-300"
                    }`}>
                      {sameAsChecked && <Check size={16} className="text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{sameAsLabel}</p>
                      <p className="text-xs text-gray-500">ใช้ข้อมูลจากที่อยู่จัดส่งแทน</p>
                    </div>
                  </div>

                  {sameAsChecked && sameAsPreview && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-bold text-gray-400 mb-1">PREVIEW:</p>
                        <p className="text-sm font-bold text-gray-800">{sameAsPreview.recipientName}</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                            {sameAsPreview.addressLine} {sameAsPreview.subdistrict} {sameAsPreview.district} {sameAsPreview.province} {sameAsPreview.postalCode}
                        </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 bg-gray-50/50">
              <button
                type="button"
                onClick={close}
                className="px-5 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all"
                style={{ backgroundColor: toneColor }}
              >
                {typeof sameAsChecked === "boolean" && sameAsChecked ? "ยืนยันการใช้" : "บันทึกข้อมูล"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ✅ Logic Dropdown ที่แก้ Key แล้ว
function AddressFormControlled({ value, onChange, disabled = false }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });

  // 1. หา ID (Code) ของจังหวัด
  const selectedProvinceId = useMemo(() => {
    const p = provincesData.find((item) => item.provinceNameTh === value.province);
    return p ? p.provinceCode : null; 
  }, [value.province]);

  // 2. กรองอำเภอ
  const filteredDistricts = useMemo(() => {
    if (!selectedProvinceId) return [];
    return districtsData.filter((item) => item.provinceCode === selectedProvinceId);
  }, [selectedProvinceId]);

  // 3. หา ID (Code) ของอำเภอ
  const selectedDistrictId = useMemo(() => {
    const d = filteredDistricts.find((item) => item.districtNameTh === value.district);
    return d ? d.districtCode : null; 
  }, [value.district, filteredDistricts]);

  // 4. กรองตำบล
  const filteredSubdistricts = useMemo(() => {
    if (!selectedDistrictId) return [];
    return subdistrictsData.filter((item) => item.districtCode === selectedDistrictId);
  }, [selectedDistrictId]);

  const handleProvinceChange = (e) => {
    onChange({ ...value, province: e.target.value, district: "", subdistrict: "", postalCode: "" });
  };
  const handleDistrictChange = (e) => {
    onChange({ ...value, district: e.target.value, subdistrict: "", postalCode: "" });
  };
  const handleSubdistrictChange = (e) => {
    const newSubName = e.target.value;
    // หา Postal Code อัตโนมัติ
    const subObj = filteredSubdistricts.find((item) => item.subdistrictNameTh === newSubName);
    onChange({ ...value, subdistrict: newSubName, postalCode: subObj ? String(subObj.postalCode) : "" });
  };

  return (
    <div className={`space-y-4 ${disabled ? "opacity-50 pointer-events-none grayscale" : ""}`}>
      <div className="grid grid-cols-1 gap-4">
        <Field label="ชื่อ-นามสกุล ผู้รับ" value={value.recipientName} onChange={set("recipientName")} placeholder="เช่น สมชาย ใจดี" />
        <Field label="เบอร์โทรศัพท์" value={value.phone} onChange={set("phone")} placeholder="081-XXX-XXXX" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase ml-1">ที่อยู่ / อาคาร / หมู่บ้าน</label>
        <textarea rows="2" value={value.addressLine} onChange={set("addressLine")} placeholder="เลขที่บ้าน, ซอย, ถนน..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-none text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectField label="จังหวัด" value={value.province} onChange={handleProvinceChange} placeholder="เลือกจังหวัด">
          {provincesData.map((p) => <option key={p.id} value={p.provinceNameTh}>{p.provinceNameTh}</option>)}
        </SelectField>
        <SelectField label="เขต/อำเภอ" value={value.district} onChange={handleDistrictChange} placeholder="เลือกอำเภอ" disabled={!value.province}>
          {filteredDistricts.map((d) => <option key={d.id} value={d.districtNameTh}>{d.districtNameTh}</option>)}
        </SelectField>
        <SelectField label="แขวง/ตำบล" value={value.subdistrict} onChange={handleSubdistrictChange} placeholder="เลือกตำบล" disabled={!value.district}>
          {filteredSubdistricts.map((s) => <option key={s.id} value={s.subdistrictNameTh}>{s.subdistrictNameTh}</option>)}
        </SelectField>
        <Field label="รหัสไปรษณีย์" value={value.postalCode} onChange={set("postalCode")} placeholder="รอการเลือก..." />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder = "", readOnly = false }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly} className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-sm ${readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`} />
    </div>
  );
}

function SelectField({ label, value, onChange, children, placeholder = "เลือก...", disabled = false }) {
  return (
    <div className="space-y-1.5 relative">
      <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>
      <div className="relative">
        <select value={value} onChange={onChange} disabled={disabled} className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 appearance-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-sm ${!value ? "text-gray-400" : "text-gray-900"} ${disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""}`}>
          <option value="" disabled>{placeholder}</option>
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronDown size={16} /></div>
      </div>
    </div>
  );
}