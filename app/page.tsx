"use client";

import { FileUpload } from "@/components/file-upload";
import { useFile } from "@/lib/file-context";
import { PDFViewer } from "@/components/pdf-viewer";
import { AppSidebar } from "@/components/app-sidebar";
import { LeftSidebar } from "@/components/left-sidebar";

export default function Page() {
  const { fileId } = useFile();

  return (
    <>
      {fileId && <LeftSidebar />}
      <main className="flex-1 overflow-auto">
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
          {fileId ? <PDFViewer /> : <FileUpload />}
        </div>
      </main>
      {fileId && <AppSidebar />}
    </>
  );
}
