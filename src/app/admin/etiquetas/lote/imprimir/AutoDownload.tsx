"use client";

import { useEffect, useRef } from "react";

export function AutoDownload({ href }: { href: string }) {
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;
    const link = document.createElement("a");
    link.href = href;
    link.download = "etiquetas.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [href]);

  return null;
}
