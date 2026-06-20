import React from "react";
import { Article } from "../types";
import { Compass, Calendar, ArrowUpRight, Award } from "lucide-react";

interface DiscoverModernViewProps {
  articles: Article[];
  onSelectArticle: (id: string) => void;
}

export default function DiscoverModernView({ articles, onSelectArticle }: DiscoverModernViewProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [visibleCount, setVisibleCount] = React.useState(8);

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 max-w-2xl mx-auto bg-slate-50 rounded-xl border border-dotted border-slate-300">
        <p className="text-slate-500 font-serif text-sm">Nenhum editorial cadastrado para exibição.</p>
      </div>
    );
  }

  // Filter articles by selected category
  const filteredArticles = selectedCategory
    ? articles.filter(a => a.category === selectedCategory)
    : articles;

  const mainArticle = filteredArticles[0];
  const list = filteredArticles.slice(1, visibleCount + 1);
  const hasMore = filteredArticles.length > visibleCount + 1;

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-serif">
      
      {/* 1. DISCOVER FEED CATEGORY PILLS FILTER */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-4 border-b border-slate-100 font-sans">
        {["Todos", "Tecnologia", "Economia", "Esportes"].map((cat) => {
          const isSelected = cat === "Todos" ? selectedCategory === null : selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat === "Todos" ? null : cat);
                setVisibleCount(8);
              }}
              className={`px-4.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? "bg-emerald-600 text-white shadow-xs scale-[1.02]" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {mainArticle ? (
        <>
          {/* Featured Discover Card */}
          <div 
            onClick={() => onSelectArticle(mainArticle.id)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-150 shadow-xs hover:shadow-xl transition-all duration-300 px-1"
          >
            <div className="relative aspect-16/9 overflow-hidden bg-slate-100 rounded-xl m-3">
              <img 
                referrerPolicy="no-referrer"
                src={mainArticle.imageUrl} 
                alt={mainArticle.imageAlt}
                className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-emerald-500 text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm animate-pulse">
                  RECOMENDADO HOJE
                </span>
                <span className="bg-slate-900/80 backdrop-blur-md text-slate-100 text-[10px] font-sans font-medium px-2.5 py-1 rounded-full">
                  {mainArticle.category}
                </span>
              </div>
            </div>

            <div className="p-6 pt-2">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-950 hover:text-emerald-600 transition duration-300 leading-tight">
                {mainArticle.title}
              </h2>
              <p className="font-sans text-sm text-slate-500 mt-3 leading-relaxed mb-4 line-clamp-2">
                {mainArticle.subtitle}
              </p>
              <div className="flex border-t border-slate-100 pt-4 items-center justify-between text-xs font-sans text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  {new Date(mainArticle.publishedAt).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  Assinado: <strong className="text-slate-700 font-bold">Elvis Dias (DRT {mainArticle.author.drt})</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Grid List - Elegant Rounded minimal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {list.map((article) => (
              <div 
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-150 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video overflow-hidden bg-slate-100 rounded-xl mb-4 relative">
                    <img 
                      referrerPolicy="no-referrer"
                      src={article.imageUrl} 
                      alt={article.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-2 left-2 bg-slate-900/90 text-white font-sans text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-3">
                    {article.title}
                  </h3>
                  <p className="font-sans text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {article.subtitle}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 font-sans text-[10px] text-slate-400">
                  <span className="font-sans text-emerald-600 font-semibold uppercase">✓ CONTEÚDO VERIFICADO</span>
                  <span className="hover:underline flex items-center gap-0.5 text-slate-600 font-bold">
                    Ler artigo <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* LOAD MORE TRIGGER (Carregar Mais) */}
          {hasMore && (
            <div className="pt-6 text-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 8)}
                className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-8 py-3 rounded-full font-sans font-bold text-xs uppercase tracking-wider transition hover:shadow-xs focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                Carregar mais recomendações ({filteredArticles.length - 1 - visibleCount} restantes)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 font-sans text-slate-400 text-sm italic">
          Nenhuma notícia publicada sob a categoria selecionada.
        </div>
      )}

      {/* Simple Editorial Sign Off */}
      <div className="border border-slate-150 bg-slate-50/50 rounded-2xl p-6 text-center text-slate-500 font-sans">
        <Compass className="w-8 h-8 mx-auto text-emerald-500 mb-2 animate-pulse" />
        <p className="text-xs font-bold tracking-wide uppercase text-slate-400">PORTAL E7 NEWS — INDEPENDENTE, AUTORAL, CONFIÁVEL</p>
        <p className="max-w-lg mx-auto text-[11px] text-slate-400 mt-1.5 leading-relaxed">
          Direcionado por correspondentes regionais sob supervisão direta do Jornalista Elvis Dias sob o registro oficial **DRT 1466/RO**. Foco absoluto em indexação antecipada e indexador Discover integrado.
        </p>
      </div>

    </div>
  );
}
