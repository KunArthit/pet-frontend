import React, { useState } from 'react';

const colors = {
  blue: '#A0D9F0',
  blueHover: '#5699bf',
  green: '#79A68F',
  greenHover: '#5F8572',
  darkText: '#4A4A4A'
};

function Error() {
  const [isHomeHover, setIsHomeHover] = useState(false);
  const [isShopHover, setIsShopHover] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <span style={{ fontSize: '80px' }}>🐾</span>
        </div>
        
        <h1 style={styles.header}>โฮ่ง! หน้าเว็บนี้หายไป</h1>
        <p style={styles.message}>
          สงสัยเจ้าตัวแสบแอบคาบหน้านี้ไปซ่อนไว้ที่ไหนสักที่
          <br />
          <span style={{ opacity: 0.7 }}>(Error 404)</span>
       </p>

        
        <div style={styles.buttonGroup}>
          {/* ปุ่มกลับหน้าหลัก */}
          <a 
            href="/" 
            style={{
              ...styles.primaryBtn,
              backgroundColor: isHomeHover ? colors.blueHover : colors.blue
            }}
            onMouseEnter={() => setIsHomeHover(true)}
            onMouseLeave={() => setIsHomeHover(false)}
          >
            กลับหน้าหลัก
          </a>

          {/* ปุ่มไปหน้า Shop */}
          <a 
            href="/shop" 
            style={{
              ...styles.secondaryBtn,
              backgroundColor: isShopHover ? colors.greenHover : 'transparent',
              color: isShopHover ? 'white' : colors.green
            }}
            onMouseEnter={() => setIsShopHover(true)}
            onMouseLeave={() => setIsShopHover(false)}
          >
            ไปเลือกช้อปสินค้า
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F7F6',
    fontFamily: 'sans-serif',
    padding: '20px'
  },
  card: {
    textAlign: 'center',
    maxWidth: '450px',
    padding: '50px 30px',
    borderRadius: '40px',
    backgroundColor: 'white',
    boxShadow: '0 15px 35px rgba(0,0,0,0.07)'
  },
  iconContainer: {
    marginBottom: '20px'
  },
  header: {
    color: colors.green,
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  message: {
    color: colors.darkText,
    fontSize: '16px',
    marginBottom: '35px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryBtn: {
    padding: '14px 28px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 'bold',
    color: 'white',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  secondaryBtn: {
    padding: '14px 28px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 'bold',
    border: `2px solid ${colors.green}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }
};

export default Error;