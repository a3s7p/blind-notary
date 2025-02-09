"use client";

import { Button } from "@/components/ui/button";
import { DoorClosedIcon, DoorOpenIcon } from "lucide-react";
import { newChat } from "@/app/actions";
import { useState } from "react";

export default function Door() {
  "use client";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {isHovered ? <DoorOpenIcon size={120} /> : <DoorClosedIcon size={120} />}
      <form action={newChat}>
        <Button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Enter the office
        </Button>
      </form>
    </>
  );
}
