"use client";

import React from "react";
import { createContext, useState, useContext } from "react";

interface FileContextType {
  hasFile: boolean;
  setHasFile: (hasFile: boolean) => void;
  fileData: string;
  setFileData: (data: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [hasFile, setHasFile] = useState(false);
  const [fileData, setFileData] = useState("");

  return (
    <FileContext.Provider
      value={{ hasFile, setHasFile, fileData, setFileData }}
    >
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
