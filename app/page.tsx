"use client";

import { FileUpload } from "@/components/file-upload";

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Blind Notary!
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Your AI-powered document review assistant
        </p>
      </div>
      <div className="w-full max-w-lg">
        <FileUpload />
      </div>
    </div>
  );
}
