import { NextRequest } from "next/server";

export const runtime = "edge";

type ChatMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

type RequestBody = {
  topic: string;
  agentSystemPrompt: string;
  agentName: string;
  conversationHistory: { role: string; content: string }[];
  contextDepth: number;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response("GEMINI_API_KEY is not set", { status: 500 });
  }

  const body: RequestBody = await req.json();
  const { topic, agentSystemPrompt, agentName, conversationHistory, contextDepth } = body;

  const maxHistory = contextDepth === 0 ? 0 : conversationHistory.length;
  const trimmedHistory = conversationHistory.slice(-maxHistory);

  const systemInstruction = `${agentSystemPrompt}

議題: 「${topic}」

あなたは今、様々な時代・分野の偉人たちと議論しています。
自分の立場・時代・価値観に基づいて、議題に対する意見を述べてください。
他の参加者の発言に対して反応し、建設的な議論を進めてください。
発言は150〜300文字程度で、必ず文章を完結させてください（途中で切れないこと）。
自己紹介は不要です。直接議論の内容を話してください。`;

  const contents: ChatMessage[] = trimmedHistory.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: `${msg.content}` }],
  }));

  if (contents.length === 0) {
    contents.push({
      role: "user",
      parts: [{ text: `${agentName}として、議題「${topic}」についてあなたの最初の見解を述べてください。` }],
    });
  } else {
    contents.push({
      role: "user",
      parts: [{ text: `${agentName}として、この議論に対するあなたの見解を続けてください。` }],
    });
  }

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents,
        generationConfig: {
          temperature: 1.0,
          maxOutputTokens: 1024,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      }),
    }
  );

  if (!geminiRes.ok) {
    const errJson = await geminiRes.json().catch(() => null);
    const statusCode = geminiRes.status;
    const message =
      errJson?.error?.message ?? "Gemini API request failed";
    return new Response(
      JSON.stringify({ error: message, status: statusCode }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = geminiRes.body!.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const text =
                  parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(new TextEncoder().encode(text));
                }
              } catch {
                // ignore parse errors
              }
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
