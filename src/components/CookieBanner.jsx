import { useEffect, useState } from "react";

const apiEndpoint =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080/api";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setTimeout(() => setShow(true), 300); // delay นิดให้เนียน
    }
  }, []);

  const handleConsent = async (type) => {
    setLoading(true);

    const data = {
      type,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(`${apiEndpoint}/consent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      localStorage.setItem("cookie_consent", JSON.stringify(data));

      if (type === "accept") {
        window.dispatchEvent(new Event("consent-accepted"));
      }

      setShow(false);
    } catch (err) {
      console.error("Consent error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.textBlock}>
          <div style={styles.title}>🍪 Cookies</div>
          <div style={styles.text}>
            เราใช้ cookies เพื่อปรับปรุงประสบการณ์ของคุณให้ดียิ่งขึ้น
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={() => handleConsent("reject")}
            disabled={loading}
            style={styles.reject}
          >
            ปฏิเสธ
          </button>

          <button
            onClick={() => handleConsent("accept")}
            disabled={loading}
            style={styles.accept}
          >
            {loading ? "..." : "ยอมรับ"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: 20,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    zIndex: 9999,
    animation: "slideUp 0.4s ease",
  },

  container: {
    width: "92%",
    maxWidth: "640px",
    backdropFilter: "blur(14px)",
    background: "rgba(255,255,255,0.75)",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "16px",
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },

  textBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  title: {
    fontWeight: "600",
    fontSize: "14px",
  },

  text: {
    fontSize: "13px",
    color: "#555",
  },

  buttonGroup: {
    display: "flex",
    gap: "10px",
  },

  accept: {
    background: "#A0D9F0",
    color: "#083344",
    padding: "8px 16px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.25s ease",
  },

  reject: {
    background: "transparent",
    color: "#79A6A8",
    padding: "8px 16px",
    border: "1px solid #79A6A8",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.25s ease",
  },
};