import Door from "@/components/door";

export default function Page() {
  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
            Blind Notary
          </h1>

          <Door />
        </div>
      </main>
    </>
  );
}
