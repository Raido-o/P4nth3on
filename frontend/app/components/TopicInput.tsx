"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const EXAMPLE_TOPICS = [
  "民主主義は最良の政治体制か？",
  "科学技術の発展は人類に幸福をもたらすか？",
  "芸術と科学、どちらが文明に貢献するか？",
  "自由と平等は両立できるか？",
  "宗教は社会に必要か？",
];

type Props = {
  onSubmit: (topic: string) => void;
  disabled: boolean;
};

export default function TopicInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
        <TextField
          placeholder="例：民主主義は最良の政治体制か？"
          variant="outlined"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={disabled}
          fullWidth
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "2px",
              fontFamily: "monospace",
              fontSize: "0.85rem",
            },
          }}
        />
        <Button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          variant="contained"
          sx={{
            borderRadius: "2px",
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: "0.8rem",
            px: 2,
            bgcolor: "#1a1a2e",
            color: "#fff",
            whiteSpace: "nowrap",
            "&:hover": { bgcolor: "#e94560" },
            "&:disabled": { bgcolor: "#ccc", color: "#999" },
          }}
        >
          決定する
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "center" }}>
        <Typography sx={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#999", mr: 0.5 }}>
          例題:
        </Typography>
        {EXAMPLE_TOPICS.map((topic) => (
          <Box
            key={topic}
            component="button"
            onClick={() => setValue(topic)}
            disabled={disabled}
            sx={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              color: "#0066cc",
              bgcolor: "transparent",
              border: "none",
              cursor: disabled ? "not-allowed" : "pointer",
              p: 0,
              textDecoration: "underline",
              "&:hover": { color: "#e94560" },
            }}
          >
            [{topic}]
          </Box>
        ))}
      </Box>
    </Box>
  );
}
