import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownMessageProps {
  content: string;
  role: "data" | "user" | "assistant" | "system";
}

export function MarkdownMessage({ content, role }: MarkdownMessageProps) {
  return (
    <div
      data-role={role}
      className="max-w-[90%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
    >
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
    </div>
  );
}
