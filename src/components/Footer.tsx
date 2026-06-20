import React from "react";
import { SystemSettings } from "../types";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

interface FooterProps {
  settings: SystemSettings;
  onNavigate?: (view: "home" | "admin" | "article" | "about" | "privacy" | "contact", articleId?: string) => void;
}

export default function Footer({ settings, onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full font-sans bg-white border-t border-zinc-200 mt-20 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 md:grid-cols-4 gap-12 text-zinc-800">
        
        {/* Col 1 */}
        <div className="flex flex-col gap-6">
          <div className="flex items-baseline gap-1">
            <div className="bg-[#cc0000] text-white px-3 py-0 -skew-x-[15deg]">
              <span className="text-4xl font-black tracking-tighter italic skew-x-[15deg] block">E7</span>
            </div>
            <span className="text-4xl font-black tracking-tighter text-zinc-950 italic">NEWS</span>
          </div>
          <p className="text-[#cc0000] font-black text-[10px] sm:text-[11px] tracking-widest uppercase -mt-4 ml-1">MONTE NEGRO - RO</p>

          <p className="text-sm font-medium leading-relaxed mt-2 text-zinc-600">
            O E7 News é o seu portal de notícias de Monte Negro e região.<br />
            Aqui a informação é séria, rápida e feita para você.<br /><br />
            Informação local hoje.<br />
            Referência nacional amanhã.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="font-extrabold text-[15px] mb-6 uppercase tracking-widest text-zinc-950">Navegação</h4>
          <ul className="space-y-4 text-[15px] font-medium text-zinc-600">
            <li><a href="#" className="hover:text-[#cc0000] transition-colors">Início</a></li>
            <li><a href="#" className="hover:text-[#cc0000] transition-colors">Destaques</a></li>
            <li><a href="#" className="hover:text-[#cc0000] transition-colors">Geral</a></li>
            <li><a href="#" className="hover:text-[#cc0000] transition-colors">Cultura</a></li>
            <li><a href="#" className="hover:text-[#cc0000] transition-colors">Educação</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="font-extrabold text-[15px] mb-6 uppercase tracking-widest text-zinc-950">Institucional</h4>
          <ul className="space-y-4 text-[15px] font-medium text-zinc-600">
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate("about"); }} className="hover:text-[#cc0000] transition-colors">Quem Somos</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate("privacy"); }} className="hover:text-[#cc0000] transition-colors">Política de Privacidade</a></li>
            <li><a href="#" className="hover:text-[#cc0000] transition-colors opacity-50 cursor-not-allowed">Termos de Uso</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate("contact"); }} className="hover:text-[#cc0000] transition-colors">Fale Conosco</a></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
           <h4 className="font-extrabold text-[15px] mb-6 uppercase tracking-widest text-zinc-950">Siga-Nos</h4>
           <div className="flex gap-4">
             <a href="https://instagram.com/sitee7news" target="_blank" rel="noopener noreferrer" className="bg-[#cc0000] text-white p-2.5 rounded-full hover:opacity-80 transition-opacity">
               <Instagram className="w-5 h-5" />
             </a>
             <a href="https://wa.me/5569981039664" target="_blank" rel="noopener noreferrer" className="bg-[#cc0000] text-white p-2.5 rounded-full hover:opacity-80 transition-opacity">
               <MessageCircle className="w-5 h-5 fill-current" />
             </a>
           </div>
        </div>

      </div>

      <div className="w-full bg-[#cc0000] text-white text-sm font-medium py-4 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {year} E7 NEWS - Todos os direitos reservados.</p>
            <p>Desenvolvido com <span className="text-white text-base leading-none">🤍</span> em Monte Negro - RO</p>
         </div>
      </div>
    </footer>
  );
}
