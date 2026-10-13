"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore, MockUser } from "@/lib/store/authStore";
import {
  Keyboard,
  Delete,
  Check,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  ShieldAlert,
  Loader2,
} from "lucide-react";

interface PinPadLoginProps {
  moduleName: string;
  onSuccessRedirect: string;
  expectedPin?: string;
  moduleColor?: string;
  storageKey?: string;
}

export function PinPadLogin({
  moduleName,
  onSuccessRedirect,
  moduleColor = "text-white",
  storageKey,
}: PinPadLoginProps) {
  // Pasos: 'dni' -> 'pin'
  const [step, setStep] = useState<"dni" | "pin">("dni");
  const [dni, setDni] = useState("");
  const [pin, setPin] = useState("");
  const [matchedUser, setMatchedUser] = useState<MockUser | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Detección automática e invisible de dispositivo táctil (Tablet / Teléfono) vs PC
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const dniInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { getUserByDni, loginByDniAndPin } = useAuthStore();

  useEffect(() => {
    setIsClient(true);
    // Detección nativa por media query del puntero primario
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      ("ontouchstart" in window && window.innerWidth < 1024);
    setIsTouchDevice(isTouch);
  }, []);

  // Foco inicial automático en el campo de DNI
  useEffect(() => {
    if (isClient && step === "dni") {
      setTimeout(() => dniInputRef.current?.focus(), 80);
    }
  }, [step, isClient]);

  // ── Validación de DNI (Paso 1) ──────────────────────────────────
  const handleDniSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanDni = dni.trim().replace(/\D/g, "");
    if (cleanDni.length < 6) {
      triggerError("Ingresá un DNI válido (mínimo 6 dígitos)");
      return;
    }

    const user = getUserByDni(cleanDni, moduleName);
    if (!user) {
      triggerError(`DNI no registrado o sin acceso al sector ${moduleName}`);
      return;
    }

    setIsError(false);
    setErrorMessage("");
    setMatchedUser(user);
    setPin("");
    setStep("pin");
  };

  const handleBackToDni = () => {
    setStep("dni");
    setPin("");
    setIsError(false);
    setErrorMessage("");
    setTimeout(() => dniInputRef.current?.focus(), 80);
  };

  // ── Validación de PIN (Paso 2) ──────────────────────────────────
  const verifyPin = (enteredPin: string) => {
    if (!matchedUser) return;
    setIsLoading(true);

    setTimeout(() => {
      const cleanDni = dni.trim().replace(/\D/g, "");
      const success = loginByDniAndPin(cleanDni, enteredPin, moduleName);

      if (success) {
        if (storageKey && typeof window !== "undefined") {
          localStorage.setItem(storageKey, "true");
        }
        router.push(onSuccessRedirect);
      } else {
        setIsLoading(false);
        triggerError("PIN incorrecto. Reintentá.");
        setPin("");
      }
    }, 250);
  };

  const triggerError = (msg: string) => {
    setIsError(true);
    setErrorMessage(msg);
    setTimeout(() => {
      setIsError(false);
    }, 1200);
  };

  // ── Manejo de botones táctiles en pantalla (Solo en tablets) ──
  const handlePadPress = (num: string) => {
    setIsError(false);
    setErrorMessage("");

    if (step === "dni") {
      if (dni.length < 10) {
        setDni((prev) => prev + num);
      }
    } else {
      if (pin.length < 4) {
        const newPin = pin + num;
        setPin(newPin);
        if (newPin.length === 4) {
          verifyPin(newPin);
        }
      }
    }
  };

  const handlePadDelete = () => {
    setIsError(false);
    setErrorMessage("");
    if (step === "dni") {
      setDni((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const handlePadOk = () => {
    if (step === "dni") {
      handleDniSubmit();
    } else {
      if (pin.length === 4) verifyPin(pin);
    }
  };

  // ── Soporte universal de teclado físico en PC ─────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (step !== "pin") return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        setIsError(false);
        setErrorMessage("");
        setPin((prev) => {
          if (prev.length >= 4) return prev;
          const next = prev + e.key;
          if (next.length === 4) {
            verifyPin(next);
          }
          return next;
        });
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setIsError(false);
        setErrorMessage("");
        setPin((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        setPin((prev) => {
          if (prev.length === 4) {
            verifyPin(prev);
          }
          return prev;
        });
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleBackToDni();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, matchedUser]);

  const padKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "borrar", "0", "ok"];

  return (
    <div
      onClick={() => {
        if (step === "dni") {
          dniInputRef.current?.focus();
        }
      }}
      className="flex flex-col items-center justify-center min-h-screen px-4 py-8 w-full max-w-lg mx-auto select-none"
    >
      {/* Tarjeta Principal de Login */}
      <div className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 p-5 sm:p-9 rounded-3xl sm:rounded-[36px] shadow-2xl w-full max-w-[390px] flex flex-col items-center relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Cabecera / Identidad */}
        <div className="flex flex-col items-center text-center w-full mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 border border-zinc-800 shadow-[0_0_25px_rgba(234,88,12,0.2)]">
            <Image
              src="/logo.jpg"
              alt="Quadra Logo"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Quadra <span className="text-orange-500">Pizza</span>
          </h1>
          <h2 className={`font-black text-sm uppercase tracking-widest mt-0.5 ${moduleColor}`}>
            {moduleName}
          </h2>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* PASO 1: INGRESO DE DNI                                    */}
        {/* ══════════════════════════════════════════════════════════ */}
        {step === "dni" ? (
          <form
            onSubmit={handleDniSubmit}
            className="w-full flex flex-col items-center animate-in fade-in slide-in-from-left-4 duration-200"
          >
            <div className="text-center mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Paso 1 de 2
              </span>
              <p className="text-lg font-black text-white mt-0.5">Ingresá tu DNI</p>
            </div>

            {/* Input grande de DNI */}
            <div className={`w-full relative my-2 ${isError ? "animate-shake" : ""}`}>
              <input
                ref={dniInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={9}
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value.replace(/\D/g, ""));
                  setIsError(false);
                  setErrorMessage("");
                }}
                placeholder="12345678"
                autoFocus
                className="w-full bg-zinc-950/70 border-2 border-zinc-800 focus:border-orange-500 rounded-2xl py-3 px-4 text-center text-white text-3xl font-black tracking-[4px] outline-none transition placeholder:text-zinc-700 shadow-inner"
              />
            </div>

            {/* Mensaje de error / ayuda */}
            <div className="min-h-[22px] flex items-center justify-center my-1 text-center">
              {errorMessage ? (
                <p className="text-red-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>{errorMessage}</span>
                </p>
              ) : (
                <p className="text-zinc-500 text-[11px] font-medium">
                  Documento del colaborador registrado
                </p>
              )}
            </div>

            {/* Botón Continuar */}
            <button
              type="submit"
              disabled={dni.length < 6}
              className="w-full mt-3 py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <span>Continuar</span>
              <ArrowRight size={17} />
            </button>

            {/* Acceso Rápido Demo */}
            <button
              type="button"
              onClick={() => {
                const targetDni = "40299684";
                setDni(targetDni);
                const user = getUserByDni(targetDni, moduleName);
                if (user) {
                  setMatchedUser(user);
                  setPin("1234");
                  setStep("pin");
                }
              }}
              className="mt-3 text-[11px] text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>Demo: DNI 40299684 • PIN 1234</span>
            </button>

            {/* Teclado en pantalla (Solo en Tablets / Pantallas táctiles) */}
            {isTouchDevice && (
              <div className="grid grid-cols-3 gap-x-3 gap-y-2.5 w-full mt-4 pt-3 border-t border-zinc-800/80 animate-in fade-in duration-200">
                {padKeys.map((key) => {
                  if (key === "borrar") {
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePadDelete();
                        }}
                        className="flex items-center justify-center w-12 h-12 rounded-full active:bg-zinc-800 transition text-zinc-400 hover:text-white mx-auto"
                      >
                        <Delete size={19} />
                      </button>
                    );
                  }
                  if (key === "ok") {
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePadOk();
                        }}
                        className={`flex items-center justify-center w-12 h-12 rounded-full font-black text-sm transition mx-auto ${
                          dni.length >= 6
                            ? "bg-orange-600 text-white shadow-md active:scale-95"
                            : "text-zinc-600 cursor-default"
                        }`}
                      >
                        <Check size={19} />
                      </button>
                    );
                  }
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePadPress(key);
                      }}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/60 border border-zinc-700/60 hover:bg-zinc-800 active:bg-zinc-700 active:scale-95 transition text-lg font-bold text-white shadow-sm mx-auto"
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            )}
          </form>
        ) : (
          /* ══════════════════════════════════════════════════════════ */
          /* PASO 2: INGRESO DE PIN                                    */
          /* ══════════════════════════════════════════════════════════ */
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Botón para volver al Paso 1 */}
            <div className="w-full flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBackToDni();
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white py-1 px-2.5 rounded-lg hover:bg-zinc-800/50 transition"
              >
                <ArrowLeft size={14} />
                <span>Cambiar DNI</span>
              </button>

              <span className="text-[10px] font-mono text-zinc-500">
                DNI: {dni}
              </span>
            </div>

            {/* Saludo con nombre del colaborador */}
            <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl py-2 px-3.5 mb-3 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <UserCheck size={15} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-white leading-tight">
                  {matchedUser?.name}
                </p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {matchedUser?.role}
                </p>
              </div>
            </div>

            <p className="text-xs font-bold text-zinc-400 mb-2">
              Ingresá tu clave de 4 dígitos
            </p>

            {/* EN PC: Casilleros de 4 dígitos para teclado físico */}
            {!isTouchDevice ? (
              <div className="w-full flex flex-col items-center">
                <div
                  className={`flex justify-center items-center gap-3 my-3 ${
                    isError ? "animate-shake" : ""
                  }`}
                >
                  {[0, 1, 2, 3].map((index) => {
                    const hasVal = pin.length > index;
                    const isCurrent = pin.length === index;
                    return (
                      <div
                        key={index}
                        className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl font-black transition-all duration-200 ${
                          isError
                            ? "border-red-500 bg-red-500/15 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                            : hasVal
                            ? "border-orange-500 bg-orange-500/15 text-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.3)] scale-105"
                            : isCurrent
                            ? "border-zinc-500 bg-zinc-800/50 text-white animate-pulse"
                            : "border-zinc-800 bg-zinc-950/60 text-zinc-700"
                        }`}
                      >
                        {hasVal ? "•" : ""}
                      </div>
                    );
                  })}
                </div>

                <div className="h-6 flex items-center justify-center mt-1 mb-1">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-orange-400 text-xs font-bold">
                      <Loader2 size={13} className="animate-spin" />
                      <span>Verificando...</span>
                    </div>
                  ) : errorMessage ? (
                    <p className="text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                      {errorMessage}
                    </p>
                  ) : (
                    <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold">
                      <Keyboard size={13} className="text-zinc-500" />
                      <span>Escribí tu clave en el teclado</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* EN TABLET: Bubbles + Numpad táctil en pantalla */
              <div className="w-full flex flex-col items-center">
                {/* Bubbles de PIN */}
                <div
                  className={`flex gap-4 my-2 ${isError ? "animate-shake" : ""}`}
                >
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                        isError
                          ? "bg-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                          : pin.length > index
                          ? "bg-orange-500 border-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.4)] scale-110"
                          : "bg-transparent border-zinc-700 scale-100"
                      }`}
                    />
                  ))}
                </div>

                <div className="h-5 flex items-center justify-center">
                  {isLoading ? (
                    <div className="flex items-center gap-1.5 text-orange-400 text-xs font-bold">
                      <Loader2 size={13} className="animate-spin" />
                      <span>Verificando...</span>
                    </div>
                  ) : errorMessage ? (
                    <p className="text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                      {errorMessage}
                    </p>
                  ) : (
                    <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">
                      INGRESA TU CLAVE
                    </p>
                  )}
                </div>

                {/* Numpad Grid */}
                <div className="grid grid-cols-3 gap-x-3 gap-y-2.5 w-full mt-3">
                  {padKeys.map((key) => {
                    if (key === "borrar") {
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePadDelete();
                          }}
                          className="flex items-center justify-center w-12 h-12 rounded-full active:bg-zinc-800 transition text-zinc-400 hover:text-white mx-auto"
                        >
                          <Delete size={19} />
                        </button>
                      );
                    }
                    if (key === "ok") {
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePadOk();
                          }}
                          className={`flex items-center justify-center w-12 h-12 rounded-full font-black text-sm transition mx-auto ${
                            pin.length === 4
                              ? "bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] active:scale-95"
                              : "text-zinc-600 cursor-default"
                          }`}
                        >
                          <Check size={19} />
                        </button>
                      );
                    }
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePadPress(key);
                        }}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/60 border border-zinc-700/60 hover:bg-zinc-800 active:bg-zinc-700 active:scale-95 transition text-lg font-bold text-white shadow-sm mx-auto"
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
