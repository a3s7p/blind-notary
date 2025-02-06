"use client";

import { FileUpload } from "@/components/file-upload";

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
      <FileUpload />
    </div>
  );
}
