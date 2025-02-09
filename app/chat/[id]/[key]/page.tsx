import { ChatForm } from "@/components/chat-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; key: string }>;
}) {
  const { id, key } = await params;

  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
          <ChatForm chatId={id} chatKey={key} />
        </div>
      </main>
    </>
  );
}
