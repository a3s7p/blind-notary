"use client";

import { useChat } from "ai/react";
import { useEffect } from "react";
import { ArrowUpIcon, AlertTriangle, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { AutoResizeTextarea } from "@/components/autoresize-textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type React from "react";
import { MarkdownMessage } from "@/app/markdownMessage";

export function ChatForm() {
  const { messages, input, setInput, append, error } = useChat();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Submitting message:", input);

    void append({ content: input, role: "user" })
      .then(() => console.log("Message appended successfully"))
      .catch((err) => console.error("Error appending message:", err));

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      <div className="max-w-[90%] rounded-xl px-3 py-2 text-sm self-start bg-gray-100 text-black">
        Welcome! I'm Blind Notary, your AI assistant for document signing and
        review. What can I help you with?
      </div>
      {messages.map((message, index) => (
        <MarkdownMessage
          key={index}
          content={message.content}
          role={message.role}
        />
      ))}
    </div>
  );

  // TODO toast
  useEffect(() => {
    if (error) {
      console.error("Chat error:", error);
    }
  }, [error]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col w-full md:w-3/4">
        <div className="flex-1 overflow-y-auto p-4">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This AI assistant is not a substitute for professional legal
              advice.
            </AlertDescription>
          </Alert>

          {messageList}
        </div>
        <form
          onSubmit={handleSubmit}
          className="border-input bg-background focus-within:ring-ring/10 relative m-4 flex items-center rounded-[16px] border px-3 py-1.5 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
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
              <Button
                variant="ghost"
                size="sm"
                className="size-6 rounded-full mr-1"
              >
                <FileIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Upload PDF</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="size-6 rounded-full">
                <ArrowUpIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Send Message</TooltipContent>
          </Tooltip>
        </form>
      </div>
    </TooltipProvider>
  );
}
