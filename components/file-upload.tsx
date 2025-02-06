"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useFile } from "@/lib/file-context";

export function FileUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  const { setHasFile } = useFile();

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file);
    setHasFile(true);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
      setFileUploaded(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
      setFileUploaded(true);
    }
  };

  return fileUploaded ? null : (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors ${
        dragActive ? "border-primary bg-primary/10" : "border-gray-300"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Upload className="mb-4 h-10 w-10 text-gray-400" />
      <Button variant="outline" className="relative">
        Upload a PDF document to get started
        <input
          type="file"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={handleChange}
          accept=".pdf"
        />
      </Button>
      <p className="mt-2 text-sm text-gray-500">or drop your file here</p>
    </div>
  );
}
