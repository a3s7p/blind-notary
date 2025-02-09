import { ChatOpenAI } from "@langchain/openai";
import { DefaultProvider, ProviderConfig } from "@/app/ProviderConfig";

/**
 * Initialize preferred LLM based on host and model
 *
 * @returns Chat model object
 */
export async function initModel(cfg: ProviderConfig = DefaultProvider) {
  return new ChatOpenAI({
    model: cfg.model,
    configuration: {
      apiKey: process.env[cfg.envvar],
      baseURL: cfg.baseUrl,
    },
  });
}
