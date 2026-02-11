import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT // 👈 ตรวจสอบ Port ให้ตรง

// 1. ประกาศตัวแปร Global (อยู่นอก create) เพื่อใช้ล็อคคิว
let isRefreshing = false;
let failedQueue = [];

// ฟังก์ชันช่วยระบายคิว (เมื่อ Refresh เสร็จ หรือ พัง)
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: API_BASE_URL, // 👈 ตรวจสอบ Port ให้ตรง
  withCredentials: true, // สำคัญมาก! เพื่อส่ง Cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: แนบ Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: พระเอกของเรา
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // เงื่อนไข: เจอ 401 และยังไม่ได้ Retry (ป้องกัน Loop นรก)
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // 🛑 กรณี A: มีคนอื่นกำลัง Refresh อยู่ -> ให้ "เข้าคิวรอ" (ห้ามยิงเอง)
      if (isRefreshing) {
        console.log("⏳ ติด 401 ซ้ำ... กำลังเข้าคิวรอ Token ใหม่...");
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              // พอคิวหลุด -> เอา Token ใหม่แปะ Header แล้วยิง Request เดิมซ้ำ
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      // 🚩 กรณี B: เราเป็นคนแรกที่เจอ 401 -> รับบทผู้นำ ยิง Refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Access Token หมดอายุ... กำลัง Refresh (Leader)...");

        // ยิงไป Backend (แนบ Cookie ไปอัตโนมัติ)
        const rs = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = rs.data;

        // ✅ 1. เก็บ Token ใหม่
        localStorage.setItem("accessToken", accessToken);
        // (Optional) อัปเดต default header ของ axios instance
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        console.log("✅ Refresh สำเร็จ! ปล่อยคิวเพื่อนๆ...");

        // ✅ 2. ปล่อยคิวที่รออยู่ (แจก Token ใหม่ให้ทุกคน)
        processQueue(null, accessToken);

        // ✅ 3. ตัวเราเองก็ยิงซ้ำ
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (_error) {
        console.error("❌ Refresh ล้มเหลว (Session Expired):", _error);
        
        // 💥 ถ้า Refresh พัง -> บอกเพื่อนๆ ในคิวว่า "วงแตก! ตัวใครตัวมัน"
        processQueue(_error, null);

        // ล้างข้อมูลและดีดไป Login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        
        return Promise.reject(_error);
      } finally {
        // จบงานแล้ว ปลดล็อกเสมอ
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;