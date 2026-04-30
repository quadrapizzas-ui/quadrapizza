"use client"
import React, { useEffect } from "react";

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  return (
    <div className="fixed-layout bg-zinc-950 text-zinc-50 font-sans">
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
