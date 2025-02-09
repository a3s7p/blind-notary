import { z } from "zod";

export const ProviderSchema = z
  .enum(["gaia", "hyperbolic", "openai"])
  .transform((name) => ({ name }))
  .pipe(
    z.discriminatedUnion("name", [
      z.object({
        name: z.literal("gaia"),
        envvar: z.literal("GAIA_API_KEY").default("GAIA_API_KEY"),
        model: z
          .enum(["llama", "llama3b", "qwen7b", "qwen72b"])
          .default("llama"),
        baseUrl: z
          .enum([
            "https://llama8b.gaia.domains/v1",
            "https://llama3b.gaia.domains/v1",
            "https://qwen7b.gaia.domains/v1",
            "https://qwen72b.gaia.domains/v1",
          ])
          .default("https://llama8b.gaia.domains/v1"),
        embedding: z.enum(["nomic-embed"]),
      }),
      z.object({
        name: z.literal("hyperbolic"),
        envvar: z.literal("HYPERBOLIC_API_KEY").default("HYPERBOLIC_API_KEY"),
        model: z
          .enum([
            "NousResearch/Hermes-3-Llama-3.1-70B",
            "meta-llama/Meta-Llama-3.1-8B-Instruct",
            "meta-llama/Meta-Llama-3.1-70B-Instruct",
            "meta-llama/Meta-Llama-3.1-405B-Instruct",
            "meta-llama/Llama-3.2-3B-Instruct",
            "meta-llama/Llama-3.3-70B-Instruct",
            "meta-llama/Meta-Llama-3-70B-Instruct",
            "deepseek-ai/DeepSeek-R1",
            "deepseek-ai/DeepSeek-R1-Zero",
            "deepseek-ai/DeepSeek-V2.5",
            "Qwen/Qwen2.5-72B-Instruct",
            "Qwen/QwQ-32B-Preview",
          ])
          .default("meta-llama/Llama-3.3-70B-Instruct"),
        baseUrl: z
          .enum(["https://api.hyperbolic.xyz/v1"])
          .default("https://api.hyperbolic.xyz/v1"),
        embedding: z
          .enum(["nomic-embed-text-v1.5"])
          .default("nomic-embed-text-v1.5"),
      }),
      z.object({
        name: z.literal("openai"),
        envvar: z.literal("OPENAI_API_KEY").default("OPENAI_API_KEY"),
        model: z
          .enum([
            "gpt-4o",
            "gpt-4o-mini",
            "chatgpt-4o-latest",
            "o1",
            "o1-mini",
            "o1-preview",
            "o3-mini",
          ])
          .default("gpt-4o-mini"),
        baseUrl: z
          .enum(["https://api.openai.com/v1"])
          .default("https://api.openai.com/v1"),
        embedding: z
          .enum([
            "text-embedding-3-large",
            "text-embedding-3-small",
            "text-embedding-ada-002",
          ])
          .default("text-embedding-3-large"),
      }),
    ]),
  );

export type ProviderConfig = z.infer<typeof ProviderSchema>;

export const DefaultProvider: ProviderConfig = (() =>
  ProviderSchema.parse("openai"))();
