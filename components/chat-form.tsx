"use client";

import { Message, useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpIcon,
  AlertTriangle,
  FileCheckIcon,
  PaperclipIcon,
  FileIcon,
  ClipboardCopyIcon,
} from "lucide-react";
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
import { Input } from "./ui/input";

type ChatFormProps = {
  chatId: string;
  chatKey: string;
  messages: Message[];
};

export function ChatForm(props: ChatFormProps) {
  const { messages, input, handleInputChange, error, handleSubmit } = useChat({
    initialMessages: [], // TODO load history
    onToolCall({ toolCall }) {
      console.log("tool called on client", toolCall);
    },
    experimental_prepareRequestBody(options) {
      return { ...options, id: props.chatId, metadata: props };
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
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    console.log("Submitting message:", input, files?.length);

    handleSubmit(e, {
      experimental_attachments: files || undefined,
      body: {
        filename: files ? files[0].name : undefined,
      },
      allowEmptySubmit: true,
    });

    setFiles(null);
  };

  // send message with enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitWrapper(e);
    }
  };

  const messageList = (
    <div className="my-4 flex h-full flex-col gap-4">
      <MarkdownMessage
        role="assistant"
        content="Welcome! I'm Blind Notary. How can I help you?"
      />

      {messages.map((message, index) => {
        if (message.experimental_attachments) {
          return (
            <div
              key={index}
              data-role="user"
              className="flex max-w-[90%] rounded-xl px-3 py-2 text-sm self-end bg-primary text-secondary"
            >
              <FileIcon size={16} className="mr-1" />
              {message.experimental_attachments[0].name}
            </div>
          );
        } else {
          return (
            <MarkdownMessage
              key={index}
              content={message.content}
              role={message.role}
            />
          );
        }
      })}
    </div>
  );

  // TODO toast
  useEffect(() => {
    if (error) {
      console.error("Chat error:", error);
    }
  }, [error]);

  const suggestions = ["Lorem", "ipsum", "dolorem"];

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
          id="msgForm"
          onSubmit={handleSubmitWrapper}
          className="border-input bg-background focus-within:ring-ring/10 relative m-4 flex items-center rounded-[16px] border px-3 py-1.5 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
        >
          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            value={input}
            placeholder={"Enter a message or attach file"}
            className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
          />

          <Input
            id="uploadFile"
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
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
                {files ? (
                  <FileCheckIcon size={16} />
                ) : (
                  <PaperclipIcon size={16} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>
              {files ? "Replace PDF" : "Attach PDF"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="size-6 rounded-full"
                disabled={!input && !files}
              >
                <ArrowUpIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Send</TooltipContent>
          </Tooltip>
        </form>
        <div className="mx-4 flex justify-between items-center rounded-[16px] px-3 text-sm">
          <div className="flex gap-3">
            {suggestions.map((v) => (
              <Button
                key={v}
                variant={"outline"}
                size="sm"
                className="rounded-full"
              >
                {v}
              </Button>
            ))}
          </div>
          <div className="flex items-center text-neutral-500 gap-2 hover:text-neutral-200">
            Chat ID: <b>{props.chatId}</b>
            <ClipboardCopyIcon size={16} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
