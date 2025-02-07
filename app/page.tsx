"use client";

import { FileUpload } from "@/components/file-upload";
import { useFile } from "@/lib/file-context";
import { PDFViewer } from "@/components/pdf-viewer";

export default function Page() {
  const { fileId } = useFile();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
      {fileId ? <PDFViewer /> : <FileUpload />}
    </div>
  );
}
