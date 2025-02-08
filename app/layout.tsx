import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blind Notary",
  description:
    "Privacy-first AI document review, signing and chat application.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("flex min-h-svh flex-col antialiased", inter.className)}
      >
        <ThemeProvider attribute="class" enableSystem>
          <ThemeSwitcher />
          <div className="flex h-svh w-full">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
