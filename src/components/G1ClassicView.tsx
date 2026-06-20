import React from "react";
import { Article } from "../types";
import { ArrowRight, Flame, Landmark, BookOpen, Clock, Zap, MessageSquare, LineChart } from "lucide-react";

interface G1ClassicViewProps {
  articles: Article[];
  onSelectArticle: (id: string) => void;
}

export default function G1ClassicView({ articles, onSelectArticle }: G1ClassicViewProps) {
  const [visibleCount, setVisibleCount] = React.useState(12);

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <p className="text-slate-500 text-sm font-medium">Nenhuma notícia disponível nesta categoria.</p>
      </div>
    );
  }

  // Segment articles
  const featured = articles[0];
  const bulletArticles = articles.slice(1, 4);
  const gridArticles = articles.slice(4, 10); // increased to 6 grid items for denser layout
  const listArticles = articles.slice(10);

  // Derive "Trending/Mais Lidas" based on read count
  const trendingArticles = [...articles]
    .sort((a, b) => (b.readCount || 0) - (a.readCount || 0))
    .slice(0, 6);

  const visibleListArticles = listArticles.slice(0, visibleCount);
  const hasMore = listArticles.length > visibleCount;

  return (
    <div className="space-y-8 font-sans">
      
      {/* SECTION HEADER BLOCK */}
      <div className="border-b-4 border-[#cc0000] pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl font-black text-[#cc0000] tracking-tighter uppercase flex items-center gap-2">
          <span>Destaques Principais</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[10px] bg-red-100 text-red-700 px-2.5 py-0.5 font-bold uppercase tracking-wide">PLANTÃO ONLINE</span>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider">Total: {articles.length} notícias dispostas</span>
        </div>
      </div>

      {/* 1. DENSE CLASSIC G1 HERO SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BIG PHOTO SPOTLIGHT (2/3 width) */}
        <div 
          onClick={() => onSelectArticle(featured.id)}
          className="lg:col-span-2 group cursor-pointer bg-white overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition duration-300 rounded"
        >
          <div className="relative aspect-video overflow-hidden bg-slate-100">
            <img 
              referrerPolicy="no-referrer"
              src={featured.imageUrl} 
              alt={featured.imageAlt}
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
            />
            <span className="absolute top-4 left-4 bg-[#cc0000] text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1">
              {featured.category}
            </span>
          </div>
          <div className="p-6">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight group-hover:text-[#cc0000] transition duration-200">
              {featured.title}
            </h1>
            <p className="text-sm text-slate-600 mt-3 font-normal leading-relaxed line-clamp-3">
              {featured.subtitle}
            </p>
            <div className="flex flex-wrap items-center justify-between pt-4 mt-4 border-t border-slate-100 gap-2 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-[#cc0000] font-extrabold">
                <Clock className="w-3.5 h-3.5" />
                AO VIVO
              </span>
              <span>Por: {featured.author.name.replace(" de Carvalho", "")} • DRT {featured.author.drt}</span>
            </div>
          </div>
        </div>

        {/* BULLET BULLETINS BLOCK (1/3 width) */}
        <div className="space-y-4">
          <div className="bg-slate-50 border-t-2 border-[#cc0000] p-5 h-full flex flex-col justify-between rounded-b">
            <div>
              <h3 className="text-xs font-black text-[#cc0505] tracking-widest uppercase mb-4 border-b border-rose-200/50 pb-2 flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                Destaques Relacionados
              </h3>
              <div className="space-y-4">
                {bulletArticles.map((bullet) => (
                  <div 
                    key={bullet.id}
                    onClick={() => onSelectArticle(bullet.id)}
                    className="group cursor-pointer pb-4 border-b border-dashed border-slate-200 last:border-0 last:pb-0"
                  >
                    <span className="text-[9px] font-mono font-bold text-[#cc0000] uppercase block">
                      {bullet.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug group-hover:text-[#cc0000] transition duration-200 mt-1">
                      {bullet.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{bullet.subtitle}</p>
                  </div>
                ))}
                {bulletArticles.length === 0 && (
                  <p className="text-slate-400 text-xs italic">Sem boletins auxiliares.</p>
                )}
              </div>
            </div>

            {/* Fato ou Fake embed widget */}
            <div className="bg-red-50 border-l-4 border-[#cc0000] p-4 rounded-r mt-4">
              <div className="flex items-center gap-1.5 text-[#cc0000] text-[10px] font-extrabold uppercase tracking-widest font-mono">
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                E7 Fato ou Fake
              </div>
              <h5 className="text-[11px] font-bold text-slate-900 mt-1 leading-snug">
                #FAKE: Mensagens com falsos alertas de bloqueio de Pix bancários em Rondônia roubam dados de cooperativas; saiba identificar e evitar golpes.
              </h5>
            </div>
          </div>
        </div>

      </div>

      {/* 2. RECOMENDADOS QUICK LINKS */}
      <div className="bg-neutral-50 border-y border-slate-200 py-3 px-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-700">
        <span className="text-[#cc0000] font-black uppercase text-[10px] tracking-wider flex items-center gap-1 shrink-0">
          <Zap className="w-3.5 h-3.5 text-amber-500" /> RECOMENDADO:
        </span>
        {articles.slice(3, 8).map((art) => (
          <span 
            key={art.id}
            onClick={() => onSelectArticle(art.id)}
            className="hover:text-[#cc0000] cursor-pointer transition truncate max-w-[180px] text-slate-500 hover:underline"
          >
            {art.title.slice(0, 32)}...
          </span>
        ))}
      </div>

      {/* 3. FOUR BAR GRID NEWS HIGHLIGHTS */}
      {gridArticles.length > 0 && (
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-1.5">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-[#cc0000]" />
              Painel Regional Rondônia
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {gridArticles.map((article) => (
              <div 
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="group cursor-pointer flex flex-col justify-between bg-white border border-slate-200 p-3.5 hover:shadow-sm hover:border-slate-300 transition rounded"
              >
                <div>
                  <div className="aspect-video bg-neutral-100 overflow-hidden mb-2.5 rounded">
                    <img 
                      referrerPolicy="no-referrer"
                      src={article.imageUrl} 
                      alt={article.imageAlt} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[8px] font-mono font-bold text-[#cc0000] uppercase block">
                    {article.category}
                  </span>
                  <h4 className="text-[11px] font-bold text-slate-900 leading-snug group-hover:text-[#cc0000] transition mt-1 line-clamp-3">
                    {article.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{article.subtitle}</p>
                </div>
                <div className="border-t border-slate-100 pt-2 mt-2.5 text-[9px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Há instantes</span>
                  <span className="text-[#cc0000] font-bold uppercase text-[8px]">Ver →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CHRONOLOGICAL STREAM FEEDS COMPASS + SIDEBAR COMPONENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4 border-t border-slate-200">
        
        {/* LEFT COMPONENT: 3/4 WIDTH CHRONOLOGICAL STREAM */}
        <div className="lg:col-span-3 space-y-4">
          <div className="border-b border-slate-200 pb-1.5">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#cc0000]" />
              Todas as Notícias (E7 News Stream)
            </h3>
          </div>

          <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            {visibleListArticles.map((article) => (
              <div 
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="p-5 hover:bg-slate-50/40 cursor-pointer flex flex-col sm:flex-row gap-5 transition group"
              >
                <div className="w-full sm:w-1/4 aspect-video sm:aspect-square md:aspect-video rounded overflow-hidden bg-slate-100 shrink-0">
                  <img 
                    referrerPolicy="no-referrer"
                    src={article.imageUrl} 
                    alt={article.imageAlt} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#cc0000] uppercase tracking-wide">
                      {article.category}
                    </span>
                    <h4 className="text-base font-extrabold text-[#111] leading-tight group-hover:text-[#cc0000] transition mt-1">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {article.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 pt-3 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                      {new Date(article.publishedAt).toLocaleDateString("pt-BR")} — {new Date(article.publishedAt).toLocaleTimeString("pt-BR", { hour: "numeric", minute: "2-digit" })}
                    </span>
                    <span>•</span>
                    <span className="text-neutral-500">Acessos: {article.readCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* LOAD MORE TRIGGER (Carregar Mais) */}
          {hasMore && (
            <div className="pt-4 text-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-8 py-3 rounded font-bold text-sm transition shadow-2xs hover:shadow-xs focus:ring-2 focus:ring-red-500"
              >
                Carregar mais notícias ({listArticles.length - visibleCount} restantes)
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COMPONENT: 1/4 WIDTH TRENDING SIDEBAR */}
        <div className="space-y-6">
          <div className="border-b-2 border-slate-800 pb-1.5">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <LineChart className="w-4 h-4 text-slate-700" />
              Mais lidas do E7
            </h3>
          </div>

          <div className="space-y-5">
            {trendingArticles.map((art, index) => (
              <div 
                key={art.id}
                onClick={() => onSelectArticle(art.id)}
                className="group cursor-pointer flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <div className="text-3xl font-black text-slate-300 group-hover:text-[#cc0000] leading-none text-right w-8 shrink-0">
                  {index + 1}
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono font-extrabold text-[#cc0000] uppercase tracking-wider block">
                    {art.category}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-[#cc0000] transition leading-snug line-clamp-3">
                    {art.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-mono">{art.readCount.toLocaleString("pt-BR")} visualizações</span>
                </div>
              </div>
            ))}
          </div>

          {/* EDITORIAL NEWSLETTER WIDGET */}
          <div className="bg-slate-100 border border-slate-200 p-5 rounded">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Opinião e Análise Regional</h4>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Receba análises diárias assinadas por **Elvis Dias (DRT 1466/RO)** diretamente em seu e-mail de correspondência.
            </p>
            <div className="mt-3.5 space-y-2">
              <input 
                type="email" 
                placeholder="Seu e-mail profissional" 
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-[#cc0000]"
                disabled
              />
              <button className="w-full bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider py-1.5 rounded opacity-70 cursor-not-allowed">
                Inscrever-se (Demonstração)
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
