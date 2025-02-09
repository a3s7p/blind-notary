import { MemorySaver } from "@langchain/langgraph";
import { z } from "zod";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import * as fs from "fs";
import { initModel } from "./initModel";
import { initAgentKit } from "./initAgentKit";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// File with the system prompt
export const SYSTEM_PROMPT_FILE = "system_prompt.txt";

/**
 * Initialize the ReAct Agent using the LLM and CDP AgentKit tools
 *
 * @returns Agent executor
 */
export async function initAgent() {
  try {
    const llm = await initModel();

    const vectorStore = new MemoryVectorStore(
      new OpenAIEmbeddings({
        // TODO replace
        model: "text-embedding-3-large",
      }),
    );

    const retriever = vectorStore.asRetriever({
      k: 10,
      tags: ["pdf", "document"],
      metadata: { pdf_uploaded: true },
    });
    const msearchTool = retriever.asTool({
      name: "doc_msearch",
      description: "RAG-search vector store based on uploaded PDF file",
      schema: z
        .string()
        .describe("RAG-search vector store based on uploaded PDF file"),
    });

    const tools = [msearchTool, ...(await initAgentKit())];

    console.log(
      "Available agent tools:",
      tools.map((v) => v.name),
    );

    const checkpointSaver = new MemorySaver();

    const stateModifier = (() => {
      if (fs.existsSync(SYSTEM_PROMPT_FILE)) {
        try {
          return fs.readFileSync(SYSTEM_PROMPT_FILE, "utf8");
        } catch (error) {
          console.warn("Could not read system prompt:", error);
          // Continue without system prompt but warn
        }
      }
    })();

    return {
      agent: createReactAgent({ llm, tools, checkpointSaver, stateModifier }),
      // expose VS to add documents from API route
      vectorStore,
    };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error; // Re-throw to be handled by caller
  }
}
