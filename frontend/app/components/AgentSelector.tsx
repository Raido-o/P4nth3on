"use client";

import { Box, Slider, Typography } from "@mui/material";
import Image from "next/image";
import { GREAT_PERSONS } from "../data/greatPersons";

type Props = {
  selectedIds: string[];
  onToggle: (id: string) => void;
  contextDepth: number;
  onContextDepthChange: (value: number) => void;
  disabled: boolean;
};

export default function AgentSelector({
  selectedIds,
  onToggle,
  contextDepth,
  onContextDepthChange,
  disabled,
}: Props) {
  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {GREAT_PERSONS.map((person) => {
          const selected = selectedIds.includes(person.id);
          return (
            <Box
              key={person.id}
              onClick={() => !disabled && onToggle(person.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1,
                py: 0.75,
                cursor: disabled ? "not-allowed" : "pointer",
                bgcolor: selected ? `${person.avatarColor}15` : "transparent",
                borderBottom: "1px dotted #e0e0e0",
                borderLeft: selected ? `3px solid ${person.avatarColor}` : "3px solid transparent",
                opacity: disabled ? 0.6 : 1,
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: disabled ? undefined : `${person.avatarColor}10`,
                },
                "&:last-child": { borderBottom: "none" },
              }}
            >
              {/* チェックボックス風 */}
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  border: `2px solid ${selected ? person.avatarColor : "#aaa"}`,
                  bgcolor: selected ? person.avatarColor : "transparent",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selected && (
                  <Typography sx={{ fontSize: "0.55rem", color: "white", lineHeight: 1, fontWeight: 900 }}>
                    ✓
                  </Typography>
                )}
              </Box>

              {/* サムネイル */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  overflow: "hidden",
                  border: `1px solid ${selected ? person.avatarColor : "#ddd"}`,
                  position: "relative",
                }}
              >
                <Image
                  src={person.imagePath}
                  alt={person.nameJa}
                  fill
                  style={{ objectFit: "cover", objectPosition: "top" }}
                  sizes="32px"
                />
              </Box>

              {/* 名前・分野 */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.72rem",
                    fontWeight: selected ? 700 : 400,
                    color: selected ? person.avatarColor : "#333",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {person.nameJa}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.6rem",
                    color: "#999",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {person.field}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* 文脈深さ */}
      <Box
        sx={{
          mt: 1.5,
          pt: 1.5,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography sx={{ fontFamily: "monospace", fontSize: "0.68rem", color: "#555", fontWeight: 700 }}>
            文脈深さ (Context Depth)
          </Typography>
          <Typography sx={{ fontFamily: "monospace", fontSize: "0.68rem", color: "#0066cc" }}>
            {contextDepth === 0 ? "OFF" : `${contextDepth}件`}
          </Typography>
        </Box>
        <Slider
          value={contextDepth}
          onChange={(_, v) => onContextDepthChange(v as number)}
          min={0}
          max={20}
          step={2}
          marks={[
            { value: 0, label: "0" },
            { value: 10, label: "10" },
            { value: 20, label: "20" },
          ]}
          disabled={disabled}
          size="small"
          sx={{
            color: "#1a1a2e",
            "& .MuiSlider-markLabel": {
              fontFamily: "monospace",
              fontSize: "0.6rem",
            },
          }}
        />
        <Typography sx={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#aaa", mt: 0.5 }}>
          ※ 参照する過去の発言数。0=文脈なし
        </Typography>
      </Box>
    </Box>
  );
}
