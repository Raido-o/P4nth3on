"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import { blue, slate } from "../theme/colors";

type Props = {
  topic: string;
};

export default function ForumHeader({ topic }: Props) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const progress = Math.min(scrollY / 100, 1);
  const backgroundColor = `rgba(255, 255, 255, ${progress * 0.95})`;
  const backdropFilter = `blur(${progress * 12}px)`;
  const isScrolled = scrollY > 50;

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor,
        backdropFilter,
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
        borderBottom: isScrolled ? `1px solid ${slate[200]}` : "1px solid transparent",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${blue[500]}, #6366f1)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            }}
          >
            <ForumIcon sx={{ color: "white", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                background: `linear-gradient(135deg, ${blue[600]}, #6366f1)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              万P4n神th3殿on
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
              偉人たちの議論フォーラム
            </Typography>
          </Box>
        </Box>

        {topic && (
          <Chip
            label={`議題: ${topic}`}
            sx={{
              maxWidth: { xs: 160, sm: 320 },
              bgcolor: `${blue[500]}15`,
              color: blue[700],
              fontWeight: 600,
              border: `1px solid ${blue[200]}`,
              "& .MuiChip-label": {
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}
