"use client"

import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { useEffect } from "react"
import { ArrowUpIcon, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type React from "react"

export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
  const { messages, input, setInput, append, error } = useChat({
    api: "/api/chat",
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Submitting message:", input)
    void append({ content: input, role: "user" })
      .then(() => console.log("Message appended successfully"))
      .catch((err) => console.error("Error appending message:", err))
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const header = (
    <header className="m-auto flex flex-col gap-5 text-center">
      <h1 className="text-xl font-semibold leading-none tracking-tight">AI Chatbot</h1>
      <p className="text-muted-foreground text-xs">Send a message to get started.</p>
    </header>
  )

  const disclaimer = (
    <Alert variant="warning" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>This AI assistant is not a substitute for professional legal advice.</AlertDescription>
    </Alert>
  )

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      <div className="max-w-[90%] rounded-xl px-3 py-2 text-sm self-start bg-gray-100 text-black">
        Welcome to Blind Notary! I'm your AI assistant for document review. How can I assist you today?
      </div>
      {messages.map((message, index) => (
        <div
          key={index}
          data-role={message.role}
          className="max-w-[90%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
        >
          {message.content}
        </div>
      ))}
    </div>
  )

  useEffect(() => {
    if (error) {
      console.error("Chat error:", error)
    }
  }, [error])

  return (
    <TooltipProvider>
      <div className={cn("flex h-full flex-col", className)} {...props}>
        <div className="flex-1 overflow-y-auto p-4">
          {disclaimer}
          {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">Error: {error.message}</div>}
          {messageList}
        </div>
        <form
          onSubmit={handleSubmit}
          className="border-input bg-background focus-within:ring-ring/10 relative m-4 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
        >
          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={(v) => setInput(v)}
            value={input}
            placeholder="Enter a message"
            className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="absolute bottom-1 right-1 size-6 rounded-full">
                <ArrowUpIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Submit</TooltipContent>
          </Tooltip>
        </form>
      </div>
    </TooltipProvider>
  )
}

