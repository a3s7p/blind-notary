import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MarkdownMessageProps {
  content: string;
  role: "data" | "user" | "assistant" | "system";
  hash: string;
}

export function MarkdownMessage({ content, role, hash }: MarkdownMessageProps) {
  const position = role === "assistant" ? "right" : "left";

  return (
    <div
      data-role={role}
      data-hash={hash}
      className="max-w-[90%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-secondary data-[role=user]:bg-primary data-[role=user]:text-secondary"
    >
      <div className="flex items-center">
        <ReactMarkdown
          className={cn(
            "prose prose-sm max-w-none",
            "prose-p:leading-normal prose-p:my-1",
            "prose-pre:my-1 prose-pre:p-2 prose-pre:bg-gray-800 prose-pre:text-gray-100",
            "prose-code:text-gray-800 data-[role=user]:prose-code:text-gray-100",
            "prose-ul:my-1 prose-li:my-0",
            "prose-a:text-blue-500 data-[role=user]:prose-a:text-blue-200",
          )}
        >
          {content}
        </ReactMarkdown>

        <Tooltip>
          <TooltipTrigger>
            <Info size={16} className="ml-2" />
          </TooltipTrigger>
          <TooltipContent side={position}>
            <b>Message hash:</b> <code>{hash}</code>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
