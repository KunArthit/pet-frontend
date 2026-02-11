import React, { useEffect, useState } from "react";
import {
  MailCheck,
  RefreshCcw,
  LogIn,
  PawPrint,
  Heart,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  const apiEndpoint =
    import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

  const [status, setStatus] = useState("Verifying...");
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("pendingEmail") || "");

  // ✅ ตรวจสอบ token และสถานะ verified
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const emailFromStorage = localStorage.getItem("pendingEmail");

    if (!token && !emailFromStorage) {
      setStatus("❌ Invalid verification link.");
      setShowResend(true);
      setLoading(false);
      return;
    }

    // Step 1: พยายาม verify ด้วย token ก่อน
    fetch(`${apiEndpoint}/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();

        if (res.ok && data.success) {
          setIsVerified(true);
          setStatus("✅ Your email has been verified successfully!");
        } else {
          // Step 2: ถ้า token ใช้ไม่ได้ → ตรวจสอบใน DB ว่า verified แล้วไหม
          if (emailFromStorage) {
            try {
              const checkRes = await fetch(
                `${apiEndpoint}/users/check-verified?email=${emailFromStorage}`
              );
              const checkData = await checkRes.json();

              if (checkRes.ok && checkData.email_verified === 1) {
                setIsVerified(true);
                setStatus("✅ Your email has been verified successfully!");
              } else {
                setStatus("❌ Verification failed or token expired.");
                setShowResend(true);
              }
            } catch (err) {
              console.error("Check verified failed:", err);
              setStatus("❌ Verification failed or token expired.");
              setShowResend(true);
            }
          } else {
            setStatus("❌ Verification failed or token expired.");
            setShowResend(true);
          }
        }
      })
      .catch(() => {
        setStatus("❌ Server error. Please try again later.");
        setShowResend(true);
      })
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  // ✅ redirect อัตโนมัติหลัง verified
  useEffect(() => {
    if (isVerified) {
      const timer = setTimeout(() => {
        window.location.href = "/login";
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVerified]);

  // ✅ resend verification
  const handleResend = async () => {
    const inputEmail = email || prompt("📧 Please enter your email again:");
    if (!inputEmail) return;

    try {
      const res = await fetch(`${apiEndpoint}/verify-email/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ Verification email resent successfully!");
      } else {
        alert("❌ " + (data.message || "Failed to resend email"));
      }
    } catch (err) {
      alert("❌ Server error. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 blur-[80px]"
        style={{ backgroundColor: "#A0D9F0" }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-20 blur-[80px]"
        style={{ backgroundColor: "#79A68F" }}
      />
      <div className="absolute top-20 left-20 text-[#A0D9F0] opacity-20 rotate-12 hidden md:block">
        <PawPrint size={80} />
      </div>
      <div className="absolute bottom-20 right-20 text-[#79A68F] opacity-20 -rotate-12 hidden md:block">
        <Heart size={80} />
      </div>

      {/* Card */}
      <div className="w-full max-w-md z-10 px-6 py-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-green-100/50 border border-gray-100 p-10 sm:p-12 relative overflow-hidden transition-all">
          <div
            className="absolute top-0 left-0 w-full h-2 transition-colors duration-500"
            style={{ backgroundColor: "#79A68F" }}
          />

          {/* Header */}
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-lg rotate-3 transition-all duration-500 ${
                isVerified ? "bg-green-400" : "bg-[#A0D9F0]"
              }`}
            >
              {isVerified ? (
                <MailCheck className="w-12 h-12 text-white" />
              ) : (
                <AlertCircle className="w-12 h-12 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              ยืนยันอีเมลของคุณ
            </h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              {loading
                ? "เรากำลังตรวจสอบลิงก์ยืนยันจากอีเมลของคุณ..."
                : isVerified
                ? "บัญชีของคุณได้รับการยืนยันแล้ว!"
                : "ไม่สามารถยืนยันอีเมลได้ โปรดลองอีกครั้ง"}
            </p>
          </div>

          {/* Content */}
          <div className="text-center space-y-4 mt-6">
            {loading ? (
              <p className="text-gray-500 animate-pulse">⏳ Verifying your email...</p>
            ) : (
              <>
                <p
                  className={`text-base font-medium ${
                    isVerified
                      ? "text-green-600"
                      : showResend
                      ? "text-red-500"
                      : "text-gray-600"
                  }`}
                >
                  {status}
                </p>

                {isVerified ? (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#79A68F] text-white font-semibold rounded-2xl shadow-md hover:opacity-90 active:scale-[0.97] transition-all"
                    >
                      <LogIn size={18} />
                      Go to Login
                    </Link>
                    <p className="text-xs text-gray-400 mt-2">
                      Redirecting to login page in 3 seconds...
                    </p>
                  </>
                ) : (
                  showResend && (
                    <button
                      onClick={handleResend}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#A0D9F0] text-gray-700 font-semibold rounded-2xl shadow-md hover:opacity-90 active:scale-[0.97] transition-all"
                    >
                      <RefreshCcw size={18} />
                      Resend Verification Email
                    </button>
                  )
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-50 text-center">
            <p className="text-gray-400 text-xs">
              © 2026 PET TERRAIN CO.,LTD. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;