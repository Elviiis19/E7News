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
import TermsView from "./views/TermsView";
import CookiesView from "./views/CookiesView";
import WebStoryView from "./views/WebStoryView";
import CookieBanner from "./components/CookieBanner";
import { getArticles, getSettings, saveArticle, saveSettings } from "./lib/db";
import { seedArticles, defaultSettings, defaultSources } from "./fakeArticles";

export default function App() {
  const [view, setView] = useState<"home" | "admin" | "article" | "about" | "privacy" | "contact" | "terms" | "cookies" | "webstory">("home");
  const [selectedArticleId, setSelectedArticleId] = useState<string>("");
  const [selectedWebStorySlug, setSelectedWebStorySlug] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<ScrapingSource[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(false);

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

      try {
        const sourcesRes = await fetch("/api/sources");
        if (sourcesRes.ok) {
          const fetchedSources = await sourcesRes.json();
          setSources(fetchedSources.length > 0 ? fetchedSources : defaultSources);
        } else {
          setSources(defaultSources);
        }
      } catch {
        setSources(defaultSources);
      }
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
    const checkPath = () => {
      const path = window.location.pathname;
      if (path.startsWith("/artigo/")) {
        const slug = path.split("/artigo/")[1];
        if (slug) {
          setSelectedArticleId(slug);
          setView("article");
        }
      } else if (path.startsWith("/webstories/")) {
        const slug = path.split("/webstories/")[1];
        if (slug) {
          setSelectedWebStorySlug(slug);
          setView("webstory");
        }
      } else if (path === "/sobre") setView("about");
      else if (path === "/contato") setView("contact");
      else if (path === "/privacidade") setView("privacy");
      else if (path === "/termos") setView("terms");
      else if (path === "/cookies") setView("cookies");
      else if (path === "/e7-admin") setView("admin");
      else setView("home");
    };

    fetchData().then(() => {
      checkPath();
    });
    
    // Listen for browser back/forward buttons
    window.addEventListener("popstate", checkPath);
    
    // Check dark mode preference
    const isDark = localStorage.getItem('e7news-theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => window.removeEventListener("popstate", checkPath);
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const nowDark = !prev;
      if (nowDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('e7news-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('e7news-theme', 'light');
      }
      return nowDark;
    });
  };

  // Safe navigation handler
  const handleNavigate = (targetView: "home" | "admin" | "article" | "about" | "privacy" | "contact" | "terms" | "cookies" | "webstory", articleId?: string) => {
    setView(targetView);
    let newPath = "/";
    if (articleId && targetView === "article") {
      setSelectedArticleId(articleId);
      newPath = `/artigo/${articleId}`;
    } else if (articleId && targetView === "webstory") {
      setSelectedWebStorySlug(articleId);
      newPath = `/webstories/${articleId}`;
    } else if (targetView === "about") newPath = "/sobre";
    else if (targetView === "contact") newPath = "/contato";
    else if (targetView === "privacy") newPath = "/privacidade";
    else if (targetView === "terms") newPath = "/termos";
    else if (targetView === "cookies") newPath = "/cookies";
    else if (targetView === "admin") newPath = "/e7-admin";

    window.history.pushState({}, "", newPath);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex flex-col justify-center items-center font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cc0000]" aria-label="Carregando"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Universal Header */}
      <Header 
        settings={settings} 
        onNavigate={handleNavigate}
        currentView={view}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      {/* Main Core Viewport */}
      <main className="flex-grow w-full" id="main-content">
        {view === "home" && (
          <PortalHome 
            articles={articles} 
            settings={settings}
            onSelectArticle={(idOrSlug) => handleNavigate("article", idOrSlug)}
            onSelectWebStory={(slug) => handleNavigate("webstory", slug)}
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
            onNavigateBack={() => handleNavigate("home")}
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
        
        {view === "terms" && (
          <TermsView />
        )}
        
        {view === "cookies" && (
          <CookiesView />
        )}

        {view === "webstory" && (
          <WebStoryView 
            storySlug={selectedWebStorySlug}
            onClose={() => handleNavigate("home")} 
          />
        )}
      </main>

      {/* Universal footer */}
      <Footer settings={settings} onNavigate={handleNavigate} />
      <CookieBanner onNavigate={handleNavigate} />
    </div>
  );
}

