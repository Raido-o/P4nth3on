"use client";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { styled } from "@mui/material/styles";
import { emerald, red, slate } from "../theme/colors";
import type { DiscussionState } from "../types";

const StartButton = styled(Button)({
  background: emerald[500],
  color: "white",
  fontWeight: 700,
  padding: "0.75rem 2rem",
  borderRadius: "0.375rem",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease",
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": {
    background: emerald[600],
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
    transform: "translateY(-2px)",
  },
  "&:active": { transform: "translateY(0)" },
  "&:disabled": { background: slate[200], color: slate[400] },
});

const StopButton = styled(Button)({
  background: red[500],
  color: "white",
  fontWeight: 700,
  padding: "0.75rem 2rem",
  borderRadius: "0.375rem",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease",
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": {
    background: red[600],
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
    transform: "translateY(-2px)",
  },
  "&:active": { transform: "translateY(0)" },
});

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

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        border: `1px solid`,
        borderColor: "grey.200",
        background: "white",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            議論の制御
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {!topic
              ? "まず議題を設定してください"
              : selectedCount < 2
              ? "エージェントを2人以上選択してください"
              : isDiscussing
              ? "議論中..."
              : state === "stopped"
              ? "議論が停止されました"
              : "議論を開始できます"}
          </Typography>
        </Box>

        <Box display="flex" gap={1.5} alignItems="center">
          {isDiscussing ? (
            <StopButton startIcon={<StopIcon />} onClick={onStop}>
              停止
            </StopButton>
          ) : (
            <StartButton
              startIcon={
                isDiscussing ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                  <PlayArrowIcon />
                )
              }
              onClick={onStart}
              disabled={!canStart}
            >
              議論開始
            </StartButton>
          )}

          {(state === "stopped" || state === "topic_set") && (
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={onReset}
              sx={{
                borderRadius: "0.375rem",
                fontWeight: 600,
                textTransform: "none",
                borderColor: slate[300],
                color: slate[600],
                "&:hover": {
                  borderColor: slate[400],
                  bgcolor: `${slate[50]}`,
                },
              }}
            >
              リセット
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
