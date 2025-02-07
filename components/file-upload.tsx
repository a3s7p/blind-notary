"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useFile } from "@/lib/file-context";
// import { fromVault, toVault } from "@/app/actions";

export function FileUpload() {
  const { setFileId, setFileData } = useFile();
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    // TODO enable this
    // const res = await toVault(file.name, await file.bytes());
    // if (!res.ok) {
    //   // TODO toast
    //   console.log("Error while uploading file:", res.message);
    //   return;
    // }

    // setFileId(res.value);
    // // TODO optimize
    // const newFile = await fromVault(res.value);

    // if (!newFile.ok) {
    //   // TODO toast
    //   console.log("Error while downloading file:", newFile.message);
    //   return;
    // }

    // setFileData(newFile.value);
    setFileId("dummy");
    setFileData(file);
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
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full justify-evenly">
      <div className="text-center my-auto">
        <h1 className="text-4xl font-bold text-black tracking-tight">
          Welcome to Blind Notary
        </h1>
        <p className="mt-4 text-xl text-gray-900">
          Your private AI-powered signing assistant
        </p>
      </div>
      <div className="w-full max-w-lg my-auto">
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
      </div>
    </div>
  );
}
