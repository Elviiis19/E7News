import React, { useState, useEffect } from "react";

interface CookieBannerProps {
  onNavigate: (view: "privacy" | "cookies") => void;
}

export default function CookieBanner({ onNavigate }: CookieBannerProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("e7news-cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("e7news-cookie-consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("e7news-cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 md:p-6 z-50 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
      <div className="text-zinc-300 text-sm leading-relaxed max-w-5xl">
        Utilizamos cookies essenciais e tecnologias semelhantes de acordo com a nossa{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("privacy"); }} className="text-[#cc0000] underline font-medium hover:text-red-400">
          Política de Privacidade
        </a>{" "}
        e{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("cookies"); }} className="text-[#cc0000] underline font-medium hover:text-red-400">
          Política de Cookies
        </a>{" "}
        para personalizar o conteúdo e melhorar a sua experiência, observando a Lei Geral de Proteção de Dados Pessoais (LGPD).
        Ao continuar navegando com nossas tecnologias ativas, você concorda com o uso de cookies.
      </div>
      <div className="flex gap-3 shrink-0 w-full lg:w-auto mt-2 lg:mt-0">
        <button 
          onClick={handleDecline} 
          className="flex-1 lg:flex-none px-6 py-2.5 rounded bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors text-sm"
        >
          Recusar Cookies
        </button>
        <button 
          onClick={handleAccept} 
          className="flex-1 lg:flex-none px-6 py-2.5 rounded bg-[#cc0000] text-white font-bold hover:bg-red-800 transition-colors text-sm shadow-lg shadow-red-900/50"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
