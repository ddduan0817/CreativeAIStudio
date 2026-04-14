import { getSceneMockResponses } from "@/data/mockAIResponses";
import { simulateAIStream } from "@/lib/aiSimulator";

export type StreamCallback = (text: string, done: boolean) => void;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Track consecutive failures to auto-fallback
let consecutiveFailures = 0;
const MAX_FAILURES_BEFORE_FALLBACK = 2;

function fallbackToMock(
  scene: string,
  assistantCount: number,
  onUpdate: StreamCallback
): { cancel: () => void } {
  type SceneType = "novel" | "screenplay" | "marketing" | "knowledge" | "general";
  const mockData = getSceneMockResponses(scene as SceneType);
  const response =
    mockData.chatResponses[assistantCount % mockData.chatResponses.length];
  return simulateAIStream(response, onUpdate);
}

export function streamGeminiChat(
  messages: ChatMessage[],
  scene: string,
  onUpdate: StreamCallback
): { cancel: () => void } {
  const assistantCount = messages.filter((m) => m.role === "assistant").length;

  // If API has been failing repeatedly, go straight to mock
  if (consecutiveFailures >= MAX_FAILURES_BEFORE_FALLBACK) {
    return fallbackToMock(scene, assistantCount, onUpdate);
  }

  let cancelled = false;
  const controller = new AbortController();
  let fallbackHandle: { cancel: () => void } | null = null;

  (async () => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, scene }),
        signal: controller.signal,
      });

      if (!res.ok) {
        // API failed, fallback to mock
        consecutiveFailures++;
        if (!cancelled) {
          fallbackHandle = fallbackToMock(scene, assistantCount, onUpdate);
        }
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (cancelled) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              accumulated += parsed.text;
              if (!cancelled) onUpdate(accumulated, false);
            }
          } catch {
            // skip
          }
        }
      }

      if (!cancelled) {
        if (accumulated) {
          consecutiveFailures = 0; // reset on success
          onUpdate(accumulated, true);
        } else {
          // Empty response, fallback
          consecutiveFailures++;
          fallbackHandle = fallbackToMock(scene, assistantCount, onUpdate);
        }
      }
    } catch (err) {
      if (!cancelled) {
        consecutiveFailures++;
        // Network error / abort - fallback to mock silently
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          fallbackHandle = fallbackToMock(scene, assistantCount, onUpdate);
        }
      }
    }
  })();

  return {
    cancel: () => {
      cancelled = true;
      controller.abort();
      fallbackHandle?.cancel();
    },
  };
}
