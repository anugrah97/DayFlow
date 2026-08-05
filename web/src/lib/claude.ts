import Anthropic from "@anthropic-ai/sdk"
import type { CalendarEvent } from "@/lib/google-calendar"
import {
  buildOptimizeUserMessage,
  OPTIMIZE_SYSTEM_PROMPT,
  parseOptimizeResponse,
  type OptimizeResponse,
} from "@/lib/optimization"
import type { Task } from "@/store/planner"

const DEFAULT_MODEL = "claude-sonnet-4-6"

export function createAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured")
  }
  return new Anthropic({ apiKey })
}

export async function optimizeDaySchedule(
  events: CalendarEvent[],
  tasks: Task[],
  client?: Anthropic
): Promise<OptimizeResponse> {
  const anthropic = client ?? createAnthropicClient()
  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 2048,
    system: OPTIMIZE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildOptimizeUserMessage(events, tasks),
      },
    ],
  })

  const textBlock = message.content.find((block) => block.type === "text")
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no text content")
  }

  return parseOptimizeResponse(textBlock.text)
}
