import { cn } from "@/lib/utils";
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
        <div className="flex h-svh w-full">{children}</div>
      </body>
    </html>
  );
}
