"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

export default function GerenciaLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPwd, setShowForgotPwd] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      .animate-shake {
        animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate validation
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        localStorage.setItem("quadra_gerencia_auth", "true");
        router.push("/gerencia/dashboard");
      } else {
        setError("Usuario o contraseña incorrectos");
        setIsLoading(false);
      }
    }, 800);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Se han enviado las instrucciones de recuperación a tu correo.");
    setShowForgotPwd(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/60 p-8 rounded-3xl shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 border-2 border-zinc-800/80 shadow-lg">
            <Image src="/logo.jpg" alt="Logo" width={64} height={64} className="object-cover w-full h-full" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Quadra <span className="text-orange-500">Pizza</span>
          </h1>
          <p className="text-purple-400 font-bold uppercase tracking-widest text-xs mt-1">
            Módulo Gerencia
          </p>
        </div>

        {!showForgotPwd ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-400 ml-1">Usuario</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium placeholder:text-zinc-600"
                  placeholder="Ingresá tu usuario..."
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-zinc-400">Contraseña</label>
                <button 
                  type="button" 
                  onClick={() => setShowForgotPwd(true)}
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  ¿Olvidaste la clave?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium placeholder:text-zinc-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-2 px-3 rounded-lg flex items-center justify-center animate-shake mt-2">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-2">
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-400">
                <KeyRound size={24} />
              </div>
              <h2 className="text-lg font-bold text-white">Recuperar Contraseña</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Ingresá tu usuario o correo y te enviaremos las instrucciones.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-xs font-bold text-zinc-400 ml-1">Usuario o Correo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium placeholder:text-zinc-600"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center"
            >
              Enviar Instrucciones
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPwd(false)}
              className="mt-1 w-full bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white font-medium py-3 rounded-xl transition-colors text-sm"
            >
              Volver al Login
            </button>
          </form>
        )}

      </div>
      
      {/* Footer hint */}
      <div className="absolute bottom-6 text-center w-full text-xs text-zinc-600 font-medium">
        Acceso restringido. Solo personal autorizado.
      </div>
    </div>
  );
}
