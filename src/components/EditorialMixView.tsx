import React, { useState, useMemo } from "react";
import { Article } from "../types";
import { 
  Flame, 
  MapPin, 
  Clock, 
  Award, 
  TrendingUp, 
  Sparkles, 
  Coins, 
  ShieldCheck,
  CircleCheck,
  FileCheck,
  Zap
} from "lucide-react";

interface EditorialMixViewProps {
  articles: Article[];
  onSelectArticle: (id: string) => void;
}

export default function EditorialMixView({ articles, onSelectArticle }: EditorialMixViewProps) {
  // State for incremental loading -> SEO note: normally handled via pagination or infinite scroll 
  const [visibleCount, setVisibleCount] = useState(12);
  
  // Accessibility state - maintaining for actual user preference, stripped of over-complexity
  const [fontSize, setFontSize] = useState<"base" | "lg" | "xl">("base");
  const [contrastTheme, setContrastTheme] = useState<"standard" | "high-contrast">("standard");

  // Semantic grouping
  const mainSpotlight = articles[0]; 
  const breakingNews = useMemo(() => articles.slice(1, 5), [articles]); 
  const fastUpdates = useMemo(() => articles.slice(5, 9), [articles]);

  const columnists = [
    {
      name: "Elvis Dias", drt: "1466/RO",
      avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=150&q=80",
      role: "Policial & Tecnologia 2026",
      quote: "Por que as agrotechs rondonienses dominam o cenário digital na safra de 2026.",
      topicId: "ai-discover-2026-revolucao"
    },
    {
      name: "Sabrina Viana", drt: "4112/RO",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      role: "Inovação no Campo",
      quote: "IA no diagnóstico de pragas: Economia real para as lavouras do interior.",
      topicId: "proc-tec-3-ji-parana-desponta-com-coope-10"
    }
  ];

  const lotteryResults = {
    megasena: { concurso: "2842", dezenas: ["12", "24", "29", "35", "41", "55"], status: "Acumulou! R$ 45 Milhões" },
    lotofacil: { concurso: "3130", dezenas: ["01", "02", "04", "05", "08", "09", "11", "12", "14", "15"], status: "3 Ganhadores" }
  };

  const techArticles = useMemo(() => articles.filter(a => a.category === "Tecnologia").slice(0, 3), [articles]);
  const agroArticles = useMemo(() => articles.filter(a => a.category === "Economia").slice(0, 3), [articles]);

  const feedArticles = useMemo(() => articles.slice(9), [articles]);
  const visibleFeedArticles = useMemo(() => feedArticles.slice(0, visibleCount), [feedArticles, visibleCount]);
  const hasMore = feedArticles.length > visibleCount;

  // Accessibility styling helpers
  const fontClass = {
    base: "text-base leading-relaxed",
    lg: "text-lg leading-relaxed",
    xl: "text-xl leading-loose"
  }[fontSize];

  const bgClass = contrastTheme === "high-contrast" ? "bg-black text-white" : "bg-zinc-50 text-zinc-900";
  const cardClass = contrastTheme === "high-contrast" ? "bg-zinc-900 border-zinc-700 text-white" : "bg-white border-zinc-200 text-zinc-900 shadow-sm";
  const textMutedClass = contrastTheme === "high-contrast" ? "text-zinc-400" : "text-zinc-600";
  const linkHoverClass = contrastTheme === "high-contrast" ? "hover:text-amber-400 focus:text-amber-400" : "hover:text-red-700 focus:text-red-700";

  return (
    <div className={`min-h-screen transition-colors duration-200 ${bgClass} font-sans`}>
      
      {/* A11Y NAVIGATION BAR - SEMANTIC TAG <nav> */}
      <nav aria-label="Acessibilidade e Configurações" className={`px-4 py-3 border-b ${contrastTheme === 'high-contrast' ? 'border-zinc-800 bg-black' : 'border-zinc-200 bg-white'} sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-6">
          <span className="font-bold tracking-tight text-sm uppercase flex items-center gap-2">
            <Award className="w-4 h-4 text-red-600" aria-hidden="true" />
            Portal E7
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2" role="group" aria-label="Tamanho da fonte">
            <span className={textMutedClass}>Texto:</span>
            <button 
              onClick={() => setFontSize("base")}
              aria-pressed={fontSize === "base"}
              className={`px-3 py-1 rounded-md transition-colors ${fontSize === 'base' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
            >
              A
            </button>
            <button 
              onClick={() => setFontSize("lg")}
              aria-pressed={fontSize === "lg"}
              className={`px-3 py-1 rounded-md transition-colors ${fontSize === 'lg' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
            >
              A+
            </button>
            <button 
              onClick={() => setFontSize("xl")}
              aria-pressed={fontSize === "xl"}
              className={`px-3 py-1 rounded-md transition-colors ${fontSize === 'xl' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
            >
              A++
            </button>
          </div>

          <div className="flex items-center gap-2" role="group" aria-label="Contraste">
            <span className={textMutedClass}>Contraste:</span>
            <button 
              onClick={() => setContrastTheme(prev => prev === "standard" ? "high-contrast" : "standard")}
              aria-pressed={contrastTheme === "high-contrast"}
              className={`px-3 py-1 rounded-md transition-colors ${contrastTheme === 'high-contrast' ? 'bg-amber-400 text-black font-bold' : 'bg-zinc-800 text-white'}`}
            >
              {contrastTheme === "high-contrast" ? "Padrão" : "Alto Contraste"}
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA - SEMANTIC TAG <main> */}
      <main id="main-content" className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${fontClass}`}>
        
        <h1 className="sr-only">E7 News - As principais notícias de Rondônia, Brasil e Mundo</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* LEFT COLUMN: HERO ARTICLE & FAST UPDATES */}
          <section aria-labelledby="manchete-principal" className="lg:col-span-8 flex flex-col gap-8">
            {/* HERO ARTICLE - SEMANTIC <article> */}
            {mainSpotlight && (
              <article 
                className="group cursor-pointer flex flex-col gap-4"
                onClick={() => onSelectArticle(mainSpotlight.id)}
                aria-labelledby={`article-title-${mainSpotlight.id}`}
              >
                <header>
                  <span className="text-red-700 dark:text-red-400 font-bold uppercase tracking-wider text-sm block mb-2">
                    {mainSpotlight.category}
                  </span>
                  <h2 id={`article-title-${mainSpotlight.id}`} className={`text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight ${linkHoverClass} transition-colors duration-200`}>
                    {mainSpotlight.title}
                  </h2>
                </header>
                
                <p className={`text-lg sm:text-xl lg:text-2xl mt-2 ${textMutedClass} leading-snug`}>
                  {mainSpotlight.subtitle}
                </p>

                {mainSpotlight.imageUrl && (
                  <figure className="mt-4 w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-xl bg-zinc-200">
                    <img 
                      src={mainSpotlight.imageUrl}
                      alt={mainSpotlight.imageAlt || `Imagem descritiva para a notícia: ${mainSpotlight.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </figure>
                )}

                <footer className="mt-2 flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  <time dateTime={new Date().toISOString()} className="flex items-center gap-1"><Clock className="w-4 h-4" aria-hidden="true" /> Atualizado recentemente</time>
                  <span aria-hidden="true">&bull;</span>
                  <span>Por {mainSpotlight.author?.name || 'Redação E7'}</span>
                </footer>
              </article>
            )}

            <hr className={`border-t ${contrastTheme === 'high-contrast' ? 'border-zinc-800' : 'border-zinc-200'}`} aria-hidden="true" />

            {/* BREAKING NEWS / SUB - SEMANTIC <section> */}
            <section aria-labelledby="noticias-de-destaque">
              <h3 id="noticias-de-destaque" className="sr-only">Mais Notícias em Destaque</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {breakingNews.map(item => (
                  <article 
                    key={item.id}
                    className="group cursor-pointer flex flex-col gap-2"
                    onClick={() => onSelectArticle(item.id)}
                  >
                    <span className="text-red-700 dark:text-red-400 font-bold uppercase tracking-wider text-xs">
                      {item.category}
                    </span>
                    <h4 className={`text-xl font-bold leading-tight ${linkHoverClass} transition-colors`}>
                      {item.title}
                    </h4>
                    {item.imageUrl && (
                      <figure className="mt-2 w-full aspect-video overflow-hidden rounded-lg bg-zinc-200">
                        <img 
                          src={item.imageUrl}
                          alt={item.imageAlt || `Imagem decorativa para: ${item.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </figure>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </section>

          {/* RIGHT COLUMN: SIDEBAR DATA & OPINION (UOL STYLE SIDEBAR BUT CLEANER) -> SEMANTIC <aside> */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
            
            {/* FAST BULLETINS */}
            <section aria-labelledby="giro-noticias" className={`p-6 rounded-2xl border ${cardClass}`}>
              <header className="flex items-center gap-2 mb-6 align-middle border-b pb-4 border-inherit">
                 <Zap className="w-5 h-5 text-amber-500" aria-hidden="true" />
                 <h3 id="giro-noticias" className="font-bold text-lg uppercase tracking-wide">Giro Rápido</h3>
              </header>
              <ul className="flex flex-col gap-4">
                {fastUpdates.map(item => (
                  <li key={item.id}>
                    <button 
                      className={`text-left w-full group ${linkHoverClass} focus:outline-none`}
                      onClick={() => onSelectArticle(item.id)}
                    >
                      <span className="text-red-700 dark:text-red-400 font-bold uppercase tracking-wider text-xs block mb-1">
                        {item.category}
                      </span>
                      <span className={`font-semibold text-base leading-snug line-clamp-3 ${contrastTheme === 'high-contrast' ? 'text-zinc-200 group-hover:text-amber-400' : 'text-zinc-800 group-hover:text-red-700'}`}>
                        {item.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* OPINION & COLUMNISTS */}
            <section aria-labelledby="opiniao-colunistas" className={`p-6 rounded-2xl border ${cardClass}`}>
              <header className="flex items-center gap-2 mb-6 align-middle border-b pb-4 border-inherit">
                 <Award className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                 <h3 id="opiniao-colunistas" className="font-bold text-lg uppercase tracking-wide">Opinião</h3>
              </header>
              <ul className="flex flex-col gap-6">
                {columnists.map((col, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <img src={col.avatar} alt={`Foto de ${col.name}`} className="w-12 h-12 rounded-full object-cover shadow-sm bg-zinc-200" loading="lazy" />
                    <div>
                      <span className="font-bold block text-sm">{col.name}</span>
                      <span className={`text-xs block mb-1 ${textMutedClass}`}>{col.role}</span>
                      <button 
                        className={`text-left font-serif font-medium leading-snug text-base italic ${linkHoverClass}`}
                        onClick={() => onSelectArticle(col.topicId)}
                        aria-label={`Ler artigo de opinião de ${col.name}: ${col.quote}`}
                      >
                        "{col.quote}"
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* LOTTERIES UTILITY */}
            <section aria-labelledby="servicos-loterias" className={`p-6 rounded-2xl border ${cardClass}`}>
               <header className="flex items-center gap-2 mb-6 align-middle border-b pb-4 border-inherit">
                 <Coins className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                 <h3 id="servicos-loterias" className="font-bold text-lg uppercase tracking-wide">Loterias</h3>
              </header>
              <div className="space-y-6">
                 <div>
                   <h4 className="font-bold text-sm uppercase tracking-wider text-green-700 dark:text-green-400 mb-2">Mega-Sena</h4>
                   <p className={`text-xs mb-2 ${textMutedClass}`}>Concurso {lotteryResults.megasena.concurso} • {lotteryResults.megasena.status}</p>
                   <div className="flex flex-wrap gap-2">
                     {lotteryResults.megasena.dezenas.map(d => (
                       <span key={d} className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-mono font-bold text-sm">{d}</span>
                     ))}
                   </div>
                 </div>
                 <hr className={`border-t ${contrastTheme === 'high-contrast' ? 'border-zinc-800' : 'border-zinc-200'}`} aria-hidden="true" />
                 <div>
                   <h4 className="font-bold text-sm uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-2">Lotofácil</h4>
                   <p className={`text-xs mb-2 ${textMutedClass}`}>Concurso {lotteryResults.lotofacil.concurso} • {lotteryResults.lotofacil.status}</p>
                   <div className="flex flex-wrap gap-2">
                     {lotteryResults.lotofacil.dezenas.slice(0, 10).map(d => (
                       <span key={d} className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-sm">{d}</span>
                     ))}
                   </div>
                 </div>
              </div>
            </section>

          </aside>
        </div>

        {/* HORIZONTAL THEMATIC BLOCKS (BENTO/R7 STYLE BUT SEMANTIC AND CLEAN) */}
        <section aria-labelledby="blocos-tematicos" className="mb-12">
          <h2 id="blocos-tematicos" className="sr-only">Editoriais Especializados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Tech Block */}
             <div className={`p-6 rounded-2xl border ${cardClass}`}>
                <header className="flex items-center gap-2 mb-6 border-b pb-4 border-inherit">
                  <Sparkles className="w-6 h-6 text-blue-500" aria-hidden="true" />
                  <h3 className="font-bold text-xl uppercase tracking-wide">Tecnologia</h3>
                </header>
                <div className="flex flex-col gap-6">
                  {techArticles.map(item => (
                     <article key={item.id} className="group cursor-pointer" onClick={() => onSelectArticle(item.id)}>
                        <h4 className={`font-bold text-lg mb-1 leading-tight ${linkHoverClass}`}>{item.title}</h4>
                        <p className={`text-sm ${textMutedClass} line-clamp-2`}>{item.subtitle}</p>
                     </article>
                  ))}
                </div>
             </div>

             {/* Agro Block */}
             <div className={`p-6 rounded-2xl border ${cardClass}`}>
                <header className="flex items-center gap-2 mb-6 border-b pb-4 border-inherit">
                  <Flame className="w-6 h-6 text-green-600" aria-hidden="true" />
                  <h3 className="font-bold text-xl uppercase tracking-wide">Agronegócio</h3>
                </header>
                <div className="flex flex-col gap-6">
                  {agroArticles.map(item => (
                     <article key={item.id} className="group cursor-pointer" onClick={() => onSelectArticle(item.id)}>
                        <h4 className={`font-bold text-lg mb-1 leading-tight ${linkHoverClass}`}>{item.title}</h4>
                        <p className={`text-sm ${textMutedClass} line-clamp-2`}>{item.subtitle}</p>
                     </article>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* FEED / CHRONOLOGICAL INDEX */}
        <section aria-labelledby="acervo-noticias" className={`pt-12 border-t ${contrastTheme === 'high-contrast' ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <header className="mb-8">
            <h2 id="acervo-noticias" className="font-black text-2xl uppercase tracking-tight flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-red-600" aria-hidden="true" />
              Últimas Notícias
            </h2>
            <p className={`mt-2 ${textMutedClass}`}>Acompanhe a linha do tempo da nossa cobertura.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visibleFeedArticles.map((article) => (
              <article 
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className={`group cursor-pointer flex flex-col gap-3 rounded-xl overflow-hidden`}
              >
                {article.imageUrl && (
                  <figure className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-200 border border-zinc-200 dark:border-zinc-800">
                    <img 
                      src={article.imageUrl}
                      alt={article.imageAlt || `Imagem decorativa para: ${article.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </figure>
                )}
                <div>
                  <span className="text-red-700 dark:text-red-400 font-bold uppercase tracking-wider text-xs block mb-1">
                    {article.category}
                  </span>
                  <h3 className={`font-bold text-lg leading-snug line-clamp-3 mb-2 ${linkHoverClass}`}>
                    {article.title}
                  </h3>
                  <footer className={`flex items-center gap-2 text-xs font-medium ${textMutedClass}`}>
                     <time dateTime={new Date().toISOString()} className="flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" /> 
                        {article.readCount} views
                     </time>
                  </footer>
                </div>
              </article>
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="px-8 py-3 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-bold rounded-lg transition-colors focus:ring-4 focus:ring-zinc-400 focus:outline-none"
                aria-label={`Carregar mais ${feedArticles.length - visibleCount} notícias`}
              >
                Carregar Mais Notícias
              </button>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
