import React, { useState, useEffect } from "react";
import { Article, SystemSettings, WebStory } from "../types";
import { ChevronRight, Zap } from "lucide-react";
// import { getWebStories } from "../lib/db";
import { timeAgo } from "../lib/utils";
import WeatherWidget from "../components/WeatherWidget";

interface PortalHomeProps {
  articles: Article[];
  settings: SystemSettings;
  onSelectArticle: (id: string) => void;
  onSelectWebStory?: (slug: string) => void;
}

export default function PortalHome({
  articles,
  settings,
  onSelectArticle,
  onSelectWebStory,
}: PortalHomeProps) {
  const [webStories, setWebStories] = useState<WebStory[]>([]);

  useEffect(() => {
    document.title = "E7 News - Tudo o que você precisa saber hoje";
    async function fetchStories() {
      const { getWebStories } = await import("../lib/db");
      const dbStories = await getWebStories();
      setWebStories(dbStories);
    }
    fetchStories();
  }, []);

  const filterCategory = (k: string) =>
    articles.filter((a) => a.category.toLowerCase().includes(k.toLowerCase()));

  const explicitHeroes = articles.filter((a) => a.isTopHeadline);
  const mainHero =
    explicitHeroes.length > 0 ? explicitHeroes[0] : articles[0] || null;

  const remainingArticles = articles.filter((a) => a.id !== mainHero?.id);

  const smallHeroes = remainingArticles.slice(0, 3);
  const destaques = remainingArticles.slice(3, 7);

  const cid = filterCategory("geral");
  const ultimasGeral = cid.length > 0 ? cid.slice(0, 3) : articles.slice(1, 4);

  const cul = filterCategory("cultura");
  const ultimasCultura =
    cul.length > 0 ? cul.slice(0, 3) : articles.slice(5, 8);

  const edu = filterCategory("educa");
  const ultimasEducacao =
    edu.length > 0 ? edu.slice(0, 3) : articles.slice(2, 5);

  const tickerNews = articles.slice(0, 6);

  return (
    <div className="w-full font-sans bg-[#fbfbfb] dark:bg-[#09090b] pb-16 transition-colors">
      <h1 className="sr-only">E7 News - Início</h1>

      {/* TICKER DE ÚLTIMAS NOTÍCIAS */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto flex">
          <div className="bg-[#cc0000] text-white font-bold uppercase py-2 px-4 sm:px-6 text-xs tracking-wider whitespace-nowrap flex-shrink-0 z-10 relative shadow-sm flex items-center">
            Últimas Notícias
          </div>
          <div className="flex-1 overflow-x-hidden flex items-center relative">
            <div className="flex items-center gap-8 whitespace-nowrap px-4 animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
              {tickerNews.map((news) => (
                <button
                  key={`ticker-${news.id}`}
                  onClick={() => onSelectArticle(news.id)}
                  className="flex items-center gap-1.5 hover:text-[#cc0000] dark:hover:text-red-500 group"
                >
                  <span className="text-[#cc0000] dark:text-red-500 text-[10px] font-black mr-1">
                    • {timeAgo(news.publishedAt)}
                  </span>
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 leading-none group-hover:underline decoration-[#cc0000] dark:decoration-red-500 transition-colors">
                    {news.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        {/* WEBSTORIES RIBBON */}
        {webStories && webStories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4 border-l-4 border-[#cc0000] pl-3 transition-colors">
              <Zap className="w-5 h-5 text-[#cc0000] dark:text-red-500" />
              WebStories Destaques
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
              {webStories.map((story) => (
                <button
                  key={story.id}
                  onClick={() =>
                    onSelectWebStory && onSelectWebStory(story.slug)
                  }
                  className="relative flex-none w-[140px] h-[240px] rounded-xl overflow-hidden group snap-center shadow-md bg-zinc-800 border-2 border-transparent hover:border-[#cc0000] transition-colors"
                >
                  {story.pages && story.pages[0] && (
                    <img
                      src={story.pages[0].imageUrl}
                      alt={story.pages[0].imageAlt}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-white text-xs font-bold leading-tight line-clamp-3 text-shadow-md">
                      {story.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MAIN HERO AND SIDE HIGHLIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-zinc-950 p-6 shadow-sm rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors">
          {/* Main Hero (Left) */}
          {mainHero && (
            <a
              href={`/${mainHero.slug || mainHero.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectArticle(mainHero.slug || mainHero.id);
              }}
              className="block lg:col-span-8 relative rounded-lg overflow-hidden group cursor-pointer aspect-[4/3] lg:aspect-auto min-h-[400px] lg:min-h-[500px]"
            >
              <img
                fetchPriority="high"
                src={mainHero.imageUrl}
                alt={mainHero.imageAlt || mainHero.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
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
                  <span className="font-medium">
                    {timeAgo(mainHero.publishedAt)}
                  </span>
                </div>
              </div>
            </a>
          )}

          {/* Small Heroes (Right) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            {smallHeroes.map((article) => (
              <article key={`sh-${article.id}`}>
                <a
                  href={`/${article.slug || article.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectArticle(article.slug || article.id);
                  }}
                  className="group flex gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg transition-colors p-2 -m-2 block"
                >
                  <div className="w-32 h-24 md:w-40 md:h-[110px] rounded-lg overflow-hidden flex-shrink-0 relative">
                    <img
                      loading="lazy"
                      src={article.imageUrl}
                      alt={article.imageAlt || article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-1 py-1">
                    <span className="text-[#cc0000] dark:text-red-500 font-black uppercase tracking-widest text-[10px] mb-1">
                      {article.category || "Geral"}
                    </span>
                    <h3 className="font-bold text-[15px] leading-snug text-zinc-900 dark:text-zinc-100 group-hover:text-[#cc0000] dark:group-hover:text-red-500 transition-colors line-clamp-3 mb-2">
                      {article.title}
                    </h3>
                    <span className="text-zinc-400 text-xs font-medium">
                      {timeAgo(article.publishedAt)}
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>

        {/* SECÇÃO: DESTAQUES (Grid 4 cards) */}
        <div className="mt-16 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-sm rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between border-b-[3px] border-zinc-100 dark:border-zinc-800 pb-3 mb-8">
            <h3 className="text-2xl font-black uppercase text-zinc-950 dark:text-white tracking-wider flex items-center gap-2 transition-colors">
              Destaques
            </h3>
            <button className="flex items-center gap-1 text-zinc-800 dark:text-zinc-300 font-bold text-sm hover:text-[#cc0000] dark:hover:text-red-500 transition-colors focus:outline-none uppercase tracking-wider">
              Ver todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destaques.map((article) => (
              <article key={`destq-${article.id}`}>
                <a
                  href={`/${article.slug || article.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectArticle(article.slug || article.id);
                  }}
                  className="group cursor-pointer flex flex-col block"
                >
                  <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-4 transition-colors">
                    <img
                      loading="lazy"
                      src={article.imageUrl}
                      alt={article.imageAlt || article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[#cc0000] dark:text-red-500 font-black uppercase tracking-widest text-[10px] mb-2 block transition-colors">
                      {article.category || "Geral"}
                    </span>
                    <h4 className="font-bold text-[17px] leading-snug text-zinc-900 dark:text-zinc-100 group-hover:text-[#cc0000] dark:group-hover:text-red-500 transition-colors line-clamp-3 mb-3">
                      {article.title}
                    </h4>
                    <div className="mt-auto pt-2">
                      <span className="text-zinc-400 text-xs font-medium">
                        {timeAgo(article.publishedAt)}
                      </span>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>

        {/* SECÇÕES: CATEGORIAS E SERVIÇOS (Grid 4 Colunas) */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-8 flex-1 pb-8">
          {/* Coluna 1: Geral */}
          <div className="flex flex-col bg-white dark:bg-zinc-950 p-6 shadow-sm rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors">
            <div className="flex items-center justify-between border-b-[3px] border-zinc-100 dark:border-zinc-800 pb-3 mb-6 transition-colors">
              <h3 className="text-xl font-black uppercase text-zinc-950 dark:text-white tracking-wider">
                Geral
              </h3>
              <button className="flex items-center text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:text-[#cc0000] dark:hover:text-red-500 uppercase tracking-wider transition-colors">
                Ver todas <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
            <div className="flex flex-col gap-6 flex-1">
              {ultimasGeral.map((article) => (
                <article key={`geral-${article.id}`}>
                  <a
                    href={`/${article.slug || article.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectArticle(article.slug || article.id);
                    }}
                    className="flex gap-4 group cursor-pointer block"
                  >
                    <div className="w-24 h-20 md:w-[100px] md:h-[75px] rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-900 transition-colors">
                      <img
                        loading="lazy"
                        src={article.imageUrl}
                        alt={article.imageAlt || article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-[14px] leading-snug text-zinc-900 dark:text-zinc-100 group-hover:text-[#cc0000] dark:group-hover:text-red-500 transition-colors line-clamp-3 mb-1.5">
                        {article.title}
                      </h4>
                      <span className="text-zinc-500 text-[11px] font-medium block">
                        {timeAgo(article.publishedAt)}
                      </span>
                    </div>
                  </a>
                </article>
              ))}
            </div>
            <button className="w-full border-2 border-zinc-100 dark:border-zinc-800 text-[#cc0000] dark:text-red-500 font-black text-sm py-3 mt-8 text-center uppercase tracking-widest hover:border-[#cc0000] dark:hover:border-red-500 hover:bg-[#cc0000]/5 transition-colors rounded-lg">
              Ver mais notícias de Geral
            </button>
          </div>

          {/* Coluna 2: Cultura */}
          <div className="flex flex-col bg-white dark:bg-zinc-950 p-6 shadow-sm rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors">
            <div className="flex items-center justify-between border-b-[3px] border-zinc-100 dark:border-zinc-800 pb-3 mb-6 transition-colors">
              <h3 className="text-xl font-black uppercase text-zinc-950 dark:text-white tracking-wider">
                Cultura
              </h3>
              <button className="flex items-center text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:text-[#cc0000] dark:hover:text-red-500 uppercase tracking-wider transition-colors">
                Ver todas <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
            <div className="flex flex-col gap-6 flex-1">
              {ultimasCultura.map((article) => (
                <article key={`cult-${article.id}`}>
                  <a
                    href={`/${article.slug || article.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectArticle(article.slug || article.id);
                    }}
                    className="flex gap-4 group cursor-pointer block"
                  >
                    <div className="w-24 h-20 md:w-[100px] md:h-[75px] rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-900 transition-colors">
                      <img
                        loading="lazy"
                        src={article.imageUrl}
                        alt={article.imageAlt || article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-[14px] leading-snug text-zinc-900 dark:text-zinc-100 group-hover:text-[#cc0000] dark:group-hover:text-red-500 transition-colors line-clamp-3 mb-1.5">
                        {article.title}
                      </h4>
                      <span className="text-zinc-500 text-[11px] font-medium block">
                        {timeAgo(article.publishedAt)}
                      </span>
                    </div>
                  </a>
                </article>
              ))}
            </div>
            <button className="w-full border-2 border-zinc-100 dark:border-zinc-800 text-[#cc0000] dark:text-red-500 font-black text-sm py-3 mt-8 text-center uppercase tracking-widest hover:border-[#cc0000] dark:hover:border-red-500 hover:bg-[#cc0000]/5 transition-colors rounded-lg">
              Ver mais notícias de Cultura
            </button>
          </div>

          {/* Coluna 3: Educação */}
          <div className="flex flex-col bg-white dark:bg-zinc-950 p-6 shadow-sm rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors">
            <div className="flex items-center justify-between border-b-[3px] border-zinc-100 dark:border-zinc-800 pb-3 mb-6 transition-colors">
              <h3 className="text-xl font-black uppercase text-zinc-950 dark:text-white tracking-wider">
                Educação
              </h3>
              <button className="flex items-center text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:text-[#cc0000] dark:hover:text-red-500 uppercase tracking-wider transition-colors">
                Ver todas <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
            <div className="flex flex-col gap-6 flex-1">
              {ultimasEducacao.map((article) => (
                <article key={`edu-${article.id}`}>
                  <a
                    href={`/${article.slug || article.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectArticle(article.slug || article.id);
                    }}
                    className="flex gap-4 group cursor-pointer block"
                  >
                    <div className="w-24 h-20 md:w-[100px] md:h-[75px] rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-900 transition-colors">
                      <img
                        loading="lazy"
                        src={article.imageUrl}
                        alt={article.imageAlt || article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-[14px] leading-snug text-zinc-900 dark:text-zinc-100 group-hover:text-[#cc0000] dark:group-hover:text-red-500 transition-colors line-clamp-3 mb-1.5">
                        {article.title}
                      </h4>
                      <span className="text-zinc-500 text-[11px] font-medium block">
                        {timeAgo(article.publishedAt)}
                      </span>
                    </div>
                  </a>
                </article>
              ))}
            </div>
            <button className="w-full border-2 border-zinc-100 dark:border-zinc-800 text-[#cc0000] dark:text-red-500 font-black text-sm py-3 mt-8 text-center uppercase tracking-widest hover:border-[#cc0000] dark:hover:border-red-500 hover:bg-[#cc0000]/5 transition-colors rounded-lg">
              Ver mais notícias de Educação
            </button>
          </div>

          {/* Coluna 4: Serviços */}
          <div className="flex flex-col">
            <WeatherWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
