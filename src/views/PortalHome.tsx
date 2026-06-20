import React from "react";
import { Article, SystemSettings } from "../types";
import { ChevronRight } from "lucide-react";

interface PortalHomeProps {
  articles: Article[];
  settings: SystemSettings;
  onSelectArticle: (id: string) => void;
}

export default function PortalHome({ articles, settings, onSelectArticle }: PortalHomeProps) {
  const filterCategory = (k: string) => articles.filter(a => a.category.toLowerCase().includes(k.toLowerCase()));
  
  // Use fallbacks based on slices if there aren't enough articles of a category
  const mainHero = articles[0] || null;
  const smallHeroes = articles.slice(1, 4);
  const destaques = articles.slice(4, 8);
  
  const cid = filterCategory('geral');
  const ultimasGeral = cid.length > 0 ? cid.slice(0, 3) : articles.slice(1, 4);
  
  const cul = filterCategory('cultura');
  const ultimasCultura = cul.length > 0 ? cul.slice(0, 3) : articles.slice(5, 8);

  const edu = filterCategory('educa');
  const ultimasEducacao = edu.length > 0 ? edu.slice(0, 3) : articles.slice(2, 5);

  const tickerNews = articles.slice(0, 6);

  // Helper to generate random 'minutos' or 'horas' for mockup fidelity
  const getRandomTime = (index: number) => {
     const times = ["há 5 min", "há 18 min", "há 35 min", "há 1 hora", "há 2 horas", "há 4 horas"];
     return times[index % times.length];
  };

  return (
    <div className="w-full font-sans bg-[#fbfbfb] pb-16">
      <h1 className="sr-only">E7 News - Início</h1>

      {/* TICKER DE ÚLTIMAS NOTÍCIAS */}
      <div className="w-full bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto flex">
          <div className="bg-[#cc0000] text-white font-extrabold uppercase py-3 px-4 sm:px-6 text-sm tracking-wider whitespace-nowrap flex-shrink-0 z-10 relative">
            Últimas Notícias
          </div>
          <div className="flex-1 overflow-x-hidden flex items-center relative">
             <div className="flex items-center gap-8 whitespace-nowrap px-4 animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
                {tickerNews.map((news, i) => (
                   <button key={`ticker-${news.id}`} onClick={() => onSelectArticle(news.id)} className="flex items-center gap-1.5 hover:text-[#cc0000] group">
                     <span className="text-[#cc0000] text-xs font-black mr-1">• {getRandomTime(i)}</span>
                     <span className="text-sm font-medium text-zinc-800 leading-none group-hover:underline decoration-[#cc0000]">{news.title}</span>
                   </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* MAIN HERO AND SIDE HIGHLIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 shadow-sm rounded-xl border border-zinc-100">
          
          {/* Main Hero (Left) */}
          {mainHero && (
            <div className="lg:col-span-8 relative rounded-lg overflow-hidden group cursor-pointer aspect-[4/3] lg:aspect-auto min-h-[400px] lg:min-h-[500px]" onClick={() => onSelectArticle(mainHero.id)}>
              <img src={mainHero.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full max-w-4xl z-10">
                <span className="bg-[#cc0000] text-white text-xs font-black uppercase tracking-widest px-3 py-1 mb-4 inline-block rounded-sm">
                  Destaques
                </span>
                <h2 className="text-white text-3xl md:text-5xl font-black leading-[1.1] mb-4 tracking-tight drop-shadow-sm group-hover:text-zinc-200 transition-colors">
                  {mainHero.title}
                </h2>
                <p className="text-zinc-200 text-base md:text-lg mb-6 leading-relaxed line-clamp-2 md:line-clamp-3 w-[90%] font-medium">
                  {mainHero.subtitle}
                </p>
                <div className="flex items-center gap-2 text-zinc-300 text-xs md:text-sm">
                   <div className="flex items-baseline gap-0.5">
                     <span className="text-[#cc0000] font-black italic">E7</span>
                     <span className="text-white font-black italic">NEWS</span>
                   </div>
                   <span>|</span> 
                   <span className="font-medium">há 25 minutos</span>
                </div>
              </div>
            </div>
          )}

          {/* Small Heroes (Right) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            {smallHeroes.map((article, i) => (
               <article key={`sh-${article.id}`} className="group flex gap-4 cursor-pointer hover:bg-zinc-50 rounded-lg transition-colors p-2 -m-2" onClick={() => onSelectArticle(article.id)}>
                  <div className="w-32 h-24 md:w-40 md:h-[110px] rounded-lg overflow-hidden flex-shrink-0 relative">
                     <img src={article.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
                  <div className="flex flex-col justify-center flex-1 py-1">
                     <span className="text-[#cc0000] font-black uppercase tracking-widest text-[10px] mb-1">
                       {article.category || 'Geral'}
                     </span>
                     <h3 className="font-bold text-[15px] leading-snug text-zinc-900 group-hover:text-[#cc0000] transition-colors line-clamp-3 mb-2">
                       {article.title}
                     </h3>
                     <span className="text-zinc-400 text-xs font-medium">
                       {getRandomTime(i + 1)}
                     </span>
                  </div>
               </article>
            ))}
          </div>

        </div>

        {/* SECÇÃO: DESTAQUES (Grid 4 cards) */}
        <div className="mt-16 bg-white p-6 md:p-8 shadow-sm rounded-xl border border-zinc-100">
          <div className="flex items-center justify-between border-b-[3px] border-zinc-100 pb-3 mb-8">
            <h3 className="text-2xl font-black uppercase text-zinc-950 tracking-wider flex items-center gap-2">
               Destaques
            </h3>
            <button className="flex items-center gap-1 text-zinc-800 font-bold text-sm hover:text-[#cc0000] transition-colors focus:outline-none uppercase tracking-wider">
               Ver todas <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destaques.map((article, i) => (
              <article key={`destq-${article.id}`} className="group cursor-pointer flex flex-col" onClick={() => onSelectArticle(article.id)}>
                 <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-zinc-100 mb-4">
                    <img src={article.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                 </div>
                 <div className="flex flex-col flex-1">
                    <span className="text-[#cc0000] font-black uppercase tracking-widest text-[10px] mb-2 block">
                      {article.category || 'Geral'}
                    </span>
                    <h4 className="font-bold text-[17px] leading-snug text-zinc-900 group-hover:text-[#cc0000] transition-colors line-clamp-3 mb-3">
                      {article.title}
                    </h4>
                    <div className="mt-auto pt-2">
                       <span className="text-zinc-400 text-xs font-medium">
                          {getRandomTime(i + 3)}
                       </span>
                    </div>
                 </div>
              </article>
            ))}
          </div>
        </div>

        {/* SECÇÕES: CATEGORIAS (Grid 3 Colunas) */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Coluna 1: Geral */}
          <div className="flex flex-col bg-white p-6 shadow-sm rounded-xl border border-zinc-100">
            <div className="flex items-center justify-between border-b-[3px] border-zinc-100 pb-3 mb-6">
              <h3 className="text-xl font-black uppercase text-zinc-950 tracking-wider">Geral</h3>
              <button className="flex items-center text-zinc-600 font-bold text-xs hover:text-[#cc0000] uppercase tracking-wider transition-colors">
                Ver todas <ChevronRight className="w-3.5 h-3.5 ml-0.5"/>
              </button>
            </div>
            <div className="flex flex-col gap-6 flex-1">
              {ultimasGeral.map((article, i) => (
                 <article key={`geral-${article.id}`} className="flex gap-4 group cursor-pointer" onClick={() => onSelectArticle(article.id)}>
                   <div className="w-24 h-20 md:w-[100px] md:h-[75px] rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
                      <img src={article.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                   </div>
                   <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-[14px] leading-snug text-zinc-900 group-hover:text-[#cc0000] transition-colors line-clamp-3 mb-1.5">
                        {article.title}
                      </h4>
                      <span className="text-zinc-500 text-[11px] font-medium block">
                        {getRandomTime(i + 2)}
                      </span>
                   </div>
                 </article>
              ))}
            </div>
            <button className="w-full border-2 border-zinc-100 text-[#cc0000] font-black text-sm py-3 mt-8 text-center uppercase tracking-widest hover:border-[#cc0000] hover:bg-[#cc0000]/5 transition-colors rounded-lg">
               Ver mais notícias de Geral
            </button>
          </div>

          {/* Coluna 2: Cultura */}
          <div className="flex flex-col bg-white p-6 shadow-sm rounded-xl border border-zinc-100">
            <div className="flex items-center justify-between border-b-[3px] border-zinc-100 pb-3 mb-6">
              <h3 className="text-xl font-black uppercase text-zinc-950 tracking-wider">Cultura</h3>
              <button className="flex items-center text-zinc-600 font-bold text-xs hover:text-[#cc0000] uppercase tracking-wider transition-colors">
                Ver todas <ChevronRight className="w-3.5 h-3.5 ml-0.5"/>
              </button>
            </div>
            <div className="flex flex-col gap-6 flex-1">
              {ultimasCultura.map((article, i) => (
                 <article key={`cult-${article.id}`} className="flex gap-4 group cursor-pointer" onClick={() => onSelectArticle(article.id)}>
                   <div className="w-24 h-20 md:w-[100px] md:h-[75px] rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
                      <img src={article.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                   </div>
                   <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-[14px] leading-snug text-zinc-900 group-hover:text-[#cc0000] transition-colors line-clamp-3 mb-1.5">
                        {article.title}
                      </h4>
                      <span className="text-zinc-500 text-[11px] font-medium block">
                        {getRandomTime(i + 4)}
                      </span>
                   </div>
                 </article>
              ))}
            </div>
            <button className="w-full border-2 border-zinc-100 text-[#cc0000] font-black text-sm py-3 mt-8 text-center uppercase tracking-widest hover:border-[#cc0000] hover:bg-[#cc0000]/5 transition-colors rounded-lg">
               Ver mais notícias de Cultura
            </button>
          </div>

          {/* Coluna 3: Educação */}
          <div className="flex flex-col bg-white p-6 shadow-sm rounded-xl border border-zinc-100">
            <div className="flex items-center justify-between border-b-[3px] border-zinc-100 pb-3 mb-6">
              <h3 className="text-xl font-black uppercase text-zinc-950 tracking-wider">Educação</h3>
              <button className="flex items-center text-zinc-600 font-bold text-xs hover:text-[#cc0000] uppercase tracking-wider transition-colors">
                Ver todas <ChevronRight className="w-3.5 h-3.5 ml-0.5"/>
              </button>
            </div>
            <div className="flex flex-col gap-6 flex-1">
              {ultimasEducacao.map((article, i) => (
                 <article key={`edu-${article.id}`} className="flex gap-4 group cursor-pointer" onClick={() => onSelectArticle(article.id)}>
                   <div className="w-24 h-20 md:w-[100px] md:h-[75px] rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
                      <img src={article.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                   </div>
                   <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-[14px] leading-snug text-zinc-900 group-hover:text-[#cc0000] transition-colors line-clamp-3 mb-1.5">
                        {article.title}
                      </h4>
                      <span className="text-zinc-500 text-[11px] font-medium block">
                        {getRandomTime(i + 1)}
                      </span>
                   </div>
                 </article>
              ))}
            </div>
            <button className="w-full border-2 border-zinc-100 text-[#cc0000] font-black text-sm py-3 mt-8 text-center uppercase tracking-widest hover:border-[#cc0000] hover:bg-[#cc0000]/5 transition-colors rounded-lg">
               Ver mais notícias de Educação
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
