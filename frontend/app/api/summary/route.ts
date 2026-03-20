import { NextRequest } from "next/server";

export const runtime = "edge";

type RequestBody = {
  topic: string;
  messages: { agentNameJa: string; content: string }[];
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY is not set" }),
      { status: 500 },
    );
  }

  const body: RequestBody = await req.json();
  const { topic, messages } = body;

  const transcript = messages
    .map((m, i) => `[${i + 1}] ${m.agentNameJa}: ${m.content}`)
    .join("\n\n");

  const prompt = `以下は「${topic}」という議題について、様々な時代の偉人たちが行った議論の全記録です。

---
${transcript}
---

この議論を以下の形式でJSON形式でまとめてください。日本語で回答してください。

{
  "title": "議論のタイトル（議題を簡潔に）",
  "overview": "議論全体の概要（150字程度）",
  "keyPoints": [
    { "author": "偉人名", "point": "その偉人の主な主張（60字程度）" }
  ],
  "agreements": ["合意点1", "合意点2"],
  "disagreements": ["対立点1", "対立点2"],
  "conclusion": "議論の結論・総括（200字程度）",
  "quote": { "author": "最も印象的な発言をした偉人名", "text": "その発言の抜粋" }
}

JSONのみを返してください。マークダウンのコードブロックは不要です。`;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    },
  );

  if (!geminiRes.ok) {
    const errJson = await geminiRes.json().catch(() => null);
    return new Response(
      JSON.stringify({ error: errJson?.error?.message ?? "Gemini API error" }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  const data = await geminiRes.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // JSONを抽出（```json ... ``` で囲まれている場合も対応）
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return new Response(JSON.stringify({ error: "Failed to parse summary" }), {
      status: 500,
    });
  }

  try {
    const summary = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(summary), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON from Gemini" }), {
      status: 500,
    });
  }
}
