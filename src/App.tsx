import React, { useState, useEffect } from "react";
import { Article, ScrapingSource, SystemSettings } from "./types";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PortalHome from "./views/PortalHome";
import ArticleView from "./views/ArticleView";
import AdminView from "./views/AdminView";
import AboutView from "./views/AboutView";
import PrivacyView from "./views/PrivacyView";
import ContactView from "./views/ContactView";
import { getArticles, getSettings, saveArticle, saveSettings } from "./lib/db";
import { seedArticles, defaultSettings, defaultSources } from "./fakeArticles";

export default function App() {
  const [view, setView] = useState<"home" | "admin" | "article" | "about" | "privacy" | "contact">("home");
  const [selectedArticleId, setSelectedArticleId] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<ScrapingSource[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const dbSettings = await getSettings();
      if (dbSettings) {
        setSettings(dbSettings);
      } else {
        setSettings(defaultSettings);
        await saveSettings(defaultSettings); // Seed it
      }

      const dbArticles = await getArticles();
      if (dbArticles && dbArticles.length > 0) {
        setArticles(dbArticles);
      } else {
        // Seed database
        setArticles(seedArticles);
        for (const article of seedArticles) {
          await saveArticle(article);
        }
      }

      setSources(defaultSources); // Still using default sources here if we don't implement full DB for it
    } catch (err) {
      console.error("Erro carregando dados do Firebase, usando seeds locais:", err);
      setSettings(defaultSettings);
      setArticles(seedArticles);
      setSources(defaultSources);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Safe navigation handler
  const handleNavigate = (targetView: "home" | "admin" | "article" | "about" | "privacy" | "contact", articleId?: string) => {
    setView(targetView);
    if (articleId) {
      setSelectedArticleId(articleId);
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700 mb-4" aria-label="Carregando"></div>
        <p className="text-slate-700 font-bold text-sm tracking-widest uppercase">E7 News Portal — Carregando Notícias em Tempo Real...</p>
        <p className="text-sm text-slate-500 mt-2">Conectando aos servidores regionais e preparando feeds...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-[#fbfbfb]`}>
      
      {/* Universal Header */}
      <Header 
        settings={settings} 
        onNavigate={handleNavigate}
        currentView={view}
      />

      {/* Main Core Viewport */}
      <main className="flex-grow w-full" id="main-content">
        {view === "home" && (
          <PortalHome 
            articles={articles} 
            settings={settings}
            onSelectArticle={(idOrSlug) => handleNavigate("article", idOrSlug)}
          />
        )}

        {view === "article" && (
          <ArticleView 
            articleId={selectedArticleId}
            allArticles={articles}
            settings={settings}
            onNavigateBack={() => handleNavigate("home")}
            onSelectArticle={(idOrSlug) => handleNavigate("article", idOrSlug)}
          />
        )}

        {view === "admin" && (
          <AdminView 
            settings={settings}
            sources={sources}
            articles={articles}
            onRefreshData={fetchData}
          />
        )}

        {view === "about" && (
          <AboutView 
            settings={settings}
            onNavigateBack={() => handleNavigate("home")}
          />
        )}
        
        {view === "privacy" && (
          <PrivacyView />
        )}
        
        {view === "contact" && (
          <ContactView />
        )}
      </main>

      {/* Universal footer */}
      <Footer settings={settings} onNavigate={handleNavigate} />

    </div>
  );
}

