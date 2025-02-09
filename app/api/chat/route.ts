import { LangChainAdapter, Message, CreateMessage } from "ai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
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
import { appendObject } from "@/app/actions";

// Right after imports and before any other code
validateEnvironment();

// Lazily initialize agent only once
const AGENT = (() => {
  let agent: ReturnType<typeof initAgent>;
  return () => (agent = agent || initAgent());
})();

export async function POST(req: Request) {
  try {
    const { id, messages }: { id: string; messages: Message[] } =
      await req.json();

    // this should only be slow the very first time
    const { agent, vectorStore } = await AGENT();

    // save last received message in nilDB for history
    const last = messages.at(-1);

    last
      ? await appendObject(
          id,
          last.id,
          new TextEncoder().encode(JSON.stringify(last)),
        )
      : null;

    for (const m of messages) {
      // load attachments into vector store
      for (const v of m.experimental_attachments || []) {
        const docBlob = await (await fetch(v.url)).blob();
        const loader = new PDFLoader(docBlob);
        const docs = await loader.load();
        const splitter = new RecursiveCharacterTextSplitter({
          // might need tweaking...
          chunkSize: 500,
          chunkOverlap: 100,
        });
        const splits = await splitter.splitDocuments(
          docs.map((d) => ({
            ...d,
            metadata: {
              ...d.metadata,
              // original filename
              name: v.name,
            },
          })),
        );
        await vectorStore.addDocuments(splits);
      }
    }

    // convert from AI SDK to LC message format and insert upload hint
    const lcMessages: Messages = messages
      .filter((v: Message) => v.role == "user" || v.role == "assistant")
      .map((v: Message) => {
        if (v.role == "assistant") {
          return new AIMessage(v.content);
        }

        if (v.role != "user") {
          return new ChatMessage(v.content, v.role);
        }

        // role is user
        return new HumanMessage(
          v.experimental_attachments
            ? v.content +
              `<PDF UPLOADED: ${v.experimental_attachments[0].name}>`
            : v.content,
        );
      });

    const stream = agent.streamEvents(
      { messages: lcMessages },
      {
        version: "v2",
        configurable: { thread_id: id },
      },
    );

    return LangChainAdapter.toDataStreamResponse(stream);
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
