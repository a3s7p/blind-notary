import { ChatOpenAI } from "@langchain/openai";

/**
 * Initialize preferred LLM based on host and model
 *
 * @returns Chat model object
 */

export async function initModel() {
  // TODO allow customization
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
  });

  return model;
}
