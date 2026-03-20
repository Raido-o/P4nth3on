"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

export type SummaryData = {
  title: string;
  overview: string;
  keyPoints: { author: string; point: string }[];
  agreements: string[];
  disagreements: string[];
  conclusion: string;
  quote: { author: string; text: string };
};

type Props = {
  summary: SummaryData | null;
  isLoading: boolean;
  error: string | null;
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 2 }}>
    <Box
      sx={{
        bgcolor: "#2d2d2d",
        px: 1.5,
        py: 0.5,
        mb: 1,
        borderLeft: "3px solid #e94560",
      }}
    >
      <Typography sx={{ fontFamily: "monospace", fontSize: "0.72rem", fontWeight: 700, color: "#ccc" }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Box>
);

export default function DiscussionSummary({ summary, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <Box sx={{ border: "1px solid #c8c8c8", bgcolor: "#fff" }}>
        <Box sx={{ bgcolor: "#1a1a2e", px: 2, py: 0.75, borderBottom: "2px solid #e94560" }}>
          <Typography sx={{ fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>
            ▶ 議論まとめ生成中... / Generating Summary
          </Typography>
        </Box>
        <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={20} sx={{ color: "#e94560" }} />
          <Typography sx={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#666" }}>
            AIが議論内容を分析・要約しています...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ border: "1px solid #c8c8c8", bgcolor: "#fff" }}>
        <Box sx={{ bgcolor: "#1a1a2e", px: 2, py: 0.75, borderBottom: "2px solid #e94560" }}>
          <Typography sx={{ fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>
            ▶ 議論まとめ / Summary
          </Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: "#fff5f5", border: "1px solid #ffcccc", m: 2 }}>
          <Typography sx={{ fontFamily: "monospace", fontSize: "0.72rem", color: "#cc0000" }}>
            ERROR: {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!summary) return null;

  return (
    <Box sx={{ border: "1px solid #c8c8c8", bgcolor: "#fff" }}>
      {/* ヘッダー */}
      <Box sx={{ bgcolor: "#1a1a2e", px: 2, py: 0.75, borderBottom: "2px solid #e94560" }}>
        <Typography sx={{ fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>
          ▶ 議論まとめレポート / Discussion Summary Report
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* タイトル */}
        <Box
          sx={{
            border: "1px solid #e94560",
            bgcolor: "rgba(233,69,96,0.05)",
            px: 2,
            py: 1.5,
            mb: 2,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#999", mb: 0.5 }}>
            DISCUSSION TITLE
          </Typography>
          <Typography sx={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: 900, color: "#1a1a2e" }}>
            {summary.title}
          </Typography>
        </Box>

        {/* 概要 */}
        <Section title="■ 概要 / Overview">
          <Box sx={{ bgcolor: "#f8f8f8", border: "1px solid #e0e0e0", p: 1.5 }}>
            <Typography sx={{ fontFamily: "sans-serif", fontSize: "0.82rem", color: "#333", lineHeight: 1.8 }}>
              {summary.overview}
            </Typography>
          </Box>
        </Section>

        {/* 各偉人の主張 */}
        <Section title="■ 各偉人の主な主張 / Key Arguments">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {summary.keyPoints.map((kp, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  gap: 0,
                  borderBottom: "1px dotted #e0e0e0",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Box
                  sx={{
                    width: 110,
                    flexShrink: 0,
                    bgcolor: "#f0f0f0",
                    borderRight: "1px solid #ddd",
                    px: 1,
                    py: 0.75,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontFamily: "monospace", fontSize: "0.68rem", fontWeight: 700, color: "#1a1a2e" }}>
                    {kp.author}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, px: 1.5, py: 0.75 }}>
                  <Typography sx={{ fontFamily: "sans-serif", fontSize: "0.78rem", color: "#444", lineHeight: 1.6 }}>
                    {kp.point}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Section>

        {/* 合意点と対立点 */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
          <Section title="■ 合意点 / Agreements">
            <Box sx={{ border: "1px solid #006600", bgcolor: "#f0fff0" }}>
              {summary.agreements.length === 0 ? (
                <Typography sx={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#999", p: 1 }}>
                  特になし
                </Typography>
              ) : (
                summary.agreements.map((a, i) => (
                  <Box key={i} sx={{ px: 1.5, py: 0.75, borderBottom: i < summary.agreements.length - 1 ? "1px dotted #c0e0c0" : "none" }}>
                    <Typography sx={{ fontFamily: "sans-serif", fontSize: "0.75rem", color: "#004400", lineHeight: 1.6 }}>
                      ✓ {a}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Section>

          <Section title="■ 対立点 / Disagreements">
            <Box sx={{ border: "1px solid #cc0000", bgcolor: "#fff5f5" }}>
              {summary.disagreements.length === 0 ? (
                <Typography sx={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#999", p: 1 }}>
                  特になし
                </Typography>
              ) : (
                summary.disagreements.map((d, i) => (
                  <Box key={i} sx={{ px: 1.5, py: 0.75, borderBottom: i < summary.disagreements.length - 1 ? "1px dotted #e0c0c0" : "none" }}>
                    <Typography sx={{ fontFamily: "sans-serif", fontSize: "0.75rem", color: "#660000", lineHeight: 1.6 }}>
                      ✗ {d}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Section>
        </Box>

        {/* 注目の発言 */}
        <Section title="■ 注目の発言 / Featured Quote">
          <Box
            sx={{
              bgcolor: "#1a1a2e",
              border: "1px solid #e94560",
              px: 2,
              py: 1.5,
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontFamily: "serif",
                fontSize: "2rem",
                color: "#e94560",
                lineHeight: 1,
                mb: 0.5,
                opacity: 0.6,
              }}
            >
              "
            </Typography>
            <Typography
              sx={{
                fontFamily: "sans-serif",
                fontSize: "0.85rem",
                color: "#eee",
                lineHeight: 1.8,
                fontStyle: "italic",
                mb: 1,
              }}
            >
              {summary.quote.text}
            </Typography>
            <Typography sx={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#e94560", textAlign: "right" }}>
              — {summary.quote.author}
            </Typography>
          </Box>
        </Section>

        {/* 結論 */}
        <Section title="■ 総括 / Conclusion">
          <Box
            sx={{
              bgcolor: "#f8f8f8",
              border: "1px solid #c8c8c8",
              borderLeft: "4px solid #1a1a2e",
              px: 2,
              py: 1.5,
            }}
          >
            <Typography sx={{ fontFamily: "sans-serif", fontSize: "0.85rem", color: "#222", lineHeight: 1.85 }}>
              {summary.conclusion}
            </Typography>
          </Box>
        </Section>

        {/* フッター */}
        <Box sx={{ borderTop: "1px dashed #ddd", pt: 1, mt: 1, textAlign: "right" }}>
          <Typography sx={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#bbb" }}>
            Generated by 万P4n神th3殿on BBS — AI Summary System
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
