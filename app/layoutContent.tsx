"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { LeftSidebar } from "@/components/left-sidebar";
import { useFile } from "@/lib/file-context";
import { ReactNode } from "react";

export function LayoutContent({ children }: { children: ReactNode }) {
  const { hasFile } = useFile();

  return (
    <div className="flex h-svh w-full">
      {hasFile && <LeftSidebar />}
      <main className="flex-1 overflow-auto">{children}</main>
      {hasFile && <AppSidebar />}
    </div>
  );
}
