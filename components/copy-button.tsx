"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={buttonClass("primary", "md")}
    >
      {copied ? "Đã copy" : "Copy link"}
    </button>
  );
}
