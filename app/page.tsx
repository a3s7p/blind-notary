"use client";

import { Button } from "@/components/ui/button";

import { DoorClosedIcon, DoorOpenIcon } from "lucide-react";

import { useState } from "react";
import { newChat } from "./actions";

export default function Page() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
            Blind Notary
          </h1>

          {isHovered ? (
            <DoorOpenIcon size={120} />
          ) : (
            <DoorClosedIcon size={120} />
          )}

          <form action={newChat}>
            <Button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Enter the office
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
