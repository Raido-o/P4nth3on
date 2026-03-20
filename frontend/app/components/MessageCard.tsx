"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import type { Message } from "../types";
import { GREAT_PERSONS } from "../data/greatPersons";

type Props = {
  message: Message;
  index: number;
};

// 2000年代フォーラム風: 投稿番号、左サイドバーにユーザー情報、右に本文
export default function MessageCard({ message, index }: Props) {
  const person = GREAT_PERSONS.find((p) => p.id === message.agentId);
  const avatarColor = person?.avatarColor ?? "#6366f1";

  const ts = message.timestamp;
  const dateStr = `${ts.getFullYear()}/${String(ts.getMonth() + 1).padStart(2, "0")}/${String(ts.getDate()).padStart(2, "0")} ${String(ts.getHours()).padStart(2, "0")}:${String(ts.getMinutes()).padStart(2, "0")}:${String(ts.getSeconds()).padStart(2, "0")}`;

  return (
    <Box
      sx={{
        border: "1px solid #c8c8c8",
        borderTop: `3px solid ${avatarColor}`,
        bgcolor: "#ffffff",
        mb: 0,
        animation: "fadeIn 0.2s ease",
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      {/* 投稿ヘッダー行 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 0.6,
          bgcolor: "#f0f0f0",
          borderBottom: "1px solid #c8c8c8",
        }}
      >
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.72rem",
            color: "#666",
            fontWeight: 700,
          }}
        >
          #{String(index + 1).padStart(3, "0")}
        </Typography>
        <Box
          sx={{
            width: 1,
            height: 12,
            bgcolor: "#c8c8c8",
          }}
        />
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.72rem",
            color: avatarColor,
            fontWeight: 700,
          }}
        >
          {person?.nameJa ?? message.agentNameJa}
        </Typography>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.68rem",
            color: "#888",
          }}
        >
          [{person?.field}]
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.68rem",
            color: "#999",
          }}
        >
          投稿日時: {dateStr}
        </Typography>
      </Box>

      {/* 本文エリア: 左カラム(ユーザー情報) + 右カラム(本文) */}
      <Box sx={{ display: "flex" }}>
        {/* 左: ユーザーカード */}
        <Box
          sx={{
            width: 110,
            flexShrink: 0,
            borderRight: "1px solid #e0e0e0",
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.75,
            bgcolor: "#fafafa",
          }}
        >
          {/* アバター画像 */}
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "2px",
              overflow: "hidden",
              border: `2px solid ${avatarColor}`,
              position: "relative",
              flexShrink: 0,
            }}
          >
            {person?.imagePath && (
              <Image
                src={person.imagePath}
                alt={person.nameJa}
                fill
                style={{ objectFit: "cover", objectPosition: "top" }}
                sizes="72px"
              />
            )}
          </Box>

          {/* ユーザー名 */}
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#333",
              textAlign: "center",
              lineHeight: 1.3,
              wordBreak: "break-all",
            }}
          >
            {person?.nameJa}
          </Typography>

          {/* 役職バッジ */}
          <Box
            sx={{
              border: `1px solid ${avatarColor}`,
              px: 0.75,
              py: 0.2,
              borderRadius: "2px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "monospace",
                fontSize: "0.6rem",
                color: avatarColor,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {person?.field}
            </Typography>
          </Box>

          {/* 時代 */}
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.58rem",
              color: "#999",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            {person?.era}
          </Typography>

          {/* 投稿数 */}
          <Box sx={{ mt: "auto", pt: 0.5, borderTop: "1px dashed #ddd", width: "100%", textAlign: "center" }}>
            <Typography sx={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#aaa" }}>
              投稿数: {index + 1}
            </Typography>
          </Box>
        </Box>

        {/* 右: 本文 */}
        <Box sx={{ flex: 1, p: 2, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: '"Hiragino Kaku Gothic ProN", "Meiryo", sans-serif',
              fontSize: "0.9rem",
              lineHeight: 1.85,
              color: "#222",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {message.content}
            {message.isStreaming && (
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "8px",
                  height: "14px",
                  bgcolor: avatarColor,
                  ml: 0.5,
                  verticalAlign: "middle",
                  animation: "blink 0.6s step-end infinite",
                  "@keyframes blink": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0 },
                  },
                }}
              />
            )}
          </Typography>

          {/* 引用風フッター */}
          {!message.isStreaming && (
            <Box
              sx={{
                mt: 1.5,
                pt: 1,
                borderTop: "1px dashed #ddd",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Typography sx={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#bbb" }}>
                — {person?.name} ({person?.era})
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
