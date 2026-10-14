"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div role="search" className="relative w-full sm:max-w-md group">
      <div className="relative flex items-center bg-zinc-950/80 border border-white/20 group-hover:border-white/40 group-focus-within:border-white rounded-2xl shadow-xl transition-all duration-300 backdrop-blur-xl">
        <Search 
          className={`ml-4 shrink-0 transition-colors duration-200 ${
            value ? "text-amber-400" : "text-zinc-400 group-focus-within:text-amber-400"
          }`} 
          size={18} 
        />
        
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="¿Qué querés comer hoy? Buscá pizzas, burgers..." 
          aria-label="Buscar platos en el catálogo"
          className="w-full pl-3 pr-10 py-3.5 bg-transparent outline-none font-medium text-sm text-white placeholder:text-zinc-400 font-sans"
        />

        {value && (
          <button
            onClick={() => onChange("")}
            aria-label="Borrar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition active:scale-90"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
