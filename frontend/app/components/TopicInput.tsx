"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { styled } from "@mui/material/styles";
import { blue, slate } from "../theme/colors";

const StartButton = styled(Button)({
  background: blue[500],
  color: "white",
  fontWeight: 700,
  padding: "0.75rem 2rem",
  borderRadius: "0.375rem",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease",
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": {
    background: blue[600],
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&:disabled": {
    background: slate[200],
    color: slate[400],
  },
});

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
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        border: `1px solid ${slate[200]}`,
        background: "white",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <LightbulbIcon sx={{ color: blue[500], fontSize: 22 }} />
        <Typography variant="h6" fontWeight={700} color="text.primary">
          議題を設定
        </Typography>
      </Box>

      <Box display="flex" gap={1.5} mb={2}>
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
          size="medium"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.5rem",
              bgcolor: disabled ? slate[50] : "white",
            },
          }}
        />
        <StartButton onClick={handleSubmit} disabled={disabled || !value.trim()}>
          決定
        </StartButton>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={1}>
        <Typography variant="caption" color="text.secondary" sx={{ width: "100%", mb: 0.5 }}>
          例題:
        </Typography>
        {EXAMPLE_TOPICS.map((topic) => (
          <Button
            key={topic}
            size="small"
            variant="outlined"
            onClick={() => setValue(topic)}
            disabled={disabled}
            sx={{
              borderRadius: "999px",
              fontSize: "0.75rem",
              py: 0.5,
              px: 1.5,
              textTransform: "none",
              borderColor: slate[200],
              color: slate[600],
              "&:hover": {
                borderColor: blue[400],
                color: blue[600],
                bgcolor: `${blue[500]}08`,
              },
            }}
          >
            {topic}
          </Button>
        ))}
      </Box>
    </Paper>
  );
}
