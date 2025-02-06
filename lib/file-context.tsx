"use client";

import React from "react";
import { createContext, useState, useContext } from "react";

interface FileContextType {
  hasFile: boolean;
  setHasFile: (hasFile: boolean) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [hasFile, setHasFile] = useState(false);

  return (
    <FileContext.Provider value={{ hasFile, setHasFile }}>
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
