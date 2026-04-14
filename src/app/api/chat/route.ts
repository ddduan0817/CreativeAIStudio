import { NextRequest } from "next/server";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent";

const SYSTEM_PROMPT = `你是 CreativeAI Studio 的创意写作助手。你擅长：
- 帮助用户构思小说、剧本、营销文案等创意内容
- 提供写作建议、情节推进、人物塑造等方面的指导
- 润色、改写、续写用户的文本
- 用专业但亲切的语气回答问题
请用中文回答，回复要简洁有帮助。`;

export async function POST(req: NextRequest) {
  const { messages, scene } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sceneHints: Record<string, string> = {
    novel: "当前用户正在创作小说。",
    screenplay: "当前用户正在创作剧本/短剧。",
    marketing: "当前用户正在创作营销种草文案。",
    knowledge: "当前用户正在创作知识专栏/书评。",
    general: "当前用户在进行通用写作。",
  };

  const contents = [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT + "\n\n" + (sceneHints[scene] || "") }],
    },
    { role: "model", parts: [{ text: "好的，我是你的创意写作助手，随时可以帮你！" }] },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  ];

  const url = `${GEMINI_API_URL}?key=${apiKey}&alt=sse`;

  const geminiRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    return new Response(JSON.stringify({ error: errText }), {
      status: geminiRes.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = geminiRes.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr || jsonStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const text =
                parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (text) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                );
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: String(err) })}\n\n`
          )
        );
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
