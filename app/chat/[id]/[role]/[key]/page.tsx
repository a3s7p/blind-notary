import { getHistory } from "@/app/actions";
import { ChatForm } from "@/components/chat-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; role: string; key: string }>;
}) {
  const { id, key } = await params;
  const hist = await getHistory(id);

  if (!key) {
    throw new Error("No key, no entry.");
  }

  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
          <ChatForm chatId={id} chatKey={key} messages={hist} />
        </div>
      </main>
    </>
  );
}
