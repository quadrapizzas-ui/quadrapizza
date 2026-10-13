"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full sm:max-w-sm md:max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar pizzas, empanadas..." 
        className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition font-medium text-sm text-zinc-100 placeholder:text-zinc-500"
      />
    </div>
  );
}
