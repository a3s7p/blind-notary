"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useEffect, type TextareaHTMLAttributes } from "react";

export function AutoResizeTextarea({
  className,
  value,
  onChange,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [value]);

  return (
    <textarea
      {...props}
      value={value}
      ref={textareaRef}
      rows={1}
      onChange={(e) => {
        onChange && onChange(e);
        resizeTextarea();
      }}
      className={cn("resize-none min-h-4 max-h-80", className)}
    />
  );
}
