import { LangChainAdapter, Message, CreateMessage } from "ai";
import {
  AIMessage,
  BaseMessageChunk,
  ChatMessage,
  HumanMessage,
  isAIMessageChunk,
  isToolMessageChunk,
} from "@langchain/core/messages";
import { initAgent } from "./initAgent";
import { validateEnvironment } from "./validateEnvironment";
import { Messages } from "@langchain/langgraph";

// Right after imports and before any other code
validateEnvironment();

// Lazily initialize agent only once
const AGENT = (() => {
  let agent: ReturnType<typeof initAgent>;
  return () => (agent = agent || initAgent());
})();

export async function POST(req: Request) {
  try {
    console.log("API chat route called");

    const { messages }: { messages: Message[] } = await req.json();

    console.log(
      "Received messages from client:",
      JSON.stringify(messages, null, 2),
    );

    const lcMessages: Messages = messages
      .filter((v: Message) => v.role == "user" || v.role == "assistant")
      .map((v: Message) =>
        v.role == "user"
          ? new HumanMessage(v.content)
          : v.role == "assistant"
            ? new AIMessage(v.content)
            : new ChatMessage(v.content, v.role),
      );

    console.log(
      "Converted to LC messages:",
      JSON.stringify(lcMessages, null, 2),
    );

    const stream = await (
      await AGENT()
    ).stream(
      { messages: lcMessages },
      {
        configurable: { thread_id: "Blind Notary Demo Chat" },
        streamMode: "messages",
      },
    );

    console.log("Stream created successfully");

    // Convert LangChain message chunks into AI SDK messages
    const transformStream = new ReadableStream<CreateMessage>({
      async start(controller) {
        for await (const chunk of stream) {
          const msgchunk: BaseMessageChunk = chunk[0];
          // chunk[1] is LC metadata

          if ("content" in msgchunk && isAIMessageChunk(msgchunk)) {
            controller.enqueue({
              id: msgchunk.id,
              content: msgchunk.content.toString(),
              role: "assistant",
              parts: [
                { type: "text", text: msgchunk.content.toString() },
                ...(msgchunk.tool_calls?.map((v) => ({
                  type: "tool-invocation" as const,
                  toolInvocation: {
                    state: "call" as const,
                    toolCallId: v.id || "",
                    toolName: v.name,
                    args: v.args,
                  },
                })) || []),
              ],
            });
          } else if (isToolMessageChunk(msgchunk)) {
            controller.enqueue({
              id: msgchunk.id,
              content: "",
              role: "assistant",
              parts: [
                {
                  type: "tool-invocation" as const,
                  toolInvocation: {
                    state: "result" as const,
                    toolCallId: msgchunk.tool_call_id,
                    toolName: msgchunk.name || "",
                    args: msgchunk.additional_kwargs,
                    result: msgchunk.content.toString(),
                  },
                },
              ],
            });
          }
        }

        controller.close();
      },
    });

    return LangChainAdapter.toDataStreamResponse(transformStream);
  } catch (error) {
    console.error("Error in chat API:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
