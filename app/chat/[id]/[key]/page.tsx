import { ChatForm } from "@/components/chat-form";

export default function Page() {
  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
          <ChatForm />
        </div>
      </main>
    </>
  );
}
