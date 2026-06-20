import React, { useState } from "react";
import { SystemSettings } from "../types";
import { Search, Menu, X, Moon, Sun } from "lucide-react";

interface HeaderProps {
  settings: SystemSettings;
  onNavigate: (view: "home" | "admin" | "article" | "about" | "privacy" | "contact" | "terms" | "cookies" | "webstory", articleId?: string) => void;
  currentView: string;
  darkMode?: boolean;
  toggleTheme?: () => void;
}

export default function Header({ settings, onNavigate, currentView, darkMode, toggleTheme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate("home");
  };

  const navLinks = [
    { label: "INÍCIO", href: "#" },
    { label: "DESTAQUES", href: "#" },
    { label: "GERAL", href: "#" },
    { label: "CULTURA", href: "#" },
    { label: "EDUCAÇÃO", href: "#" },
  ];

  return (
    <header className="w-full font-sans bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center">
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex flex-col focus:outline-none group"
            aria-label="Ir para a página inicial"
          >
            <div className="flex items-baseline gap-1">
              <div className="bg-[#cc0000] text-white px-3 sm:px-4 py-0 sm:-skew-x-[15deg]">
                <span className="text-4xl sm:text-5xl font-black tracking-tighter italic sm:skew-x-[15deg] block">E7</span>
              </div>
              <span className="text-4xl sm:text-5xl font-black tracking-tighter text-zinc-950 dark:text-white group-hover:text-[#cc0000] transition-colors italic">NEWS</span>
            </div>
            <span className="text-[#cc0000] font-black text-[10px] sm:text-[11px] tracking-widest mt-1 ml-1 uppercase">MONTE NEGRO - RO</span>
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center flex-1 justify-center">
          <ul className="flex items-center gap-8 text-[15px] font-black text-zinc-900 dark:text-zinc-100">
            {navLinks.map((link, idx) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); onNavigate("home"); }}
                  className={`${idx === 0 ? "text-[#cc0000]" : "hover:text-[#cc0000]"} transition-colors uppercase`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Search & Actions Desktop */}
        <div className="hidden lg:flex items-center justify-end gap-6">
          <button
            onClick={toggleTheme}
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            aria-label="Alternar Tema"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button
            className="flex items-center gap-2 text-zinc-900 dark:text-white group font-bold text-[15px] focus:outline-none"
            aria-label="Buscar"
          >
            <Search className="w-6 h-6 group-hover:text-[#cc0000] transition-colors" />
            <span className="group-hover:text-[#cc0000] transition-colors">Buscar</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center gap-4">
           {toggleTheme && (
             <button
              onClick={toggleTheme}
              className="text-zinc-500 dark:text-zinc-400"
              aria-label="Alternar Tema"
             >
               {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
           )}
           <button
            className="p-2 text-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors focus:outline-none flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar Menu" : "Abrir Menu"}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

       {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-4 shadow-lg absolute w-full left-0 z-40">
          <nav>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, idx) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      onNavigate("home");
                    }}
                    className={`block w-full text-zinc-800 hover:text-[#cc0000] font-black text-lg py-3 px-2 transition-colors uppercase ${idx === 0 ? 'text-[#cc0000]' : ''}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
               <li className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    className="flex w-full items-center gap-2 text-zinc-800 dark:text-zinc-100 hover:text-[#cc0000] dark:hover:text-red-500 font-black text-lg py-3 px-2 transition-colors uppercase"
                   >
                     <Search className="w-6 h-6" /> Buscar
                  </button>
               </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
