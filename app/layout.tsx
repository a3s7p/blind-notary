import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { LeftSidebar } from "@/components/left-sidebar"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Blind Notary",
  description: "A document review and chat application using AI.",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("flex min-h-svh flex-col antialiased", inter.className)}>
        <TooltipProvider delayDuration={0}>
          <SidebarProvider>
            <div className="flex h-svh">
              <LeftSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
              <AppSidebar />
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}



import './globals.css'