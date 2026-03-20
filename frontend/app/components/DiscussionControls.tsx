"use client";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import type { DiscussionState } from "../types";

type Props = {
  state: DiscussionState;
  topic: string;
  selectedCount: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
};

export default function DiscussionControls({
  state,
  topic,
  selectedCount,
  onStart,
  onStop,
  onReset,
}: Props) {
  const canStart = topic && selectedCount >= 2 && state === "topic_set";
  const isDiscussing = state === "discussing";

  const statusText = !topic
    ? ">> 議題が未設定です"
    : selectedCount < 2
    ? ">> エージェントを2名以上選択してください"
    : isDiscussing
    ? ">> 議論進行中... (AIが返答を生成しています)"
    : state === "stopped"
    ? ">> 議論が停止されました"
    : ">> 準備完了。議論を開始できます";

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "#f0f0f0",
          border: "1px solid #ddd",
          px: 1.5,
          py: 0.75,
          mb: 1.5,
          fontFamily: "monospace",
        }}
      >
        <Typography sx={{ fontFamily: "monospace", fontSize: "0.75rem", color: isDiscussing ? "#cc0000" : "#333" }}>
          STATUS: {statusText}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {isDiscussing ? (
          <Button
            onClick={onStop}
            variant="contained"
            sx={{
              borderRadius: "2px",
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "0.8rem",
              bgcolor: "#cc0000",
              color: "#fff",
              "&:hover": { bgcolor: "#990000" },
            }}
          >
            ■ 議論を停止する
          </Button>
        ) : (
          <Button
            onClick={onStart}
            disabled={!canStart}
            variant="contained"
            startIcon={isDiscussing ? <CircularProgress size={14} sx={{ color: "white" }} /> : null}
            sx={{
              borderRadius: "2px",
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "0.8rem",
              bgcolor: "#006600",
              color: "#fff",
              "&:hover": { bgcolor: "#004400" },
              "&:disabled": { bgcolor: "#ccc", color: "#999" },
            }}
          >
            ▶ 議論を開始する
          </Button>
        )}

        {(state === "stopped" || state === "topic_set") && (
          <Button
            onClick={onReset}
            variant="outlined"
            sx={{
              borderRadius: "2px",
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "0.8rem",
              borderColor: "#888",
              color: "#555",
              "&:hover": { borderColor: "#333", color: "#333", bgcolor: "#f5f5f5" },
            }}
          >
            ↺ リセット
          </Button>
        )}
      </Box>
    </Box>
  );
}
