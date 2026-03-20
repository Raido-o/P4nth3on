"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import MessageCard from "./MessageCard";
import type { Message } from "../types";

type Props = {
  messages: Message[];
  height?: number;
};

// 各メッセージの推定高さキャッシュ
const estimateHeight = (msg: Message): number => {
  // ヘッダー行 + ユーザーカード最低高さ + テキスト行数推定
  const charsPerLine = 28; // 本文カラム幅での1行あたり文字数
  const lineHeight = 28; // px
  const lines = Math.ceil((msg.content?.length ?? 0) / charsPerLine);
  const textHeight = Math.max(lines, 3) * lineHeight;
  const baseHeight = 60; // ヘッダー + パディング
  const minUserCardHeight = 160; // 左カラム最小高さ
  return Math.max(baseHeight + textHeight, minUserCardHeight) + 16; // +16 = border
};

export default function VirtualMessageList({ messages, height = 600 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const heightCache = useRef<Map<string, number>>(new Map());
  const [, forceUpdate] = useState(0);
  const isAutoScrolling = useRef(true);
  const lastScrollTop = useRef(0);

  // 実際のDOM高さを計測してキャッシュ更新
  const measureItem = useCallback((id: string, el: HTMLDivElement | null) => {
    if (!el) {
      itemRefs.current.delete(id);
      return;
    }
    itemRefs.current.set(id, el);
    const measured = el.getBoundingClientRect().height;
    if (measured > 0 && heightCache.current.get(id) !== measured) {
      heightCache.current.set(id, measured);
      forceUpdate((n) => n + 1);
    }
  }, []);

  // ストリーミング中のアイテムは定期的に再計測
  useLayoutEffect(() => {
    const streamingIds = messages.filter((m) => m.isStreaming).map((m) => m.id);
    if (streamingIds.length === 0) return;
    const timer = setInterval(() => {
      let changed = false;
      streamingIds.forEach((id) => {
        const el = itemRefs.current.get(id);
        if (!el) return;
        const measured = el.getBoundingClientRect().height;
        if (measured > 0 && heightCache.current.get(id) !== measured) {
          heightCache.current.set(id, measured);
          changed = true;
        }
      });
      if (changed) forceUpdate((n) => n + 1);
    }, 80);
    return () => clearInterval(timer);
  }, [messages]);

  // 自動スクロール（ユーザーが上にスクロールしたら止める）
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    const scrolledUp = el.scrollTop < lastScrollTop.current;
    if (scrolledUp) isAutoScrolling.current = false;
    if (isAtBottom) isAutoScrolling.current = true;
    lastScrollTop.current = el.scrollTop;
  }, []);

  useEffect(() => {
    if (!isAutoScrolling.current) return;
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, forceUpdate]);

  // 空状態
  if (messages.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center", bgcolor: "#fafafa", minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Typography sx={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#999" }}>
          &gt;&gt; 投稿がありません。議題を設定して議論を開始してください。&lt;&lt;
        </Typography>
        <Typography sx={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#bbb", mt: 1 }}>
          - No posts yet. Set a topic and start discussion. -
        </Typography>
      </Box>
    );
  }

  // 全アイテムの累積オフセットを計算
  const offsets: number[] = [];
  let total = 0;
  for (const msg of messages) {
    offsets.push(total);
    total += heightCache.current.get(msg.id) ?? estimateHeight(msg);
  }

  // コンテナスクロール位置から表示範囲を計算（overscan付き）
  const scrollTop = containerRef.current?.scrollTop ?? 0;
  const OVERSCAN = 3;

  let startIndex = 0;
  for (let i = 0; i < offsets.length; i++) {
    if (offsets[i] + (heightCache.current.get(messages[i].id) ?? estimateHeight(messages[i])) > scrollTop) {
      startIndex = Math.max(0, i - OVERSCAN);
      break;
    }
  }

  let endIndex = messages.length - 1;
  for (let i = startIndex; i < messages.length; i++) {
    if (offsets[i] > scrollTop + height + 200) {
      endIndex = Math.min(messages.length - 1, i + OVERSCAN);
      break;
    }
  }

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        height,
        overflowY: "auto",
        position: "relative",
        bgcolor: "#fafafa",
        // スクロールバーをレトロ風に
        "&::-webkit-scrollbar": { width: "10px" },
        "&::-webkit-scrollbar-track": { bgcolor: "#e0e0e0", border: "1px solid #c8c8c8" },
        "&::-webkit-scrollbar-thumb": { bgcolor: "#999", border: "1px solid #888" },
        "&::-webkit-scrollbar-thumb:hover": { bgcolor: "#666" },
      }}
    >
      {/* 全体の高さを確保する幽霊要素 */}
      <Box sx={{ height: total, position: "relative" }}>
        {messages.slice(startIndex, endIndex + 1).map((msg, relIdx) => {
          const absIndex = startIndex + relIdx;
          const top = offsets[absIndex];
          return (
            <Box
              key={msg.id}
              ref={(el: HTMLDivElement | null) => measureItem(msg.id, el)}
              sx={{
                position: "absolute",
                top,
                left: 0,
                right: 0,
              }}
            >
              <MessageCard message={msg} index={absIndex} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
