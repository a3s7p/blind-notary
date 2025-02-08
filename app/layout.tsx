import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blind Notary",
  description:
    "Privacy-first AI document review, signing and chat application.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn("flex min-h-svh flex-col antialiased", inter.className)}
      >
        <TooltipProvider delayDuration={0}>
          <div className="flex h-svh w-full">{children}</div>
        </TooltipProvider>
      </body>
    </html>
  );
}
