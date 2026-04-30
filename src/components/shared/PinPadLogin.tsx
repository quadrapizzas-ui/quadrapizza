"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface PinPadLoginProps {
  moduleName: string;
  onSuccessRedirect: string;
  expectedPin?: string; // Por ahora podemos mockearlo, ej: "1234"
  moduleColor?: string; // Ej: "text-orange-500"
  storageKey?: string; // Clave de localStorage que guarda la sesión. Ej: "quadra_recepcion_auth"
}

export function PinPadLogin({ 
  moduleName, 
  onSuccessRedirect, 
  expectedPin = "1234",
  moduleColor = "text-white",
  storageKey,
}: PinPadLoginProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      setError(false);
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === expectedPin) {
      if (storageKey) {
        localStorage.setItem(storageKey, "true");
      }
      setTimeout(() => {
        router.push(onSuccessRedirect);
      }, 300); // Pequeño delay visual para UX
    } else {
      setError(true);
      setTimeout(() => setPin(""), 500); // Limpia tras error
    }
  };

  // Soporte para teclado físico en PC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        if (pin.length < 4) {
          setError(false);
          const newPin = pin + e.key;
          setPin(newPin);
          if (newPin.length === 4) verifyPin(newPin);
        }
      } else if (e.key === "Backspace") {
        setPin(prev => prev.slice(0, -1));
        setError(false);
      } else if (e.key === "Enter" && pin.length === 4) {
        verifyPin(pin);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin]); 

  // Botones estilo NumPad nativo iOS/Android
  const padKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "borrar", "0", "ok"];

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-6 w-full max-w-xl mx-auto gap-8 pb-12 lg:pb-0">
      
      {/* Texto de Cabecera (Centro Vertical) */}
      <div className="flex flex-col items-center text-center w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
        <Image src="/logo.jpg" alt="Quadra Logo" width={140} height={140} className="rounded-3xl mb-6 shadow-[0_0_30px_rgba(234,88,12,0.2)] object-cover" />
        <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-2 pt-2 lg:pt-0">Quadra <span className="text-orange-500">Pizza</span></h1>
        <h2 className={`font-bold text-xl lg:text-2xl mt-1 lg:mt-0 leading-tight ${moduleColor}`}>
          {moduleName}
        </h2>
        <p className="hidden lg:block mt-6 text-zinc-500 text-sm max-w-sm leading-relaxed">
          Ingresa tu PIN de seguridad utilizando tu teclado físico para acceder al sistema.
        </p>
      </div>

      {/* Widget Reducido del PinPad */}
      <div className="bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800 p-8 rounded-[40px] shadow-2xl w-full max-w-[340px] flex flex-col items-center flex-shrink-0 relative">
        
        {/* Bubbles de PIN */}
        <div className={`flex gap-4 mb-8 transition-transform ${error ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map((index) => (
            <div 
              key={index} 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                error 
                  ? 'bg-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                  : pin.length > index 
                    ? 'bg-orange-500 border-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.4)] scale-110' 
                    : 'bg-transparent border-zinc-700 scale-100'
              }`} 
            />
          ))}
        </div>

        <div className="h-6 flex items-center justify-center">
          {error ? (
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse">PIN INCORRECTO</p>
          ) : (
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">INGRESA TU CLAVE</p>
          )}
        </div>

        {/* Numpad Grid (Oculto en PC por solicitud, mantenido para pantallas táctiles) */}
        <div className="grid grid-cols-3 gap-x-5 gap-y-5 w-full mt-10 lg:hidden">
          {padKeys.map((key) => {
             if (key === "borrar") {
               return (
                 <button 
                  key={key} 
                  onClick={handleDelete}
                  className="flex items-center justify-center w-20 h-20 rounded-full active:bg-zinc-800 transition-colors text-zinc-400 hover:text-white mx-auto"
                 >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
                 </button>
               );
             }
             if (key === "ok") {
               return (
                 <button 
                   key={key} 
                   onClick={() => pin.length === 4 && verifyPin(pin)}
                   className={`flex items-center justify-center w-20 h-20 rounded-full font-black text-lg transition-all mx-auto ${
                     pin.length === 4 ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] active:scale-95' : 'text-zinc-600 cursor-default'
                   }`}
                 >
                   OK
                 </button>
               )
             }
             return (
               <button 
                 key={key} 
                 onClick={() => handlePress(key)}
                 className="flex items-center justify-center w-20 h-20 rounded-full bg-zinc-800/40 border border-zinc-700/50 hover:bg-zinc-800 active:bg-zinc-700 active:scale-95 transition-all text-3xl font-medium text-white shadow-sm mx-auto"
               >
                 {key}
               </button>
             );
          })}
        </div>

        <p className="absolute -bottom-10 left-0 right-0 text-center mx-auto text-zinc-600 text-xs font-semibold">(PIN Demo: 1234)</p>
      </div>
    </div>
  );
}
