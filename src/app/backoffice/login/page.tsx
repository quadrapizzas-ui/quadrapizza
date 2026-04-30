"use client"
import { PinPadLogin } from "@/components/shared/PinPadLogin";
import { useEffect } from "react";

export default function BackofficeLoginPage() {
  
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      .animate-shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div className="min-h-screen bg-black/95">
      <PinPadLogin 
        moduleName="Backoffice" 
        moduleColor="text-amber-500"
        onSuccessRedirect="/backoffice/dashboard" 
        expectedPin="1234" 
      />
    </div>
  );
}
