"use client";

import { Message, useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpIcon,
  AlertTriangle,
  FileCheckIcon,
  PaperclipIcon,
  FileIcon,
  HandshakeIcon,
  SignatureIcon,
  StampIcon,
  LinkIcon,
  CheckIcon,
} from "lucide-react";
import crypto from "crypto";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { AutoResizeTextarea } from "@/components/autoresize-textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type React from "react";
import { MarkdownMessage } from "@/app/markdownMessage";
import { Input } from "./ui/input";
import { appendObjectJSON } from "@/app/actions";

type ChatFormProps = {
  chatId: string;
  chatKey: string;
  messages: Message[];
};

export function ChatForm(props: ChatFormProps) {
  const { messages, input, append, handleInputChange, error, handleSubmit } =
    useChat({
      initialMessages: props.messages,
      onToolCall({ toolCall }) {
        console.log("tool called on client", toolCall);
      },
      onFinish(message) {
        setTimeout(
          async () => await appendObjectJSON(props.chatId, message.id, message),
        );
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

  const lastMessageHash = props.chatId;

  const messageList = (
    <div className="my-4 flex h-full flex-col gap-4">
      <MarkdownMessage
        role="assistant"
        content="Welcome! I'm **Blind Notary**. How can I help you?"
        hash={props.chatId}
      />

      {messages.reduce<React.ReactNode[]>((acc, message, index) => {
        const previousHash =
          index > 0
            ? crypto
                .createHash("sha1")
                .update(messages[index - 1].content)
                .digest("hex")
            : props.chatId;

        const currentHash = crypto
          .createHash("sha1")
          .update(message.content)
          .digest("hex");

        const totalHash = crypto
          .createHash("sha1")
          .update(previousHash + currentHash)
          .digest("hex");

        const element = message.experimental_attachments ? (
          <div
            key={index}
            data-role="user"
            className="flex max-w-[90%] rounded-xl px-3 py-2 text-sm self-end bg-primary text-secondary"
          >
            <FileIcon size={16} className="mr-1" />
            {message.experimental_attachments[0].name}
          </div>
        ) : (
          <MarkdownMessage
            key={index}
            content={message.content}
            role={message.role}
            hash={totalHash}
          />
        );

        return [...acc, element];
      }, [])}
    </div>
  );

  // TODO toast
  useEffect(() => {
    if (error) {
      console.error("Chat error:", error);
    }
  }, [error]);

  const commands = [
    {
      icon: <HandshakeIcon size={16} />,
      name: "Invite",
      desc: "Invite party to sign document together",
      send: `_<Invite to ${props.chatId}>_`,
    },
    {
      icon: <SignatureIcon size={16} />,
      name: "Sign",
      desc: "Provide your signature on this session",
      send: `_<SIGN: CHAT ID "${props.chatId}"; PARTY ID "${props.chatKey}"; LAST MESSAGE HASH "${lastMessageHash}">_`,
    },
    {
      icon: <StampIcon size={16} />,
      name: "Seal",
      desc: "Seal session and produce certificate",
      send: "_<Seal>_",
    },
  ];

  const [isChatIdCopied, setChatIdCopied] = useState(false);

  useEffect(() => {
    if (isChatIdCopied) {
      setTimeout(() => setChatIdCopied(false), 2000);
    }
  }, [isChatIdCopied]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col w-full md:w-3/4">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex w-full justify-between items-center gap-5">
            <Alert variant="destructive" className="w-3/4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Please note</AlertTitle>
              <AlertDescription>
                This AI assistant is not a substitute for professional legal
                advice.
              </AlertDescription>
            </Alert>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    navigator.clipboard.writeText(location.href);
                    setChatIdCopied(true);
                  }}
                >
                  {isChatIdCopied ? (
                    <>
                      <CheckIcon size={16} /> Copied!
                    </>
                  ) : (
                    <>
                      <LinkIcon size={16} /> Copy private link
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={12} className="text-center">
                Copy your unique access link to clipboard
                <br />
                Do NOT share it.
              </TooltipContent>
            </Tooltip>
          </div>

          {messageList}
        </div>

        <div className="mx-4 flex justify-between items-center rounded-[16px] text-sm">
          <div className="flex w-full items-center justify-center gap-3">
            {commands.map(({ icon, name, desc, send }) => (
              <Tooltip key={name}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      append({
                        role: "user",
                        content: send,
                      });
                    }}
                  >
                    {icon}
                    {name}
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={12}>{desc}</TooltipContent>
              </Tooltip>
            ))}
          </div>
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
                type="button"
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
      </div>
    </TooltipProvider>
  );
}
