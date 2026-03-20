"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Box, Divider, Snackbar, Typography } from "@mui/material";
import ForumHeader from "./components/ForumHeader";
import TopicInput from "./components/TopicInput";
import AgentSelector from "./components/AgentSelector";
import DiscussionControls from "./components/DiscussionControls";
import MessageCard from "./components/MessageCard";
import { GREAT_PERSONS } from "./data/greatPersons";
import type { DiscussionState, Message } from "./types";
import { slate } from "./theme/colors";

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
  const stopRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    stopRef.current = false;
  };

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
  }, [topic, selectedIds, generateMessage]);

  const handleStop = () => {
    stopRef.current = true;
    setState("stopped");
  };

  const isDiscussing = state === "discussing";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#ffffff",
        backgroundImage: `radial-gradient(${slate[200]} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
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
      <ForumHeader topic={topic} />

      <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 360px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* メインエリア */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TopicInput onSubmit={handleTopicSet} disabled={isDiscussing} />

            <DiscussionControls
              state={state}
              topic={topic}
              selectedCount={selectedIds.length}
              onStart={handleStart}
              onStop={handleStop}
              onReset={handleReset}
            />

            {/* フォーラム */}
            <Box
              sx={{
                minHeight: 400,
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "white",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">
                議論
                {topic && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1, fontWeight: 400 }}
                  >
                    「{topic}」
                  </Typography>
                )}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {messages.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 1, opacity: 0.3 }}>
                    🏛️
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {!topic
                      ? "議題を設定して議論を始めましょう"
                      : "「議論開始」ボタンを押すと偉人たちが議論を始めます"}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {messages.map((msg) => (
                    <MessageCard key={msg.id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </Box>
              )}
            </Box>
          </Box>

          {/* サイドバー: エージェント選択 */}
          <Box
            sx={{
              position: { lg: "sticky" },
              top: { lg: 80 },
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              bgcolor: "white",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          >
            <AgentSelector
              selectedIds={selectedIds}
              onToggle={handleToggleAgent}
              contextDepth={contextDepth}
              onContextDepthChange={setContextDepth}
              disabled={isDiscussing}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
