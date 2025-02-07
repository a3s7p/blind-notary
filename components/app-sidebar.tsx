import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { ChatForm } from "@/components/chat-form";

export function AppSidebar() {
  return (
    <Sidebar side="right" className="w-[15%]">
      <SidebarContent>
        <ChatForm />
      </SidebarContent>
    </Sidebar>
  );
}
