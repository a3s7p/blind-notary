import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import * as fs from "fs";
import { initModel } from "./initModel";
import { initAgentKit } from "./initAgentKit";

// File with the system prompt
export const SYSTEM_PROMPT_FILE = "system_prompt.txt";

/**
 * Initialize the ReAct Agent using the LLM and CDP AgentKit tools
 *
 * @returns Agent executor
 */
export async function initAgent() {
  try {
    return createReactAgent({
      llm: await initModel(),
      tools: await initAgentKit(),
      checkpointSaver: new MemorySaver(),
      stateModifier: (() => {
        if (fs.existsSync(SYSTEM_PROMPT_FILE)) {
          try {
            return fs.readFileSync(SYSTEM_PROMPT_FILE, "utf8");
          } catch (error) {
            console.warn("Could not read system prompt:", error);
            // Continue without system prompt but warn
          }
        }
      })(),
    });
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error; // Re-throw to be handled by caller
  }
}
