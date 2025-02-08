import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { FileProvider } from "@/lib/file-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blind Notary",
  description: "A document review and chat application using AI.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn("flex min-h-svh flex-col antialiased", inter.className)}
      >
        <TooltipProvider delayDuration={0}>
          <SidebarProvider>
            <FileProvider>
              <div className="flex h-svh w-full">{children}</div>
            </FileProvider>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
