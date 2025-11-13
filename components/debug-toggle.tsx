"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

export function DebugToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = () => {
    if (pathname === "/") {
      router.push("/editor?file=sample_audio.mp3");
    } else {
      router.push("/");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
    >
      <Wand2 className="h-4 w-4" />
      <span className="sr-only">Debug Toggle</span>
    </Button>
  );
}
