import React from "react";
import { Article } from "../types";
import { Sparkles, Trophy, Database, TrendingUp, Zap, Clock, ArrowUpRight, Network } from "lucide-react";

interface R7BentoViewProps {
  articles: Article[];
  onSelectArticle: (id: string) => void;
}

export default function R7BentoView({ articles, onSelectArticle }: R7BentoViewProps) {
  const [visibleCount, setVisibleCount] = React.useState(10);

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-[#0b132b] rounded-xl border border-blue-900/40 text-slate-300">
        <p className="font-mono text-sm uppercase">Nenhuma postagem associada a este feed.</p>
      </div>
    );
  }

  // Segment articles
  const heros = articles.slice(0, 2);
  const sideHighlight = articles.slice(2, 5);
  const tinyCells = articles.slice(5, 11); // expanded slightly to show 6 bento small blocks
  const finalRows = articles.slice(11);
  
  const visibleFinalRows = finalRows.slice(0, visibleCount);
  const hasMore = finalRows.length > visibleCount;

  return (
    <div className="space-y-8 font-sans">
      
      {/* SECTION HEADER BLOCK */}
      <div className="border-b-4 border-blue-650 pb-2 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#004dc4] tracking-tight uppercase flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Mural Informativo Bento Grid
        </h2>
        <span className="text-[10px] bg-blue-50 text-blue-700 font-mono font-bold px-2.5 py-0.5 rounded border border-blue-100 uppercase">
          Feed: {articles.length} Artigos
        </span>
      </div>

      {/* 1. MAIN BENTO GRID BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: HEROS (Stack of 2 cells) */}
        <div className="lg:col-span-2 space-y-6">
          {heros.map((art, idx) => (
            <div 
              key={art.id}
              onClick={() => onSelectArticle(art.id)}
              className="group cursor-pointer bg-[#0b132b] text-white rounded-xl overflow-hidden border border-blue-950 hover:border-blue-500/50 shadow-md relative flex flex-col sm:flex-row h-auto sm:h-64 justify-between"
            >
              <div className="relative w-full sm:w-1/2 overflow-hidden bg-slate-950">
                <img 
                  referrerPolicy="no-referrer"
                  src={art.imageUrl} 
                  alt={art.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0b132b] hidden sm:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b] to-transparent sm:hidden"></div>
                <span className="absolute top-3 left-3 bg-yellow-400 text-slate-950 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                  DESTAQUE 0{idx + 1}
                </span>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between relative">
                <div>
                  <span className="text-[10px] font-mono font-bold text-yellow-400 bg-blue-950/60 px-2 py-0.5 border border-blue-900 rounded uppercase tracking-widest inline-block mb-2">
                    {art.category} • EXCLUSIVO
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight group-hover:text-yellow-300 transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {art.subtitle}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 pt-3 border-t border-blue-900/60 mt-4 text-[9px] font-mono text-slate-400">
                  <span>Por: {art.author.name.replace(" de Carvalho", "")}</span>
                  <span>•</span>
                  <span>{art.readCount} visualizações</span>
                </div>
              </div>
            </div>
          ))}

          {heros.length === 0 && (
            <p className="text-slate-400 text-xs italic">Nenhum destaque bento disponível.</p>
          )}
        </div>

        {/* RIGHT COLUMN: MEDIUM LIST SIDEBAR (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="bg-white border text-slate-900 border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xs font-mono font-bold text-blue-600 uppercase mb-4 tracking-widest border-b pb-2 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
                Destaques Populares
              </h3>

              <div className="space-y-4">
                {sideHighlight.map((art) => (
                  <div 
                    key={art.id}
                    onClick={() => onSelectArticle(art.id)}
                    className="group cursor-pointer border-b last:border-0 pb-3.5 last:pb-0"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                      <span className="text-blue-600 font-bold uppercase">{art.category}</span>
                      <span className="text-slate-400 bg-slate-50 px-1.5 rounded">Rádio RO</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition">
                      {art.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{art.subtitle}</p>
                  </div>
                ))}
                {sideHighlight.length === 0 && (
                  <p className="text-slate-400 text-xs italic">Carregando mais links em breve...</p>
                )}
              </div>
            </div>

            {/* Simulated Live Broadcast indicator */}
            <div className="border border-blue-100 bg-blue-50/50 p-3.5 rounded-lg text-slate-700 text-xs leading-relaxed mt-4">
              <strong className="block text-slate-900 font-sans text-[11px] tracking-tight uppercase flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-650 animate-ping shrink-0" />
                Plantão de Análises 24h:
              </strong>
              Conteúdo regional assinado pelo Jornalista Elvis Dias sob o registro profissional DRT 1466/RO.
            </div>
          </div>
        </div>

      </div>

      {/* 2. LOWER TINY METRO GRID (3 or 4 columns depending on sizing) */}
      {tinyCells.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {tinyCells.map((art) => (
            <div 
              key={art.id}
              onClick={() => onSelectArticle(art.id)}
              className="group cursor-pointer bg-slate-50 border border-slate-200 hover:bg-white hover:border-blue-600 hover:shadow-md rounded-xl p-4.5 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-200/60 px-2 py-0.5 rounded-full">
                  {art.category}
                </span>
                <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-blue-600 transition leading-snug mt-3 line-clamp-3">
                  {art.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{art.subtitle}</p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-3.5 text-[9px] font-mono">
                <span className="text-slate-400">Opinião de Elvis Dias</span>
                <span className="flex items-center gap-1 text-blue-600 font-bold group-hover:underline">
                  Ver agora <ArrowUpRight className="w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. ADDITIONAL ROW CHRONO CARDS FOR DENSITY */}
      {visibleFinalRows.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="border-b pb-1.5">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Feed Sequencial de Artigos (E7 News Collection)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleFinalRows.map((art) => (
              <div 
                key={art.id}
                onClick={() => onSelectArticle(art.id)}
                className="flex gap-4 p-4 border border-slate-200 bg-white rounded-lg hover:shadow-xs transition cursor-pointer group"
              >
                <div className="w-20 h-20 rounded bg-slate-100 overflow-hidden shrink-0">
                  <img 
                    referrerPolicy="no-referrer"
                    src={art.imageUrl} 
                    alt={art.imageAlt} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-blue-600 uppercase font-bold">{art.category}</span>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition line-clamp-2">
                      {art.title}
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">Publicado em: {new Date(art.publishedAt).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* LOAD MORE TRIGGER (Carregar Mais) */}
          {hasMore && (
            <div className="pt-6 text-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="inline-flex items-center justify-center bg-[#0b132b] hover:bg-[#152244] text-[#ffffff] px-8 py-3 rounded-lg font-mono text-xs uppercase tracking-wider transition hover:shadow-lg focus:ring-2 focus:ring-blue-500"
              >
                Carregar mais notícias ({finalRows.length - visibleCount} restantes)
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
