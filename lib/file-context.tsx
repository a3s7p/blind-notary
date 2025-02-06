"use client";

import React from "react";
import { createContext, useState, useContext } from "react";

interface FileContextType {
  fileId: string;
  setFileId: (id: string) => void;
  fileData: Uint8Array | null;
  setFileData: (data: Uint8Array) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [fileId, setFileId] = useState("");
  const [fileData, setFileData] = useState<Uint8Array | null>(null);

  return (
    <FileContext.Provider value={{ fileId, setFileId, fileData, setFileData }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFile() {
  const context = useContext(FileContext);

  if (context === undefined) {
    throw new Error("useFile must be used within a FileProvider");
  }

  return context;
}
