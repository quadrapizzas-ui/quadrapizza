import React from "react";
import { Button } from "@/components/ui/Button";

interface UnderConstructionProps {
  moduleName: string;
  pageName: string;
  description?: string;
}

export function UnderConstruction({ moduleName, pageName, description }: UnderConstructionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 mb-6 text-zinc-800">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
      <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
        Módulo en Construcción
      </h1>
      <h2 className="text-xl md:text-2xl font-bold text-orange-500 mb-2">
        {moduleName} <span className="text-zinc-500">/</span> {pageName}
      </h2>
      <p className="text-zinc-400 max-w-lg mx-auto mb-8">
        {description || "Esta vista ha sido reservada en la arquitectura y pronto será conectada con todo el flujo operativo de Quadra Pizza."}
      </p>
      <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900" onClick={() => window.history.back()}>
        Volver
      </Button>
    </div>
  );
}
