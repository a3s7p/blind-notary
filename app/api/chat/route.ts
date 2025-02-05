import { type CoreMessage, streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    console.log("API route called")
    const { messages }: { messages: CoreMessage[] } = await req.json()
    console.log("Received messages:", JSON.stringify(messages, null, 2))

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set")
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: "You are a helpful assistant.",
      messages,
    })

    console.log("Stream created successfully")
    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error("Streaming error:", error)
        return `Error: ${error.message || "An unknown error occurred"}`
      },
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An unknown error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

