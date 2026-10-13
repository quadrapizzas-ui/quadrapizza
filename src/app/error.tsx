"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our centralized logger
    logger.error(`[GlobalError] ${error.message}`, { error });
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#09090b] text-white p-4">
      <div className="max-w-md w-full bg-red-950/20 border border-red-900/40 p-8 rounded-3xl text-center space-y-4">
        <h2 className="text-2xl font-black text-red-500">Error Crítico</h2>
        <p className="text-zinc-400 text-sm font-medium">
          Ocurrió un error inesperado en la aplicación. Por favor, intenta de nuevo o contacta a soporte si el problema persiste.
        </p>
        <div className="bg-black/50 p-3 rounded-lg overflow-x-auto text-left border border-red-900/30">
          <code className="text-xs text-red-400 break-words">{error.message}</code>
        </div>
        <button
          onClick={() => reset()}
          className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-black rounded-xl transition shadow-lg shadow-red-900/20 w-full"
        >
          Recargar Aplicación
        </button>
      </div>
    </div>
  );
}
