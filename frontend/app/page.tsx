"use client";

import React, { useCallback, useRef, useState } from "react";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import TopicInput from "./components/TopicInput";
import AgentSelector from "./components/AgentSelector";
import DiscussionControls from "./components/DiscussionControls";
import DiscussionSummary from "./components/DiscussionSummary";
import VirtualMessageList from "./components/VirtualMessageList";
import { GREAT_PERSONS } from "./data/greatPersons";
import type { DiscussionState, Message } from "./types";
import type { SummaryData } from "./components/DiscussionSummary";
import Image from "next/image";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "socrates",
    "einstein",
    "darwin",
  ]);
  const [contextDepth, setContextDepth] = useState(6);
  const [state, setState] = useState<DiscussionState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const stopRef = useRef(false);

  const handleTopicSet = (newTopic: string) => {
    setTopic(newTopic);
    setState("topic_set");
    setMessages([]);
  };

  const handleToggleAgent = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setTopic("");
    setMessages([]);
    setState("idle");
    setSummary(null);
    setSummaryError(null);
    stopRef.current = false;
  };

  const generateSummary = useCallback(async (msgs: Message[], currentTopic: string) => {
    if (msgs.length === 0) return;
    setSummaryLoading(true);
    setSummaryError(null);
    setSummary(null);
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: currentTopic,
          messages: msgs.map((m) => ({ agentNameJa: m.agentNameJa, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSummaryError(data.error ?? "まとめ生成に失敗しました");
      } else {
        setSummary(data);
      }
    } catch {
      setSummaryError("通信エラーが発生しました");
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const generateMessage = useCallback(
    async (
      agentId: string,
      currentMessages: Message[]
    ): Promise<Message | null> => {
      const person = GREAT_PERSONS.find((p) => p.id === agentId);
      if (!person) return null;

      const newMsg: Message = {
        id: `${agentId}-${Date.now()}`,
        agentId,
        agentName: person.name,
        agentNameJa: person.nameJa,
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, newMsg]);

      const conversationHistory = currentMessages.map((m) => ({
        role: "assistant" as const,
        content: `${m.agentNameJa}: ${m.content}`,
      }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            agentSystemPrompt: person.systemPrompt,
            agentName: person.nameJa,
            conversationHistory,
            contextDepth,
          }),
        });

        if (!res.ok || !res.body) {
          const errData = await res.json().catch(() => ({ error: "不明なエラー" }));
          setApiError(errData.error ?? "APIエラーが発生しました");
          setMessages((prev) => prev.filter((m) => m.id !== newMsg.id));
          return null;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          if (stopRef.current) {
            reader.cancel();
            break;
          }
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === newMsg.id ? { ...m, content: fullContent } : m
            )
          );
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === newMsg.id ? { ...m, isStreaming: false } : m
          )
        );

        return { ...newMsg, content: fullContent, isStreaming: false };
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== newMsg.id));
        return null;
      }
    },
    [topic, contextDepth]
  );

  const handleStart = useCallback(async () => {
    if (!topic || selectedIds.length < 2) return;
    stopRef.current = false;
    setState("discussing");

    const currentMessages: Message[] = [];
    let roundCount = 0;
    const maxRounds = 10;

    let hasError = false;
    while (!stopRef.current && !hasError && roundCount < maxRounds) {
      for (const agentId of selectedIds) {
        if (stopRef.current) break;
        const msg = await generateMessage(agentId, currentMessages);
        if (msg) {
          currentMessages.push(msg);
        } else if (!stopRef.current) {
          hasError = true;
          break;
        }
        if (stopRef.current) break;
        await new Promise((r) => setTimeout(r, 500));
      }
      roundCount++;
    }

    setState("stopped");
    generateSummary(currentMessages, topic);
  }, [topic, selectedIds, generateMessage, generateSummary]);

  const handleStop = () => {
    stopRef.current = true;
    setState("stopped");
    // 停止時点のメッセージでまとめ生成（state更新前なのでsetMessagesの結果を直接参照できないため関数形式で取得）
    setMessages((prev) => {
      generateSummary(prev.filter((m) => !m.isStreaming), topic);
      return prev;
    });
  };

  const isDiscussing = state === "discussing";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#e8e8e8" }}>
      <Snackbar
        open={!!apiError}
        autoHideDuration={8000}
        onClose={() => setApiError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setApiError(null)} sx={{ maxWidth: 600 }}>
          <strong>APIエラー:</strong> {apiError}
        </Alert>
      </Snackbar>

      {/* ===== 2000年代フォーラム風ヘッダー ===== */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
          borderBottom: "3px solid #e94560",
          px: { xs: 2, sm: 4 },
          py: 1.5,
        }}
      >
        <Box sx={{ maxWidth: 1100, mx: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "4px",
              overflow: "hidden",
              flexShrink: 0,
              border: "2px solid #e94560",
            }}
          >
            <Image src="/logo.png" alt="万P4n神th3殿on" width={52} height={52} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "monospace",
                fontSize: { xs: "1.1rem", sm: "1.4rem" },
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "0.05em",
                textShadow: "0 0 10px rgba(233,69,96,0.6)",
              }}
            >
              万P4n神th3殿on BBS
            </Typography>
            <Typography
              sx={{
                fontFamily: "monospace",
                fontSize: "0.7rem",
                color: "#8892b0",
              }}
            >
              偉人議論掲示板 — Great Minds Forum System v2.0
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          {topic && (
            <Box
              sx={{
                border: "1px solid #e94560",
                px: 1.5,
                py: 0.5,
                bgcolor: "rgba(233,69,96,0.1)",
                display: { xs: "none", sm: "block" },
              }}
            >
              <Typography sx={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#e94560" }}>
                TOPIC: {topic}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* ナビゲーションバー */}
      <Box
        sx={{
          bgcolor: "#2d2d2d",
          borderBottom: "1px solid #444",
          px: { xs: 2, sm: 4 },
          py: 0.5,
        }}
      >
        <Box sx={{ maxWidth: 1100, mx: "auto", display: "flex", gap: 0, alignItems: "center" }}>
          {["ホーム", "スレッド一覧", "新規投稿", "メンバー", "ヘルプ"].map((item, i) => (
            <Box
              key={item}
              sx={{
                px: 1.5,
                py: 0.6,
                cursor: "default",
                borderRight: "1px solid #444",
                "&:first-of-type": { borderLeft: "1px solid #444" },
                "&:hover": { bgcolor: "#3d3d3d" },
              }}
            >
              <Typography sx={{ fontFamily: "monospace", fontSize: "0.72rem", color: i === 0 ? "#e94560" : "#aaa" }}>
                [{item}]
              </Typography>
            </Box>
          ))}
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontFamily: "monospace", fontSize: "0.68rem", color: "#666" }}>
            ようこそ、名無しさん
          </Typography>
        </Box>
      </Box>

      {/* ===== メインコンテンツ ===== */}
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 1, sm: 2 }, py: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 300px" },
            gap: 2,
            alignItems: "start",
          }}
        >
          {/* 左: メインスレッドエリア */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            {/* 議題入力パネル */}
            <Box
              sx={{
                border: "1px solid #c8c8c8",
                bgcolor: "#fff",
              }}
            >
              <Box sx={{ bgcolor: "#1a1a2e", px: 2, py: 0.75, borderBottom: "2px solid #e94560" }}>
                <Typography sx={{ fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>
                  ▶ スレッド設定 / Thread Settings
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <TopicInput onSubmit={handleTopicSet} disabled={isDiscussing} />
              </Box>
            </Box>

            {/* 議論コントロールパネル */}
            <Box
              sx={{
                border: "1px solid #c8c8c8",
                bgcolor: "#fff",
              }}
            >
              <Box sx={{ bgcolor: "#2d2d2d", px: 2, py: 0.75, borderBottom: "1px solid #555" }}>
                <Typography sx={{ fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 700, color: "#ccc" }}>
                  ▶ 議論コントロール / Discussion Control
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <DiscussionControls
                  state={state}
                  topic={topic}
                  selectedCount={selectedIds.length}
                  onStart={handleStart}
                  onStop={handleStop}
                  onReset={handleReset}
                />
              </Box>
            </Box>

            {/* スレッド本体 */}
            <Box sx={{ border: "1px solid #c8c8c8", bgcolor: "#fff" }}>
              {/* スレッドヘッダー */}
              <Box
                sx={{
                  bgcolor: "#1a1a2e",
                  px: 2,
                  py: 1,
                  borderBottom: "2px solid #e94560",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography sx={{ fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>
                    ▶ スレッド: {topic || "（未設定）"}
                  </Typography>
                  <Typography sx={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#8892b0", mt: 0.25 }}>
                    Great Minds Discussion Board — 全{messages.length}件の投稿
                  </Typography>
                </Box>
                <Box sx={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#e94560", textAlign: "right" }}>
                  {isDiscussing && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{
                        width: 8, height: 8, borderRadius: "50%", bgcolor: "#e94560",
                        animation: "pulse 1s ease-in-out infinite",
                        "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } },
                      }} />
                      <Typography sx={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#e94560" }}>
                        LIVE
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* 投稿リスト（仮想スクロール） */}
              <VirtualMessageList messages={messages} height={600} />

              {/* フッター */}
              <Box
                sx={{
                  borderTop: "1px solid #e0e0e0",
                  px: 2,
                  py: 0.75,
                  bgcolor: "#f5f5f5",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#aaa" }}>
                  万P4n神th3殿on BBS — Powered by Gemini AI
                </Typography>
                <Typography sx={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#aaa" }}>
                  全{messages.length}件
                </Typography>
              </Box>
            </Box>

            {/* まとめ */}
            {(summaryLoading || summary || summaryError) && (
              <DiscussionSummary
                summary={summary}
                isLoading={summaryLoading}
                error={summaryError}
              />
            )}
          </Box>

          {/* 右: サイドバー */}
          <Box
            sx={{
              position: { lg: "sticky" },
              top: { lg: 16 },
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* エージェント選択 */}
            <Box sx={{ border: "1px solid #c8c8c8", bgcolor: "#fff" }}>
              <Box sx={{ bgcolor: "#1a1a2e", px: 2, py: 0.75, borderBottom: "2px solid #e94560" }}>
                <Typography sx={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>
                  ▶ 参加メンバー選択
                </Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <AgentSelector
                  selectedIds={selectedIds}
                  onToggle={handleToggleAgent}
                  contextDepth={contextDepth}
                  onContextDepthChange={setContextDepth}
                  disabled={isDiscussing}
                />
              </Box>
            </Box>

            {/* 掲示板ルール */}
            <Box sx={{ border: "1px solid #c8c8c8", bgcolor: "#fff" }}>
              <Box sx={{ bgcolor: "#2d2d2d", px: 2, py: 0.75, borderBottom: "1px solid #555" }}>
                <Typography sx={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, color: "#ccc" }}>
                  ▶ 掲示板ルール
                </Typography>
              </Box>
              <Box sx={{ p: 1.5 }}>
                {[
                  "1. 議題は明確に設定する",
                  "2. 2名以上の偉人を選択",
                  "3. 文脈深さで会話品質を調整",
                  "4. 停止ボタンでいつでも中断可",
                ].map((rule) => (
                  <Typography
                    key={rule}
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.68rem",
                      color: "#666",
                      py: 0.4,
                      borderBottom: "1px dotted #eee",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    {rule}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* フッター */}
      <Box
        sx={{
          bgcolor: "#1a1a2e",
          borderTop: "2px solid #e94560",
          px: 4,
          py: 1.5,
          mt: 4,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#8892b0" }}>
          万P4n神th3殿on BBS © 2026 — Great Minds Discussion Forum — All Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
}
