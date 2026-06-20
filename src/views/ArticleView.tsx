import React, { useEffect, useState } from "react";
import { Article, SystemSettings } from "../types";
import { ArrowLeft, Clock, Calendar, Bookmark, Share2 } from "lucide-react";

interface ArticleViewProps {
  articleId: string;
  allArticles: Article[];
  settings: SystemSettings;
  onNavigateBack: () => void;
  onSelectArticle: (id: string) => void;
}

export default function ArticleView({ articleId, allArticles, settings, onNavigateBack, onSelectArticle }: ArticleViewProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles/${articleId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar os detalhes da notícia.");
        return res.json();
      })
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [articleId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center font-sans" role="status">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700 mx-auto mb-6"></div>
        <p className="text-zinc-600 text-sm font-semibold uppercase tracking-wider">Acessando conteúdo E7 News...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center font-sans">
        <p className="text-red-700 font-bold text-lg mb-6">{error || "Artigo não encontrado."}</p>
        <button
          onClick={onNavigateBack}
          className="px-6 py-3 bg-zinc-900 text-white font-bold rounded-lg hover:bg-zinc-800 transition-colors focus:ring-4 focus:ring-zinc-400"
        >
          Voltar ao Portal Geral
        </button>
      </div>
    );
  }

  // Find related articles objects
  const relatedArticles = allArticles
    .filter((a) => article.relatedArticleIds?.includes(a.id) || a.tags.some((t) => article.tags.includes(t)))
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const richContent = article.content; // Use raw content as CSS now handles formatting beautifully

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 font-sans">
      
      {/* Back Button */}
      <button
        onClick={onNavigateBack}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-zinc-600 hover:text-red-700 transition uppercase focus:outline-none focus:ring-2 focus:ring-red-600 rounded py-1 px-2 -ml-2"
        aria-label="Voltar para página principal"
      >
        <ArrowLeft className="w-5 h-5 shrink-0" aria-hidden="true" />
        Home E7 News
      </button>

      {/* Category Tag */}
      <span className="inline-block bg-red-700 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-4 shadow-sm">
        {article.category}
      </span>

      {/* Main Title display */}
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 mb-4 leading-tight sm:leading-tight">
        {article.title}
      </h1>

      {/* Main Subtitle */}
      <p className="text-xl sm:text-2xl text-zinc-600 font-medium leading-relaxed mb-8">
        {article.subtitle}
      </p>

      {/* Inline metadata block */}
      <div className="border-t border-b border-zinc-200 py-4 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-sm text-zinc-600">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-zinc-200 bg-zinc-100">
            <img 
              referrerPolicy="no-referrer"
              src={article.author.avatarUrl} 
              alt={`Foto de ${article.author.name}`}
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <p className="font-bold text-zinc-900 text-base">
              {article.author.name}
              <span className="ml-2 text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-wide">
                DRT {article.author.drt}
              </span>
            </p>
            <p className="text-zinc-500 font-medium mt-0.5">{article.author.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-zinc-400" aria-hidden="true" />
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
            </time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-zinc-400" aria-hidden="true" />
            {new Date(article.publishedAt).toLocaleTimeString("pt-BR", { hour: "numeric", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Core Cover Image using raw parsed original URL */}
      <figure className="mb-10 w-full overflow-hidden bg-zinc-100 rounded-xl relative border border-zinc-200 shadow-sm">
        <img 
          referrerPolicy="no-referrer"
          src={article.imageUrl} 
          alt={article.imageAlt}
          className="w-full aspect-[21/9] object-cover"
        />
        <figcaption className="p-3 bg-zinc-100 text-zinc-600 text-xs shadow-inner flex items-center justify-between border-t border-zinc-200">
          <span>{article.imageAlt}</span>
          <span className="font-semibold text-zinc-500">Crédito: {article.originalSource || "E7 News Asset"}</span>
        </figcaption>
      </figure>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* News Article body Prose */}
        <div className="lg:col-span-8">
          
          <div 
            className="prose-editorial"
            dangerouslySetInnerHTML={{ __html: richContent }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              const link = target.closest("a");
              if (link) {
                const href = link.getAttribute("href");
                if (href && href.startsWith("/artigo/")) {
                  e.preventDefault();
                  const slug = href.replace("/artigo/", "");
                  onSelectArticle(slug);
                }
              }
            }}
          />

          {/* Tags cloud */}
          <div className="mt-12 pt-8 flex flex-wrap items-center gap-2" aria-label="Tags da matéria">
            <span className="text-zinc-500 font-bold uppercase text-xs mr-2">Assuntos:</span>
            {article.tags.map((tag) => (
              <a 
                href={`#tag-${tag}`}
                key={tag}
                className="bg-zinc-100 hover:bg-zinc-200 focus:ring-2 focus:ring-red-600 text-zinc-700 font-bold text-sm px-3 py-1.5 rounded-full transition-colors"
              >
                {tag}
              </a>
            ))}
          </div>

          {/* Social share widget */}
          <div className="border border-zinc-200 bg-zinc-50 rounded-xl p-6 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-zinc-500" />
              <span className="font-bold text-zinc-900">Compartilhar notícia</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="px-5 py-2.5 bg-[#1877f2] hover:bg-[#1565c0] text-white rounded-lg font-bold transition-colors focus:ring-4 focus:ring-blue-300">Facebook</button>
              <button className="px-5 py-2.5 bg-[#1da1f2] hover:bg-[#0d8ecf] text-white rounded-lg font-bold transition-colors focus:ring-4 focus:ring-blue-200">Twitter / X</button>
              <button className="px-5 py-2.5 bg-[#25d366] hover:bg-[#128c7e] text-white rounded-lg font-bold transition-colors focus:ring-4 focus:ring-green-300">WhatsApp</button>
            </div>
          </div>

        </div>

        {/* Right Recommended Column */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="text-sm font-black uppercase tracking-wider text-red-700 mb-6 flex items-center gap-2">
              <Bookmark className="w-5 h-5" aria-hidden="true" />
              Relacionadas
            </h3>
            <ul className="flex flex-col gap-6 w-full">
              {relatedArticles.map((rel) => (
                <li key={rel.id}>
                  <button 
                    onClick={() => onSelectArticle(rel.id)}
                    className="group text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600 rounded w-full"
                  >
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="text-base font-bold text-zinc-900 group-hover:text-red-700 leading-snug transition-colors">
                      {rel.title}
                    </h4>
                  </button>
                </li>
              ))}
              {relatedArticles.length === 0 && (
                <li className="text-zinc-500 text-sm">Sem reportagens relacionadas no momento.</li>
              )}
            </ul>
          </div>

        </aside>

      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://${settings.siteDomain || "e7news.com.br"}/artigo/${article.slug}`
            },
            "headline": article.title,
            "description": article.subtitle,
            "image": [article.imageUrl],
            "datePublished": article.publishedAt,
            "dateModified": article.publishedAt,
            "author": {
              "@type": "Person",
              "name": article.author.name,
              "jobTitle": article.author.role,
              "identifier": article.author.drt
            },
            "publisher": {
              "@type": "Organization",
              "name": "E7 News",
              "logo": {
                "@type": "ImageObject",
                "url": `https://${settings.siteDomain || "e7news.com.br"}/e7news-logo.png`
              }
            }
          })
        }}
      />
    </article>
  );
}
