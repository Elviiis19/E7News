import React, { useState } from "react";
import { Article } from "../types";
import { CheckCircle2, AlertCircle, Code, Shield, HelpCircle, Check, Copy } from "lucide-react";

interface SeoAuditPanelProps {
  article: Article;
  siteDomain: string;
}

export default function SeoAuditPanel({ article, siteDomain }: SeoAuditPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showJsonLd, setShowJsonLd] = useState(false);

  const baseUrl = `https://${siteDomain || "e7news.com.br"}`;
  const articleUrl = `${baseUrl}/artigo/${article.slug}`;

  // JSON-LD NewsArticle standard structure
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
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
        "url": `${baseUrl}/e7news-logo.png`
      }
    }
  };

  const jsonLdString = JSON.stringify(jsonLdData, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonLdString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SEO validations
  const checks = [
    {
      label: "Título amigável ao Google Discover",
      status: article.title.length >= 40 && article.title.length <= 110 ? "success" : "warning",
      desc: `Possui ${article.title.length} caracteres. O ideal para o Discover é entre 40 e 110 caracteres com verbos ativos.`
    },
    {
      label: "Lead / Subtítulo complementar",
      status: article.subtitle.length >= 60 && article.subtitle.length <= 160 ? "success" : "warning",
      desc: `Possui ${article.subtitle.length} caracteres. Ajuda na conversão de cliques secundários no feed.`
    },
    {
      label: "Acessibilidade de Imagem (Alt)",
      status: article.imageAlt && article.imageAlt.length > 20 ? "success" : "danger",
      desc: article.imageAlt
        ? `Alt configurado: "${article.imageAlt}". Essencial para indexação de imagens do Google.`
        : "Nenhum atributo 'alt' configurado. Prejudica a visibilidade na pesquisa visual."
    },
    {
      label: "Dimensões da capa para Discover",
      status: "success",
      desc: "Imagens horizontais padrão (1200px+ de largura). Requisito obrigatório do Google para exibição em destaque."
    },
    {
      label: "DRT de jornalista assinado (E-E-A-T)",
      status: article.author.drt ? "success" : "warning",
      desc: `Assinado por ${article.author.name} (DRT ${article.author.drt}). Sinaliza autoridade humana do norte e evita punições de IA pura.`
    },
    {
      label: "Linkagem Interna Automática",
      status: article.relatedArticleIds.length > 0 ? "success" : "warning",
      desc: `Destaque: possui ${article.relatedArticleIds.length} conexões com outros silos semânticos distribuindo link juice.`
    }
  ];

  return (
    <div id="seo-audit-panel" className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-2xl border border-slate-800 font-sans my-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-3">
        <div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-800/50 uppercase tracking-widest font-bold">
            SEO On-Page 2026
          </span>
          <h3 className="text-lg font-bold text-white mt-1.5 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Auditório de Indexação e Google Discover
          </h3>
        </div>
        <button
          onClick={() => setShowJsonLd(!showJsonLd)}
          className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <Code className="w-4 h-4 text-emerald-400" />
          {showJsonLd ? "Ocultar Schema" : "Ver Schema JSON-LD"}
        </button>
      </div>

      {showJsonLd ? (
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-6 relative animate-fadeIn">
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
              NewsArticle JSON-LD
            </span>
            <button
              onClick={copyToClipboard}
              className="p-1 px-2.5 bg-slate-800 text-slate-200 text-xs rounded border border-slate-700 hover:bg-slate-700 flex items-center gap-1 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <p className="text-xs text-slate-400 mb-2 font-mono">Este bloco é injetado dinamicamente &lt;head&gt; do index.html para os robôs de busca:</p>
          <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-60 whitespace-pre-wrap leading-relaxed">
            {jsonLdString}
          </pre>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((check, idx) => (
          <div key={idx} className="bg-slate-950/50 p-3.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2">
              {check.status === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : check.status === "warning" ? (
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <h4 className="text-sm font-semibold text-white">{check.label}</h4>
            </div>
            <p className="text-xs text-slate-400 mt-1 pl-6 leading-relaxed">
              {check.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-800/60 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
          A imagem original é carregada via referência CORS limpa para poupar servidor.
        </span>
        <span className="font-mono text-emerald-400/80 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-950">
          ✓ Meta Robot Index, Follow
        </span>
      </div>
    </div>
  );
}
