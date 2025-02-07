"use client";

import { useFile } from "@/lib/file-context";

export function PDFViewer({}) {
  const { fileData } = useFile();

  if (!fileData) {
    return "Loading...";
  }

  const url = URL.createObjectURL(fileData);

  return (
    <div className="w-full h-full">
      <object className="w-full h-full" data={url} type="application/pdf">
        <embed src={url} type="application/pdf" />
      </object>
    </div>
  );
}
