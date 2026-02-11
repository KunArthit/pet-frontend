import React from "react";
import { Box, Grid, Typography, Skeleton } from "@mui/material";

export default function CategoriesSection({
  title = "เลือกช้อปตามหมวดหมู่",
  categories = [], // รับจาก props (ถ้าไม่มีให้เป็น empty array)
  isLoading = false, // รับสถานะ loading
  onSelect,
  accentColor = "#79A68F",
}) {
  
  // ถ้ากำลังโหลด หรือ ไม่มีข้อมูล ให้แสดง Skeleton หรือไม่แสดงอะไรเลย
  // (ในที่นี้ทำ Skeleton แบบง่ายๆ ให้ดู 4 อัน)
  const displayItems = isLoading 
    ? Array.from(new Array(4)) 
    : categories;

  return (
    <Box component="section" sx={{ py: { xs: 10, md: 12 }, bgcolor: "#fff" }}>
      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, sm: 3, lg: 4 } }}>
        {/* Title */}
        <Box sx={{ textAlign: "center", mb: { xs: 8, md: 10 } }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "grey.900", mb: 2 }}>
            {title}
          </Typography>
          <Box
            sx={{
              width: 80,
              height: 4,
              bgcolor: accentColor,
              mx: "auto",
              borderRadius: 999,
            }}
          />
        </Box>

        <Grid
          container
          justifyContent="center"
          rowSpacing={{ xs: 5, md: 6 }}
          columnSpacing={{ xs: 3, md: 8, lg: 10 }}
        >
          {displayItems.map((cat, index) => (
            <Grid
              item
              xs={6}
              sm={3}
              md={3}
              key={isLoading ? index : (cat.key ?? cat.label)}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {isLoading ? (
                // Loading State
                <Box sx={{ textAlign: 'center' }}>
                    <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto', mb: 2 }} />
                    <Skeleton variant="text" width={100} sx={{ mx: 'auto' }} />
                </Box>
              ) : (
                // Real Data
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect?.(cat)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect?.(cat);
                  }}
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    outline: "none",
                    "&:hover .cat-ring": { borderColor: accentColor },
                    "&:hover .cat-img": { transform: "scale(1.1)" },
                    "&:hover .cat-title": { color: accentColor },
                  }}
                >
                  <Box
                    className="cat-ring"
                    sx={{
                      width: { xs: 170, sm: 200, md: 240 },
                      height: { xs: 170, sm: 200, md: 240 },
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "50%",
                      mb: 2,
                      boxShadow: "0 12px 28px rgba(0,0,0,0.14)",
                      border: "4px solid transparent",
                      transition: "border-color 300ms ease",
                      mx: "auto",
                      bgcolor: '#f5f5f5' // สีพื้นหลังเผื่อรูปโหลดไม่ทัน
                    }}
                  >
                    <Box
                      component="img"
                      src={cat.image}
                      alt={cat.label}
                      className="cat-img"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: "scale(1)",
                        transition: "transform 500ms ease",
                        display: "block",
                      }}
                      onError={(e) => {
                         e.target.src = "https://placehold.co/400x400?text=No+Image";
                      }}
                    />
                  </Box>

                  <Typography
                    className="cat-title"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: 16, md: 20 },
                      color: "grey.900",
                      transition: "color 200ms ease",
                    }}
                  >
                    {cat.label}
                  </Typography>
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}