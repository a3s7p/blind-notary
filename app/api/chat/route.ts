import { LangChainAdapter, Message } from "ai";
import {
  AIMessage,
  HumanMessage,
  isAIMessageChunk,
} from "@langchain/core/messages";
import { initAgent } from "./initAgent";
import { validateEnvironment } from "./validateEnvironment";

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

    const stream = await (
      await AGENT()
    ).stream(
      {
        messages: messages.map((message) =>
          message.role == "user"
            ? new HumanMessage(message.content)
            : new AIMessage(message.content),
        ),
      },
      {
        configurable: { thread_id: "Blind Notary Demo Chat" },
        streamMode: "messages",
      },
    );

    console.log("Stream created successfully");

    // Convert LangChain message chunks into AI SDK messages
    const transformStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const [msgchunk, meta] = chunk;
          console.log("sending chunk:", msgchunk, meta);

          if (isAIMessageChunk(msgchunk) && "content" in msgchunk) {
            controller.enqueue({
              content: msgchunk.content,
              role: "assistant",
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
