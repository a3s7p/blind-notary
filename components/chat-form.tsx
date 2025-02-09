"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
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
  const { messages, input, setInput, error, handleSubmit } = useChat({
    initialMessages: [], // TODO load history
    onToolCall({ toolCall }) {
      console.log("tool called on client", toolCall);
    },
  });

  // file uploads
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  // send something to agent

  const handleSubmitWrapper = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    console.log("Submitting message:", input);

    handleSubmit(e, {
      experimental_attachments: files || undefined,
      allowEmptySubmit: false,
    });

    setFiles(null);
  };

  // send message

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitWrapper(e);
    }
  };

  // send file

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      <MarkdownMessage
        role="assistant"
        content="Welcome! I'm Blind Notary, your AI assistant for document signing and
        review. What can I help you with?"
      />

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
          onSubmit={handleSubmitWrapper}
          className="border-input bg-background focus-within:ring-ring/10 relative m-4 flex items-center rounded-[16px] border px-3 py-1.5 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
        >
          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Enter a message"
            className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
          />
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="size-6 rounded-full mr-1"
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
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
