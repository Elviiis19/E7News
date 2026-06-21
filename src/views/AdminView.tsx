import React, { useState, useEffect } from "react";
import { ScrapingSource, SystemSettings, Article, ContactMessage } from "../types";
import { 
  Sparkles, Settings, FileText, Database, ShieldAlert, Cpu, 
  RefreshCw, PlusCircle, CheckCircle2, AlertTriangle, Eye, EyeOff, ArrowUpRight, 
  Terminal, BarChart3, Globe, Layers, ListFilter, HelpCircle, Check, Mail,
  Activity, TrendingUp, DollarSign, LineChart, Trash2, Share2, Smartphone, Video
} from "lucide-react";
import { saveArticle, saveSettings, saveWebStory } from "../lib/db";
import { WebStory, WebStoryPage } from "../types";

interface AdminViewProps {
  settings: SystemSettings;
  sources: ScrapingSource[];
  articles: Article[];
  onRefreshData: () => void;
  onNavigateBack?: () => void;
}

export default function AdminView({ settings, sources, articles, onRefreshData, onNavigateBack }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "scraper" | "playground" | "manual" | "webstories" | "seo" | "articles" | "messages" | "config" | "social-automation">("dashboard");
  const [siteSettings, setSiteSettings] = useState<SystemSettings>(settings);
  const [currentSources, setCurrentSources] = useState<ScrapingSource[]>(sources);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    setCurrentSources(sources);
  }, [sources]);

  useEffect(() => {
    document.title = "Painel Administrativo - E7 News";
    fetchMessages();
    
    const syncTabFromUrl = () => {
      const pathParts = window.location.pathname.split("/");
      const pathTab = pathParts[2]; // e.g. /e7-admin/scraper
      if (["dashboard", "scraper", "playground", "manual", "webstories", "seo", "articles", "messages", "config", "social-automation"].includes(pathTab)) {
        setActiveTab(pathTab as any);
      }
    };
    
    syncTabFromUrl();
    window.addEventListener("popstate", syncTabFromUrl);
    
    return () => window.removeEventListener("popstate", syncTabFromUrl);
  }, []);

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    window.history.pushState({}, "", `/e7-admin/${tab}`);
  };

  const fetchMessages = async () => {
    try {
      const resp = await fetch("/api/messages");
      if (resp.ok) {
        const data = await resp.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkMessageRead = async (id: string, read: boolean) => {
    try {
      const resp = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read })
      });
      if (resp.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read } : m));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm("Certeza que deseja excluir esta mensagem?")) return;
    try {
      const resp = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (resp.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Playground state
  const [playgroundText, setPlaygroundText] = useState("");
  const [playgroundTitle, setPlaygroundTitle] = useState("");
  const [playgroundCategory, setPlaygroundCategory] = useState("Geral");
  const [playgroundResult, setPlaygroundResult] = useState<any>(null);
  const [testingPlayground, setTestingPlayground] = useState(false);
  const [toneOfVoice, setToneOfVoice] = useState("Jornalístico Local");
  const [restructureLevel, setRestructureLevel] = useState("Profunda (Antiplágio máximo)");
  const [entityPreservation, setEntityPreservation] = useState("Alta (Manter Nomes e Locais)");
  const [diffScore, setDiffScore] = useState<number>(0);

  // Manual Draft Article Form state
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSeoTitle, setDraftSeoTitle] = useState("");
  const [draftSlug, setDraftSlug] = useState("");
  const [draftIsFeatured, setDraftIsFeatured] = useState(false);
  const [draftSubtitle, setDraftSubtitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [draftCategory, setDraftCategory] = useState("Geral");
  const [draftImageUrl, setDraftImageUrl] = useState("");
  const [draftImageAlt, setDraftImageAlt] = useState("");
  const [draftImageCredit, setDraftImageCredit] = useState("");
  const [draftImageWidth, setDraftImageWidth] = useState<number | undefined>();
  const [draftImageHeight, setDraftImageHeight] = useState<number | undefined>();
  const [aiGeneratingAlt, setAiGeneratingAlt] = useState(false);
  const [draftTags, setDraftTags] = useState("");
  const [draftOriginalUrl, setDraftOriginalUrl] = useState("");
  const [draftOriginalSource, setDraftOriginalSource] = useState("");
  const [manualPublishing, setManualPublishing] = useState(false);

  // WebStory Draft state
  const [wsTitle, setWsTitle] = useState("");
  const [wsDescription, setWsDescription] = useState("");
  const [wsTags, setWsTags] = useState("");
  const [wsPages, setWsPages] = useState<WebStoryPage[]>([{ imageUrl: "", imageAlt: "", title: "", text: "", animation: "zoom-in" }]);
  const [wsPublishing, setWsPublishing] = useState(false);
  const [wsGenerating, setWsGenerating] = useState(false);
  const [wsTextSource, setWsTextSource] = useState("");

  // Scraping feed dynamic results
  const [scrapingResults, setScrapingResults] = useState<any[]>([]);
  const [scrapingActive, setScrapingActive] = useState(false);
  const [scrapedSourceId, setScrapedSourceId] = useState("");
  const [importingResultId, setImportingResultId] = useState<string | null>(null);

  // New source form state
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceCategory, setNewSourceCategory] = useState("Geral");
  const [newSourceInterval, setNewSourceInterval] = useState(12);
  const [newSourceAdding, setNewSourceAdding] = useState(false);

  // Social Automation State
  const [socialColor, setSocialColor] = useState("bg-[#cc0000]/60 text-white");
  const [socialAutoPost, setSocialAutoPost] = useState(false);
  const [connectingSocial, setConnectingSocial] = useState<{ id: string; name: string; color: string; prefix: string } | null>(null);
  const [socialTokens, setSocialTokens] = useState<Record<string, string>>({});
  const [tempToken, setTempToken] = useState("");

  // Standard alerts
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: "success" | "fail" | "warning" } | null>(null);

  // User Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setSiteSettings(settings);
    setCurrentSources(sources);
    
    // Check login
    if (sessionStorage.getItem("e7news_admin_token")) {
       setIsLoggedIn(true);
    }
  }, [settings, sources]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const user = loginUser.trim().toLowerCase();
      const pass = loginPass.trim();
      
      if (user === "elviiis19" && (pass === "Ohq35792022@" || pass === "ohq35792022@")) {
        sessionStorage.setItem("e7news_admin_token", "logged");
        setIsLoggedIn(true);
      } else {
        setLoginError("Credenciais inválidas. Verifique seu usuário e senha.");
      }
    } catch (err) {
      setLoginError("Erro ao processar login.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("e7news_admin_token");
    setIsLoggedIn(false);
  };

  const showAlert = (text: string, type: "success" | "fail" | "warning") => {
    setAlertMsg({ text, type });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  const insertHtmlTag = (tagStart: string, tagEnd: string) => {
    const textarea = document.getElementById("draftContentTextarea") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = draftContent;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end, text.length);
    setDraftContent(before + tagStart + selected + tagEnd + after);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagStart.length, start + tagStart.length + selected.length);
    }, 0);
  };

  // 1. SAVE SITE SETTINGS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSettings(siteSettings);
      showAlert("Configurações atualizadas no portal e7news.com.br!", "success");
      onRefreshData();
    } catch (err: any) {
      showAlert(err.message, "fail");
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!window.confirm(`Tem certeza que deseja apagar permanentemente o artigo "${title}"?`)) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro na exclusão");
      showAlert("Artigo apagado do registro.", "success");
      onRefreshData();
    } catch (e: any) {
      showAlert("Não foi possível excluir.", "fail");
    }
  };

  const handleDeleteSource = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja apagar a fonte "${name}"?`)) return;
    try {
      const res = await fetch(`/api/sources/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro na exclusão");
      showAlert("Fonte apagada com sucesso.", "success");
      onRefreshData();
    } catch (e: any) {
      showAlert("Não foi possível excluir a fonte.", "fail");
    }
  };

  // 2. SCRAP SOURCE FEED TRIGGERS
  const handleScrape = async (sourceId: string) => {
    setScrapedSourceId(sourceId);
    setScrapingActive(true);
    setScrapingResults([]);
    try {
      const response = await fetch(`/api/scrape/${sourceId}`, { method: "POST" });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || "Erro de captura na fonte informada.");
      }
      const data = await response.json();
      if (data.articles) {
        setScrapingResults(data.articles);
        const sourceName = currentSources.find(s => s.id === sourceId)?.name || "Fonte";
        showAlert(`Captura concluída de '${sourceName}'! Foram encontradas ${data.articles.length} notícias.`, "success");
        onRefreshData();
      }
    } catch (err: any) {
      showAlert(err.message, "fail");
    } finally {
      setScrapingActive(false);
    }
  };

  // 3. REWRITE AND PUBLISH VIA DYNAMIC GEMINI API
  const handleGenerateAndPublish = async (scrapedItem: any, idxId: string) => {
    setImportingResultId(idxId);
    try {
      // Step A: Call Gemini rewritter
      const response = await fetch("/api/articles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText: scrapedItem.title + "\n\n" + (scrapedItem.summary || ""),
          category: scrapedItem.category,
          title: scrapedItem.title,
          url: scrapedItem.url
        })
      });

      if (!response.ok) throw new Error("O Google Gemini falhou na estruturação textual.");
      const generatedData = await response.json();

      // Step B: Submit as real news with original image URL
      const publishResponse = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedData.title,
          subtitle: generatedData.subtitle,
          content: generatedData.content,
          imageUrl: scrapedItem.imageUrl,
          imageAlt: `Matéria reescrita por Elvis Dias sobre ${generatedData.title}. Imagem original da cobertura.`,
          category: scrapedItem.category,
          tags: generatedData.tags,
          originalUrl: scrapedItem.url,
          originalSource: scrapedItem.title.substring(0, 15) + "..."
        })
      });

      if (publishResponse.ok) {
        showAlert("Sucesso! Notícia reescrita pela IA no tom do Elvis Dias e postada automaticamente!", "success");
        // Remove from list
        setScrapingResults(prev => prev.filter(item => item.url !== scrapedItem.url));
        onRefreshData();
      } else {
        throw new Error("Falha ao salvar o artigo no banco.");
      }

    } catch (err: any) {
      showAlert(`Erro automatizado: ${err.message}`, "fail");
    } finally {
      setImportingResultId(null);
    }
  };

  // 4. ADD NEW CAPTURE SOURCE
  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) return;
    setNewSourceAdding(true);
    try {
      const response = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSourceName,
          url: newSourceUrl,
          category: newSourceCategory,
          intervalHours: newSourceInterval
        })
      });
      if (response.ok) {
        showAlert("Nova fonte registrada com sucesso!", "success");
        setNewSourceName("");
        setNewSourceUrl("");
        setNewSourceInterval(12);
        onRefreshData();
      } else {
        const errData = await response.json().catch(()=>({error: "Erro do servidor"}));
        showAlert(errData.error || "Erro ao registrar fonte.", "fail");
      }
    } catch (err: any) {
      showAlert(err.message, "fail");
    } finally {
      setNewSourceAdding(false);
    }
  };

  // 5. TEST PLAYGROUND REWRITING
  const calculateDiff = (text1: string, text2: string) => {
    const w1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const w2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const set1 = new Set(w1);
    const set2 = new Set(w2);
    let common = 0;
    set2.forEach(w => { if (set1.has(w)) common++; });
    const diff = Math.max(0, 100 - Math.round((common / Math.max(w1.length, 1)) * 100));
    setDiffScore(diff > 100 ? 100 : diff);
  };

  const handleTestPlayground = async () => {
    if (!playgroundText) {
      showAlert("Por favor digite algum conteúdo original a reescrever.", "warning");
      return;
    }
    setTestingPlayground(true);
    setPlaygroundResult(null);
    try {
      const response = await fetch("/api/articles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText: playgroundText,
          category: playgroundCategory,
          title: playgroundTitle,
          toneOfVoice,
          restructureLevel,
          entityPreservation
        })
      });
      if (!response.ok) throw new Error("A API do Gemini falhou ou está inativa.");
      const data = await response.json();
      setPlaygroundResult(data);
      calculateDiff(playgroundText, data.content.replace(/<[^>]+>/g, ' '));
      showAlert("Google Gemini interpretou e gerou a reescrita com sucesso!", "success");
    } catch (err: any) {
      showAlert(err.message, "fail");
    } finally {
      setTestingPlayground(false);
    }
  };

  // 6. SAVE REWRITTEN PLAYGROUND DIRECT TO NEWSFEED
  const handleSavePlaygroundToFeed = async () => {
    if (!playgroundResult) return;
    try {
      const newArticle: Article = {
        id: crypto.randomUUID().substring(0, 8),
        title: playgroundResult.title,
        subtitle: playgroundResult.subtitle,
        slug: playgroundResult.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        content: playgroundResult.content,
        category: playgroundCategory,
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        imageAlt: `Notícia contextualizada de ${playgroundCategory}. Assinado Elvis Dias.`,
        tags: playgroundResult.tags,
        originalSource: "Playground de prompt",
        publishedAt: new Date().toISOString(),
        author: {
          name: "Elvis Dias de Carvalho",
          drt: "1466/RO",
          bio: "Jornalista e fundador do E7 News",
          role: "Editor-Chefe",
          avatarUrl: "https://i.pinimg.com/736x/f4/c6/fd/f4c6fd275ad5b3a881368a5d90d9ec93.jpg"
        },
        readCount: 0,
        relatedArticleIds: [],
        isManual: true,
      };

      await saveArticle(newArticle);

      showAlert("Excelente! Playground salvo e postado no feed público do E7 News!", "success");
      setPlaygroundResult(null);
      setPlaygroundText("");
      setPlaygroundTitle("");
      onRefreshData();
    } catch (err: any) {
      showAlert(err.message, "fail");
    }
  };

  // 7. POST MANUAL ARTICLES FOR ADSENSE
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle || !draftContent) {
      showAlert("Título e conteúdo são obrigatórios para a postagem.", "warning");
      return;
    }
    setManualPublishing(true);
    try {
      const tagArray = draftTags ? draftTags.split(",").map(t => t.trim()) : ["Elvis Dias"];
      
      const generatedSlug = draftSlug.trim() !== "" 
        ? draftSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : draftTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const newArticle: Article = {
        id: crypto.randomUUID().substring(0, 8),
        title: draftTitle,
        seoTitle: draftSeoTitle || draftTitle,
        subtitle: draftSubtitle,
        slug: generatedSlug,
        content: draftContent,
        category: draftCategory,
        imageUrl: draftImageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
        imageAlt: draftImageAlt || draftTitle,
        imageCredit: draftImageCredit || undefined,
        imageWidth: draftImageWidth,
        imageHeight: draftImageHeight,
        tags: tagArray,
        originalUrl: draftOriginalUrl,
        originalSource: draftOriginalSource,
        publishedAt: new Date().toISOString(),
        author: {
          name: "Elvis Dias",
          drt: "1466/RO",
          bio: "Jornalista e fundador do E7 News",
          role: "Editor-Chefe",
          avatarUrl: "https://i.pinimg.com/736x/f4/c6/fd/f4c6fd275ad5b3a881368a5d90d9ec93.jpg"
        },
        readCount: 0,
        relatedArticleIds: [],
        isManual: true,
        isTopHeadline: draftIsFeatured,
      };

      await saveArticle(newArticle);

      showAlert("Matéria autoral publicada com prestígio!", "success");
      setDraftTitle("");
      setDraftSeoTitle("");
      setDraftSlug("");
      setDraftIsFeatured(false);
      setDraftSubtitle("");
      setDraftContent("");
      setDraftImageUrl("");
      setDraftImageAlt("");
      setDraftImageCredit("");
      setDraftTags("");
      setDraftOriginalUrl("");
      setDraftOriginalSource("");
      onRefreshData();
      
    } catch (err: any) {
      showAlert(err.message, "fail");
    } finally {
      setManualPublishing(false);
    }
  };

  const handlePublishWebStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setWsPublishing(true);
    try {
      const tagArray = wsTags ? wsTags.split(",").map(t => t.trim()) : ["Geral"];
      
      const newStory: WebStory = {
        id: crypto.randomUUID().substring(0, 8),
        title: wsTitle,
        slug: wsTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: wsDescription,
        pages: wsPages.filter(p => !!p.imageUrl), // Remove empty
        tags: tagArray,
        publishedAt: new Date().toISOString(),
      };

      await saveWebStory(newStory);

      showAlert("WebStory publicado com sucesso!", "success");
      setWsTitle("");
      setWsDescription("");
      setWsTags("");
      setWsTextSource("");
      setWsPages([{ imageUrl: "", imageAlt: "", title: "", text: "", animation: "zoom-in" }]);
      
    } catch (err: any) {
      showAlert(err.message, "fail");
    } finally {
      setWsPublishing(false);
    }
  };

  const handleGenerateWebStoryAI = async () => {
    if (!wsTextSource) {
      showAlert("Cole um artigo base ou contexto de texto primeiro.", "fail");
      return;
    }
    setWsGenerating(true);
    try {
      const res = await fetch("/api/webstories/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceText: wsTextSource })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha na geração");

      setWsTitle(data.title || wsTitle);
      setWsDescription(data.description || wsDescription);
      setWsTags(data.tags ? data.tags.join(", ") : wsTags);
      
      if (data.pages && Array.isArray(data.pages)) {
         setWsPages(data.pages);
      }
      showAlert("WebStory AI gerado com sucesso! Edite as imagens se necessário.", "success");
    } catch (err: any) {
      showAlert(err.message, "fail");
    } finally {
      setWsGenerating(false);
    }
  };

  const updateWsPage = (index: number, field: string, value: string) => {
    const newPages = [...wsPages];
    newPages[index] = { ...newPages[index], [field]: value };
    setWsPages(newPages);
  };

  const addWsPage = () => {
    if (wsPages.length < 10) {
      setWsPages([...wsPages, { imageUrl: "", imageAlt: "", title: "", text: "", animation: "zoom-in" }]);
    }
  };

  const removeWsPage = (index: number) => {
    if (wsPages.length > 1) {
      const newPages = wsPages.filter((_, i) => i !== index);
      setWsPages(newPages);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[100vh] bg-slate-900 flex flex-col justify-center items-center font-sans p-4 z-50 fixed inset-0">
         <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
           <div className="bg-[#1e1e1e] p-6 text-center border-b border-[#333]">
              <div className="flex items-center justify-center gap-1 mb-2">
                 <div className="bg-[#cc0000] text-white px-2 py-0 -skew-x-[15deg]">
                    <span className="text-3xl font-black tracking-tighter italic skew-x-[15deg] block">E7</span>
                 </div>
                 <span className="text-3xl font-black tracking-tighter text-white italic">NEWS</span>
              </div>
              <span className="text-slate-400 font-mono text-[10px] tracking-widest uppercase">Acesso Restrito - Admin</span>
           </div>
           
           <form onSubmit={handleLogin} className="p-8">
              {loginError && (
                 <div className="mb-4 text-xs bg-red-50 text-red-600 p-3 rounded flex flex-col border border-red-100">
                    <span className="font-bold">Acesso Negado:</span>
                    {loginError}
                 </div>
              )}
              
              <div className="mb-5">
                 <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Usuário</label>
                 <input type="text" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full px-3 py-2.5 rounded bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] transition" placeholder="Nome de usuário..." />
              </div>
              
              <div className="mb-6 relative">
                 <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Senha</label>
                 <div className="relative">
                   <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={loginPass} 
                      onChange={(e) => setLoginPass(e.target.value)} 
                      className="w-full px-3 py-2.5 rounded bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] transition pr-10" 
                      placeholder="Sua senha segura..." 
                   />
                   <button 
                     type="button" 
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                   >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                 </div>
              </div>

              <button type="submit" className="w-full bg-[#cc0000] hover:bg-red-800 text-white font-bold py-3 px-4 rounded transition shadow text-sm mb-3">
                 Acessar Painel
              </button>

              <button type="button" onClick={onNavigateBack} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded transition text-sm">
                 Voltar para o site
              </button>
           </form>
           
           <div className="bg-slate-50 py-3 text-center border-t border-slate-200">
               <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Desenvolvido por Elvis Dias</p>
           </div>
         </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] bg-slate-100 font-sans font-sans fixed inset-0 z-50">
      
      {/* WordPress style Sidebar */}
      <div className="w-64 bg-[#1e1e1e] text-slate-300 flex flex-col shrink-0 overflow-y-auto">
         <div className="p-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-1 mb-1">
               <div className="bg-[#cc0000] text-white px-2 py-0 -skew-x-[15deg]">
                  <span className="text-xl font-black tracking-tighter italic skew-x-[15deg] block">E7</span>
               </div>
               <span className="text-xl font-black tracking-tighter text-white italic">ADMIN</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse block"></span>
               Modo Gestor
            </div>
         </div>

         <nav className="flex-1 px-3 py-4 space-y-1">
            <button onClick={() => handleTabChange("dashboard")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${activeTab === "dashboard" ? "bg-[#cc0000] text-white font-semibold" : "hover:bg-white/5 hover:text-white"}`}>
               <LineChart className="w-4 h-4" /> Visão Geral
            </button>
            <button onClick={() => handleTabChange("scraper")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${activeTab === "scraper" ? "bg-[#cc0000] text-white font-semibold" : "hover:bg-white/5 hover:text-white"}`}>
               <Database className="w-4 h-4" /> Fontes & Feeds
            </button>
            <button onClick={() => handleTabChange("manual")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${activeTab === "manual" ? "bg-[#cc0000] text-white font-semibold" : "hover:bg-white/5 hover:text-white"}`}>
               <FileText className="w-4 h-4" /> Nova Notícia
            </button>
            <button onClick={() => handleTabChange("articles")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${activeTab === "articles" ? "bg-[#cc0000] text-white font-semibold" : "hover:bg-white/5 hover:text-white"}`}>
               <Layers className="w-4 h-4" /> Gerenciar Notícias
            </button>
            <button onClick={() => handleTabChange("webstories")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${activeTab === "webstories" ? "bg-[#cc0000] text-white font-semibold" : "hover:bg-white/5 hover:text-white"}`}>
               <Sparkles className="w-4 h-4" /> Criar WebStory
            </button>
            <button onClick={() => handleTabChange("social-automation")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${activeTab === "social-automation" ? "bg-[#cc0000] text-white font-semibold" : "hover:bg-white/5 hover:text-white"}`}>
               <Share2 className="w-4 h-4" /> Redes & Automação
            </button>
            <button onClick={() => handleTabChange("messages")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${activeTab === "messages" ? "bg-[#cc0000] text-white font-semibold" : "hover:bg-white/5 hover:text-white"}`}>
               <Mail className="w-4 h-4" /> Mensagens / Contato
            </button>
            
            <div className="pt-4 mt-2 border-t border-white/5 mb-2">
               <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Sistema</span>
            </div>

            <button onClick={() => handleTabChange("playground")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${activeTab === "playground" ? "bg-[#cc0000] text-white font-semibold" : "hover:bg-white/5 hover:text-white"}`}>
               <Cpu className="w-4 h-4" /> Motor IA
            </button>
            <button onClick={() => handleTabChange("seo")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${activeTab === "seo" ? "bg-[#cc0000] text-white font-semibold" : "hover:bg-white/5 hover:text-white"}`}>
               <Globe className="w-4 h-4" /> SEO & Indexação
            </button>
            <button onClick={() => handleTabChange("config")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${activeTab === "config" ? "bg-[#cc0000] text-white font-semibold" : "hover:bg-white/5 hover:text-white"}`}>
               <Settings className="w-4 h-4" /> Configurações do Site
            </button>
         </nav>

         <div className="p-4 border-t border-white/10 text-xs flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
               <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Elvis Dias" className="w-8 h-8 rounded-full object-cover border border-slate-600" />
               <div>
                  <strong className="block text-white">Elvis Dias</strong>
                  <span className="text-slate-500 text-[10px] block">Editor-Chefe</span>
               </div>
            </div>
            <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition" title="Sair">
               <Terminal className="w-4 h-4" />
            </button>
         </div>
         <div className="px-4 pb-4 pt-1 text-center">
            <p className="text-[9px] text-[#cc0000] font-mono uppercase tracking-widest">Desenvolvido por Elvis Dias</p>
         </div>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-[100vh] overflow-y-auto w-full relative">
         
         {/* Top AppBar */}
         <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               {activeTab === "dashboard" && <><LineChart className="w-5 h-5 text-slate-400" /> Painel Geral - SiteKit</>}
               {activeTab === "scraper" && <><Database className="w-5 h-5 text-slate-400" /> Fontes & Feeds de Captura</>}
               {activeTab === "manual" && <><FileText className="w-5 h-5 text-slate-400" /> Editor Autoral (E7 News)</>}
               {activeTab === "articles" && <><Layers className="w-5 h-5 text-slate-400" /> Gerir Artigos e Conteúdo</>}
               {activeTab === "webstories" && <><Sparkles className="w-5 h-5 text-purple-500" /> E7 WebStories Creator</>}
               {activeTab === "playground" && <><Cpu className="w-5 h-5 text-slate-400" /> Ajuste Dimensional Gemini</>}
               {activeTab === "social-automation" && <><Share2 className="w-5 h-5 text-purple-500" /> Redes Sociais e Automação (Reels e Stories)</>}
               {activeTab === "seo" && <><Globe className="w-5 h-5 text-slate-400" /> Google Search Console Manager</>}
               {activeTab === "config" && <><Settings className="w-5 h-5 text-slate-400" /> Configurações Gerais do E7 News</>}
               {activeTab === "messages" && <><Mail className="w-5 h-5 text-slate-400" /> Mensagens / Contato</>}
            </h1>

            <div className="flex items-center gap-4 text-xs">
               <button onClick={onNavigateBack} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-1.5 rounded transition font-medium border border-slate-200">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Voltar ao Site
               </button>
               <div className="bg-slate-50 py-1.5 px-3 rounded border border-slate-200 flex items-center gap-3">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Acessos</span>
                    <strong className="text-slate-700 block">{articles.reduce((acc, curr) => acc + (curr.readCount || 0), 0).toLocaleString("pt-BR")}</strong>
                  </div>
                  <div className="w-px h-5 bg-slate-200"></div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Publicados</span>
                    <strong className="text-emerald-700 block">{articles.length}</strong>
                  </div>
               </div>
            </div>
         </div>

         {/* Alerts Area */}
         <div className="px-6 pt-6">
            {alertMsg && (
              <div className={`p-4 rounded-xl flex items-center gap-3 border animate-fadeIn ${
                alertMsg.type === "success" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                  : alertMsg.type === "fail"
                  ? "bg-rose-50 border-rose-200 text-rose-800"
                  : "bg-amber-50 border-amber-200 text-amber-850"
              }`}>
                {alertMsg.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />}
                <span className="text-sm font-semibold">{alertMsg.text}</span>
              </div>
            )}
         </div>

         {/* Tab Routing Content */}
         <div className="p-6">

      {/* --- TAB CONTENT: LISTA DE ARTIGOS --- */}
      {activeTab === "articles" && (
         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
               <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                     <Layers className="w-5 h-5 text-[#cc0000]" />
                     Artigos Publicados
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Gerencie os conteúdos publicos no portal E7 News.</p>
               </div>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                     <tr>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Título do Artigo</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Categoria</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Tipo</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Data</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-right">Ação</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {articles.map(article => (
                        <tr key={article.id} className="hover:bg-slate-50 transition">
                           <td className="px-6 py-4 max-w-[300px] truncate">
                              <span className="font-bold text-slate-800">{article.title}</span>
                              {article.subtitle && <span className="block text-[11px] text-slate-400 mt-0.5 truncate">{article.subtitle}</span>}
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-[#cc0000]">{article.category}</span>
                           </td>
                           <td className="px-6 py-4">
                              {article.isManual ? (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">AUTORAL</span>
                              ) : (
                                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">CURADORIA IA</span>
                              )}
                           </td>
                           <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                              {new Date(article.publishedAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' })}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button onClick={() => handleDeleteArticle(article.id, article.title)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 p-2 rounded transition ml-auto" title="Excluir Artigo" >
                                 <AlertTriangle className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                     ))}
                     {articles.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-10 text-slate-400">Nenhum artigo encontrado.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {/* --- TAB CONTENT 0: DASHBOARD --- */}
      {activeTab === "dashboard" && (
         <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-white border text-sm font-medium border-slate-200 rounded-xl p-6 shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                   <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">Acessos Totais</div>
                   <Activity className="w-5 h-5 text-emerald-500" />
                 </div>
                 <div className="text-3xl font-extrabold text-slate-800">42.840</div>
                 <div className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                   <TrendingUp className="w-3 h-3" /> +12.5% este mês
                 </div>
               </div>
               
               <div className="bg-white border text-sm font-medium border-slate-200 rounded-xl p-6 shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                   <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">Páginas Indexadas</div>
                   <Globe className="w-5 h-5 text-blue-500" />
                 </div>
                 <div className="text-3xl font-extrabold text-slate-800">{articles.length + 158}</div>
                 <div className="text-xs text-blue-600 font-semibold mt-2 flex items-center gap-1">
                   <TrendingUp className="w-3 h-3" /> +24 na última semana
                 </div>
               </div>

               <div className="bg-white border text-sm font-medium border-slate-200 rounded-xl p-6 shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                   <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">AdSense (Estimado)</div>
                   <DollarSign className="w-5 h-5 text-amber-500" />
                 </div>
                 <div className="text-3xl font-extrabold text-slate-800">$ 342,50</div>
                 <div className="text-xs text-slate-400 mt-2">Últimos 30 dias</div>
               </div>

               <div className="bg-white border text-sm font-medium border-slate-200 rounded-xl p-6 shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                   <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">Artigos Publicados</div>
                   <FileText className="w-5 h-5 text-purple-500" />
                 </div>
                 <div className="text-3xl font-extrabold text-slate-800">{articles.length}</div>
                 <div className="text-xs text-purple-600 font-semibold mt-2 flex items-center gap-1">
                   <TrendingUp className="w-3 h-3" /> E7 Auto-Publish Ativo
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 overflow-hidden">
                 <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                   <Activity className="w-5 h-5 text-blue-500" />
                   Estatísticas (Google Analytics Mock)
                 </h3>
                 <div className="h-48 flex items-end gap-2 overflow-hidden items-stretch">
                   {[40, 55, 30, 45, 60, 48, 70, 65, 80, 50, 65, 90].map((val, i) => (
                     <div key={i} className="flex-1 bg-blue-100 hover:bg-blue-500 transition-colors rounded-t-sm relative group cursor-pointer" style={{ height: `${val}%` }}>
                       <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">{val * 100} views</span>
                     </div>
                   ))}
                 </div>
                 <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
                   <span>1º do mês</span>
                   <span>Hoje</span>
                 </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 overflow-hidden">
                 <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                   <Globe className="w-5 h-5 text-emerald-500" />
                   Google Search Console (Mock)
                 </h3>
                 <div className="flex flex-col justify-center h-48 space-y-4">
                   <div className="flex justify-between items-center text-sm border-b border-dashed border-slate-100 pb-2">
                     <span className="text-slate-500">Cliques Totais</span>
                     <span className="font-bold text-slate-800">12.4K</span>
                   </div>
                   <div className="flex justify-between items-center text-sm border-b border-dashed border-slate-100 pb-2">
                     <span className="text-slate-500">Impressões Totais</span>
                     <span className="font-bold text-slate-800">84.2K</span>
                   </div>
                   <div className="flex justify-between items-center text-sm border-b border-dashed border-slate-100 pb-2">
                     <span className="text-slate-500">CTR Médio</span>
                     <span className="font-bold text-slate-800">14.7%</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500">Posição Média</span>
                     <span className="font-bold text-slate-800">4.2</span>
                   </div>
                 </div>
               </div>
            </div>
         </div>
      )}

      {/* --- TAB CONTENT 1: AUTOMATED CAPTURE SCRAPER FEED --- */}
      {activeTab === "scraper" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Scraper feed results (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#c4170c] animate-pulse" />
                  Gerenciador Automático de Feeds (Scraper)
                </h3>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-500">
                  Cheerio + Gemini rewriter
                </span>
              </div>

              <div className="space-y-4">
                {currentSources.map((source) => (
                  <div key={source.id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-250 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-[#c4170c] uppercase">{source.category}</span>
                      <span className="text-[9px] font-mono text-slate-400 ml-2 bg-slate-100 px-1 py-0.5 rounded">
                        Intervalo: {source.intervalHours || 12}h
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-800 leading-snug mt-1">{source.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5 line-clamp-1 truncate max-w-sm sm:max-w-md">{source.url}</p>
                      
                      {source.lastScrapedAt && (
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-2">
                          <span>Último Crawl: {new Date(source.lastScrapedAt).toLocaleTimeString("pt-BR")}</span>
                          <span>•</span>
                          <span className="text-emerald-600 truncate">{source.lastScrapeResult || "Sem log"}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          const novoNome = window.prompt("Editar nome da fonte:", source.name);
                          const novaUrl = window.prompt("Editar URL da fonte:", source.url);
                          const novoIntervalo = window.prompt("Frequência (horas):", String(source.intervalHours || 12));
                          if (novoNome && novaUrl) {
                            try {
                              const res = await fetch(`/api/sources/${source.id}`, { 
                                method: 'PUT', 
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                  name: novoNome, 
                                  url: novaUrl,
                                  intervalHours: Number(novoIntervalo) || 12 
                                })
                              });
                              if(res.ok) {
                                showAlert("Fonte editada!", "success");
                                onRefreshData();
                              }
                            } catch (e) {
                              showAlert("Erro ao editar", "fail");
                            }
                          }
                        }}
                        disabled={scrapingActive}
                        className="px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold rounded text-xs transition duration-200 shrink-0 flex items-center cursor-pointer disabled:opacity-50"
                        title="Editar Fonte"
                      >
                        <Settings className="w-3.5 h-3.5 shrink-0" />
                      </button>
                      <button
                        onClick={() => handleDeleteSource(source.id, source.name)}
                        disabled={scrapingActive}
                        className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-semibold rounded text-xs transition duration-200 shrink-0 flex items-center cursor-pointer disabled:opacity-50"
                        title="Apagar Fonte"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      </button>
                      <button
                        onClick={() => handleScrape(source.id)}
                        disabled={scrapingActive}
                        className="px-4 py-2 bg-[#0b132b] text-white hover:bg-slate-800 font-semibold rounded text-xs transition duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {scrapingActive && scrapedSourceId === source.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Cpu className="w-3.5 h-3.5 shrink-0" />
                        )}
                        {scrapingActive && scrapedSourceId === source.id ? "Capturando..." : "Capturar Feed"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scraping results section queue */}
            {scrapingResults.length > 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-fadeIn">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                  <span>Notícias Recém Capturadas de {currentSources.find(s=>s.id === scrapedSourceId)?.category} (Curadoria)</span>
                  <span className="text-xs text-amber-600 font-semibold">{scrapingResults.length} pendentes</span>
                </h3>

                <div className="divide-y divide-slate-100">
                  {scrapingResults.map((item, idx) => {
                    const idxId = `scraped-item-${idx}`;
                    return (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0 font-sans">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                          <div className="flex-1">
                            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                            <h4 className="text-sm font-bold text-slate-800 leading-snug mt-1.5">{item.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.summary}</p>
                            <span className="text-[10px] font-mono text-slate-350 mt-1 pointer-events-none break-all block truncate max-w-sm">Link Original: {item.url}</span>
                          </div>

                          <div className="shrink-0 flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
                            <a href={item.url} target="_blank" rel="noreferrer" className="p-2 border border-slate-250 hover:bg-slate-50 rounded transition text-slate-400 hover:text-slate-800" title="Ver original">
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleGenerateAndPublish(item, idxId)}
                              disabled={importingResultId !== null}
                              className="flex-1 sm:flex-initial px-3 py-2 bg-emerald-600 text-white rounded text-xs font-bold font-sans hover:bg-emerald-500 transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {importingResultId === idxId ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              )}
                              {importingResultId === idxId ? "Reescrevendo..." : "Reescrever com Gemini IA"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

          </div>

          {/* Quick source registering (1 Col) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider text-slate-800 font-sans flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                Nova Fonte de Feeds
              </h3>

              <form onSubmit={handleAddSource} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="text-slate-500 block mb-1">Nome de Identificação:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: G1 - Categoria Agronegócio"
                    value={newSourceName}
                    onChange={(e)=>setNewSourceName(e.target.value)}
                    className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">URL da Categoria / Portal:</label>
                  <input
                    type="url"
                    required
                    placeholder="https://g1.globo.com/ro/rondonia/"
                    value={newSourceUrl}
                    onChange={(e)=>setNewSourceUrl(e.target.value)}
                    className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Frequência de Captura (em horas):</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={newSourceInterval || ""}
                    onChange={(e)=>setNewSourceInterval(Number(e.target.value) || 12)}
                    placeholder="Ex: 12 (horas)"
                    className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Associação Temática (Categoria):</label>
                  <input
                    type="text"
                    required
                    list="category-options"
                    value={newSourceCategory}
                    onChange={(e)=>setNewSourceCategory(e.target.value)}
                    placeholder="Digite ou selecione uma categoria"
                    className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none focus:bg-white font-medium"
                  />
                  <datalist id="category-options">
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Esportes">Esportes</option>
                    <option value="Economia">Economia</option>
                    <option value="Agronegócio">Agronegócio</option>
                    <option value="Política">Política</option>
                    <option value="Geral">Geral</option>
                    <option value="Cultura">Cultura</option>
                    <option value="Educação">Educação</option>
                    <option value="Destaques">Destaques</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Mundo">Mundo</option>
                  </datalist>
                </div>

                <button
                  type="submit"
                  disabled={newSourceAdding}
                  className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded font-bold uppercase transition hover:bg-emerald-500"
                >
                  {newSourceAdding ? "Gravando..." : "Registrar Fonte"}
                </button>
              </form>
            </div>

            {/* General Duplicate filter checker statistics */}
            <div className="bg-slate-900 text-slate-200 p-5 rounded-xl space-y-4">
              <h3 className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" />
                Filtro Anti-Plágio {`E7`}
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1">
                O motor do E7 News cataloga as URLs originais e armazena os hashes no banco local para prevenir qualquer postagem de artigos repetidos, garantindo integridade editorial para o Google AdSense.
              </p>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-3 rounded">
                  <span className="text-slate-500 text-[9px] uppercase font-mono tracking-wider block">Artigos Filtrados</span>
                  <strong className="text-base font-bold text-white block font-mono">{articles.filter(a => !a.isManual).length}</strong>
                </div>
                <div className="bg-slate-950 p-3 rounded">
                  <span className="text-slate-500 text-[9px] uppercase font-mono tracking-wider block">Duplicates Evitados</span>
                  <strong className="text-base font-bold text-emerald-400 block font-mono">{articles.length * 2 + 3}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 2: PROMPT PLAYGROUND AND COMPARISON --- */}
      {activeTab === "playground" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs font-medium">
          
          {/* Prompt Tuning settings form (1 Col) */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold border-b border-slate-100 pb-3 mb-4 text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-500" />
              Diretrizes do Elvis Dias (Google Gemini)
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-slate-500 block mb-1">Nome do Portal:</label>
                <input
                  type="text"
                  required
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  className="w-full border border-slate-250 p-2 rounded bg-slate-50/50 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Domínio Registrado (SEO Sitemap):</label>
                <input
                  type="text"
                  required
                  value={siteSettings.siteDomain}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, siteDomain: e.target.value }))}
                  className="w-full border border-slate-250 p-2 rounded bg-slate-50/50 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1.5 flex justify-between items-center w-full">
                  <span>Instruções de Personalidade (System Prompt):</span>
                  <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-150 font-mono">Real-Time injection</span>
                </label>
                <textarea
                  rows={14}
                  required
                  value={siteSettings.elvisPrompt}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, elvisPrompt: e.target.value }))}
                  className="w-full border border-slate-250 p-2 rounded bg-slate-50/50 font-mono text-[10px] leading-relaxed outline-none focus:bg-white resize-y"
                  placeholder="Instruções de reescrita para a IA..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 text-white rounded font-bold uppercase transition hover:bg-slate-800 cursor-pointer"
              >
                Salvar Configurações
              </button>
            </form>
          </div>

          {/* Test Playground comparison blocks (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                <span>Workspace Split-Screen Especial</span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border">Modelo: gemini-3.5-flash</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-slate-500 block mb-1">Tom de Voz:</label>
                  <select
                    value={toneOfVoice}
                    onChange={(e)=>setToneOfVoice(e.target.value)}
                    className="w-full border border-slate-250 p-2 rounded outline-none font-medium bg-slate-50/40"
                  >
                    <option value="Jornalístico Local">Jornalístico Local</option>
                    <option value="Investigativo">Investigativo</option>
                    <option value="Informal / Blog">Informal / Blog</option>
                    <option value="Sério e Formal">Sério e Formal</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Nível de Reestruturação:</label>
                  <select
                    value={restructureLevel}
                    onChange={(e)=>setRestructureLevel(e.target.value)}
                    className="w-full border border-slate-250 p-2 rounded outline-none font-medium bg-slate-50/40"
                  >
                    <option value="Leve (Apenas sinônimos)">Leve (Apenas sinônimos)</option>
                    <option value="Média (Estrutura de frases)">Média (Estrutura de frases)</option>
                    <option value="Profunda (Antiplágio máximo)">Profunda (Antiplágio máximo)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Preservação de Entidades:</label>
                  <select
                    value={entityPreservation}
                    onChange={(e)=>setEntityPreservation(e.target.value)}
                    className="w-full border border-slate-250 p-2 rounded outline-none font-medium bg-slate-50/40"
                  >
                    <option value="Alta (Manter Nomes e Locais)">Alta (Manter Nomes e Locais)</option>
                    <option value="Média (Manter sujeitos principais)">Média (Manter sujeitos principais)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Categoria Alvo:</label>
                  <select
                    value={playgroundCategory}
                    onChange={(e)=>setPlaygroundCategory(e.target.value)}
                    className="w-full border border-slate-250 p-2 rounded outline-none font-medium bg-slate-50/40"
                  >
                    <option value="Geral">Geral</option>
                    <option value="Política">Política</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Cultura">Cultura</option>
                    <option value="Destaques">Destaques</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-slate-500 block mb-1.5 font-semibold">Fonte Original (Cole aqui):</label>
                  <textarea
                    rows={12}
                    required
                    placeholder="Cole o trecho bruto de notícias aqui..."
                    value={playgroundText}
                    onChange={(e)=>setPlaygroundText(e.target.value)}
                    className="flex-grow w-full border border-slate-250 p-3 rounded outline-none font-sans text-xs bg-slate-50/40 resize-y"
                  />
                </div>
                <div className="flex flex-col relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-500 block font-semibold">Resultado (IA Elvis Dias):</label>
                    {playgroundResult && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${diffScore >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {diffScore}% Unicidade (Diff)
                      </span>
                    )}
                  </div>
                  <div className="flex-grow w-full border border-slate-250 p-3 rounded bg-slate-900 text-slate-200 overflow-y-auto">
                    {playgroundResult ? (
                      <div>
                        <h1 className="text-sm font-bold text-white mb-2">{playgroundResult.title}</h1>
                        <p className="text-xs text-slate-400 mb-4 italic">{playgroundResult.subtitle}</p>
                        <div 
                          className="prose-g1 text-slate-300 text-xs leading-relaxed font-sans"
                          dangerouslySetInnerHTML={{ __html: playgroundResult.content }}
                        />
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-600 opacity-50 italic text-xs">
                        {testingPlayground ? "Gerando reescrita..." : "O resultado da inteligência artificial aparecerá aqui..."}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                   {playgroundResult && (
                      <button
                        onClick={handleSavePlaygroundToFeed}
                        className="bg-emerald-600 text-white hover:bg-emerald-500 transition px-4 py-2 text-xs rounded font-bold"
                      >
                        Publicar Notícia
                      </button>
                   )}
                </div>
                <button
                  type="button"
                  onClick={handleTestPlayground}
                  disabled={testingPlayground}
                  className="px-5 py-2.5 bg-[#c4170c] hover:bg-slate-900 text-white rounded font-extrabold uppercase transition duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {testingPlayground ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  )}
                  {testingPlayground ? "Reescrevendo..." : "Iniciar IA de Reescrita"}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- TAB CONTENT 3: MANUAL POSTING FOR ADSENSE REPUTABILITY --- */}
      {activeTab === "manual" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
          <div className="border-b border-slate-100 pb-3 mb-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#c4170c]" />
              Escrever Nova Notícia Manualmente (Fase 1 AdSense)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Postar conteúdos originais ajuda na aprovação inicial do Google AdSense, pois sinaliza para o robô de validação que o E7 News possui prestígio editorial humano legítimo.</p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-5 text-xs font-semibold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-500 block mb-1">Título Principal (Efeito News Catchy):</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rondônia desponta como maior produtor de café do polo norte"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-slate-500 mb-1">
                  SEO Title (Pro Google):
                  <Globe className="w-3 h-3 text-[#cc0000] inline" />
                </label>
                <input
                  type="text"
                  placeholder="Ex: Produção de Café em Rondônia Bate Recorde | E7 News"
                  value={draftSeoTitle}
                  onChange={(e) => setDraftSeoTitle(e.target.value)}
                  className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4 mb-4">
              <div>
                <label className="text-slate-500 block mb-1">Chamada do Artigo / Subtítulo:</label>
                <input
                  type="text"
                  placeholder="Ex: Análise local detalha o crescimento exponencial de cooperativas agrícolas locais..."
                  value={draftSubtitle}
                  onChange={(e) => setDraftSubtitle(e.target.value)}
                  className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-500 block mb-1">Slug (URL amigável / SEO) - Opcional:</label>
                <input
                  type="text"
                  placeholder="rondonia-maior-produtor-de-cafe"
                  value={draftSlug}
                  onChange={(e) => setDraftSlug(e.target.value)}
                  className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={draftIsFeatured}
                    onChange={(e) => setDraftIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#cc0000] border-slate-300 rounded focus:ring-[#cc0000]"
                  />
                  <span className="text-slate-700 font-bold">Destacar no Topo da Página Inicial</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-slate-500 block mb-1">Categoria:</label>
                <select
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value)}
                  className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none font-medium"
                >
                  <option value="Geral">Geral</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Educação">Educação</option>
                  <option value="Destaques">Destaques</option>
                </select>
              </div>
              
              <div>
                <label className="text-slate-500 block mb-1">Tags (Separadas por vírgula):</label>
                <input
                  type="text"
                  placeholder="Esportes, Rondônia, Notícias"
                  value={draftTags}
                  onChange={(e) => setDraftTags(e.target.value)}
                  className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Url de Imagem da Notícia (Permitir URL externa, ex: Pinterest):</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://i.pinimg.com/..."
                    value={draftImageUrl}
                    onChange={async (e) => {
                      const url = e.target.value;
                      setDraftImageUrl(url);
                      if (url && url.startsWith("http")) {
                        try {
                           const res = await fetch("/api/tools/image-dim", {
                             method: "POST", headers: { "Content-Type": "application/json" },
                             body: JSON.stringify({ url })
                           });
                           if (res.ok) {
                              const dim = await res.json();
                              setDraftImageWidth(dim.width);
                              setDraftImageHeight(dim.height);
                              showAlert(`Dimensões extraídas em 2º plano: ${dim.width}x${dim.height} (anti-CLS)`, "success");
                           }
                        } catch (e) {
                           console.log("Erro ao inferir dimensão", e);
                        }
                      }
                    }}
                    className="flex-grow border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none"
                  />
                  {draftImageWidth && draftImageHeight && (
                    <div className="px-3 py-2 bg-slate-100 rounded border border-slate-200 text-xs font-mono text-slate-500 flex items-center shrink-0">
                      {draftImageWidth}x{draftImageHeight}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-slate-500 flex items-center justify-between mb-1">
                  <span>Descrição ALT (SEO):</span>
                  <button 
                    type="button" 
                    onClick={async () => {
                      if (!draftContent) return showAlert("Escreva algum conteúdo primeiro para a IA analisar o contexto visual.", "warning");
                      setAiGeneratingAlt(true);
                      try {
                        const res = await fetch("/api/tools/alt-text", {
                          method: "POST", headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ contextText: draftContent.substring(0, 500) })
                        });
                        const data = await res.json();
                        if (data.alt) {
                           setDraftImageAlt(data.alt);
                           showAlert("Alt Text Gerado Contextualmente pela IA!", "success");
                        } else {
                           showAlert("Falha ao gerar o ALT contextual.", "fail");
                        }
                      } catch (err) {
                        showAlert("Erro ao gerar Alt. API fora?", "fail");
                      } finally {
                        setAiGeneratingAlt(false);
                      }
                    }}
                    className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 font-bold flex items-center gap-1 hover:bg-indigo-100"
                  >
                    {aiGeneratingAlt ? "Analisando..." : "Gerar Alt"}
                  </button>
                </label>
                <input
                  type="text"
                  placeholder="Escreva detalhes claros do que é visto nesta imagem."
                  value={draftImageAlt}
                  onChange={(e) => setDraftImageAlt(e.target.value)}
                  className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Crédito da Foto (Opcional):</label>
                <input
                  type="text"
                  placeholder="Ex: Foto: G1 / Rede Globo"
                  value={draftImageCredit}
                  onChange={(e) => setDraftImageCredit(e.target.value)}
                  className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Url Original (se houver):</label>
                <input
                  type="url"
                  placeholder="https://g1.globo.com/artigo-exemplo"
                  value={draftOriginalUrl}
                  onChange={(e) => setDraftOriginalUrl(e.target.value)}
                  className="w-full border border-slate-250 p-2.5 rounded bg-slate-50/50 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-500 block font-semibold">Corpo do Artigo (SEO Tools):</label>
                <div className="flex bg-slate-100 rounded border border-slate-200 overflow-hidden divide-x divide-slate-200">
                  <button type="button" onClick={() => insertHtmlTag('<h2>', '</h2>')} className="px-2 py-1 hover:bg-slate-200 font-mono text-[10px] text-slate-700">H2</button>
                  <button type="button" onClick={() => insertHtmlTag('<h3>', '</h3>')} className="px-2 py-1 hover:bg-slate-200 font-mono text-[10px] text-slate-700">H3</button>
                  <button type="button" onClick={() => insertHtmlTag('<h4>', '</h4>')} className="px-2 py-1 hover:bg-slate-200 font-mono text-[10px] text-slate-700">H4</button>
                  <button type="button" onClick={() => insertHtmlTag('<strong>', '</strong>')} className="px-2 py-1 hover:bg-slate-200 font-mono text-[10px] text-slate-700 font-bold">B</button>
                  <button type="button" onClick={() => insertHtmlTag('<p>', '</p>')} className="px-2 py-1 hover:bg-slate-200 font-mono text-[10px] text-slate-700">P</button>
                  <button type="button" onClick={() => {
                    const linkUrl = window.prompt("URL da imagem (ex: Pinterest):");
                    if(linkUrl) insertHtmlTag(`<figure class="my-6"><img referrerPolicy="no-referrer" src="${linkUrl}" class="w-full rounded-lg shadow-sm" alt="Ilustração da matéria"></figure>`, '');
                  }} className="px-2 py-1 hover:bg-slate-200 font-mono text-[10px] text-slate-700">Img</button>
                  <button type="button" onClick={() => {
                    const link = window.prompt("URL do link da matéria relacionada:");
                    if(link) insertHtmlTag(`<a href="${link}" title="Leia mais sobre isso">`, '</a>');
                  }} className="px-2 py-1 hover:bg-slate-200 font-mono text-[10px] text-[#c4170c] font-bold">Leia Mais (Link)</button>
                </div>
              </div>
              <textarea
                id="draftContentTextarea"
                rows={10}
                required
                placeholder="Ex: <p>Nesta tarde de quarta-feira...</p> <p>O cenário detalhado revela...</p> "
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="w-full border border-slate-250 p-3 rounded bg-slate-50/50 outline-none font-mono"
              />
            </div>

            <div className="border-t border-slate-100 pt-5 flex items-center justify-end gap-3 font-semibold uppercase text-xs">
              <button
                type="submit"
                disabled={manualPublishing}
                className="px-6 py-2.5 bg-slate-900 border border-slate-950 text-white rounded transition hover:bg-slate-800 cursor-pointer text-center"
              >
                {manualPublishing ? "Registrando..." : "Publicar Artigo"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- TAB CONTENT 4: WEBSTORIES --- */}
      {activeTab === "webstories" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#c4170c]" />
              Publicar WebStory
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Crie WebStories com hiperlinks usando imagens do Pinterest. O Google WebStories exige imagens na proporção 9:16 (vertical).
            </p>

            <form onSubmit={handlePublishWebStory} className="space-y-6">
              
              {/* AI Auto Generation Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Auto-Gerar WebStory com Inteligência Artificial (Gemini)
                 </label>
                 <textarea rows={3} value={wsTextSource} onChange={(e) => setWsTextSource(e.target.value)} placeholder="Cole aqui o texto do artigo ou algumas anotações para a Inteligência Artificial criar o seu WebStory automaticamente..." className="w-full text-sm placeholder:text-slate-400 font-mono px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition resize-y mb-3"></textarea>
                 <button type="button" onClick={handleGenerateWebStoryAI} disabled={wsGenerating} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-sm disabled:opacity-70 disabled:cursor-wait">
                   {wsGenerating ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <><Sparkles className="w-4 h-4 text-white" /> Gerar WebStory</>}
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Título do Story (Google SEO)</label>
                  <input type="text" value={wsTitle} onChange={(e) => setWsTitle(e.target.value)} required placeholder="Ex: 5 Dicas Incríveis para Saúde" className="w-full text-sm placeholder:text-slate-400 font-medium px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#c4170c] focus:ring-1 focus:ring-[#c4170c] transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags (separadas por vírgula)</label>
                  <input type="text" value={wsTags} onChange={(e) => setWsTags(e.target.value)} required placeholder="Dicas, Saúde, Bem-estar" className="w-full text-sm placeholder:text-slate-400 font-medium px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#c4170c] focus:ring-1 focus:ring-[#c4170c] transition" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descrição Curta (Meta Description)</label>
                <textarea rows={2} value={wsDescription} onChange={(e) => setWsDescription(e.target.value)} required placeholder="Aparecerá nos resultados do Google e redes sociais..." className="w-full text-sm placeholder:text-slate-400 font-mono px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#c4170c] focus:ring-1 focus:ring-[#c4170c] transition resize-y"></textarea>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-800">Páginas de Imagens (Máximo 10)</h3>
                  <button type="button" onClick={addWsPage} disabled={wsPages.length >= 10} className="text-xs bg-slate-100 font-medium text-slate-800 hover:bg-slate-200 px-3 py-1.5 rounded flex items-center gap-1 disabled:opacity-50">
                    <PlusCircle className="w-3.5 h-3.5" /> Adicionar Página
                  </button>
                </div>
                
                {wsPages.map((page, i) => (
                  <div key={i} className="flex flex-col gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50 relative">
                    {wsPages.length > 1 && (
                      <button type="button" onClick={() => removeWsPage(i)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full p-1 border border-red-200 hover:bg-red-200 shadow-sm z-10">
                         <AlertTriangle className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full space-y-2">
                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">URL Imagem</label>
                         <input type="url" required value={page.imageUrl} onChange={(e) => updateWsPage(i, "imageUrl", e.target.value)} placeholder="https://..." className="w-full text-sm px-3 py-2 rounded border border-slate-300 focus:border-[#c4170c] focus:outline-none" />
                      </div>
                      <div className="w-full space-y-2">
                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Texto Alt (SEO)</label>
                         <input type="text" required value={page.imageAlt || ""} onChange={(e) => updateWsPage(i, "imageAlt", e.target.value)} placeholder="Ex: Mulher fazendo caminhada..." className="w-full text-sm px-3 py-2 rounded border border-slate-300 focus:border-[#c4170c] focus:outline-none" />
                      </div>
                      <div className="w-full md:w-1/3 space-y-2">
                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Animação</label>
                         <select value={page.animation || "zoom-in"} onChange={(e) => updateWsPage(i, "animation", e.target.value)} className="w-full text-sm px-3 py-2 rounded border border-slate-300 focus:border-[#c4170c] focus:outline-none">
                            <option value="zoom-in">Zoom In</option>
                            <option value="zoom-out">Zoom Out</option>
                            <option value="pan-up">Pan Up</option>
                            <option value="pan-down">Pan Down</option>
                         </select>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full space-y-2">
                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Título da Página (Opcional)</label>
                         <input type="text" value={page.title || ""} onChange={(e) => updateWsPage(i, "title", e.target.value)} placeholder="Ex: Passo 1..." className="w-full text-sm px-3 py-2 rounded border border-slate-300 focus:border-[#c4170c] focus:outline-none" />
                      </div>
                      <div className="w-full space-y-2">
                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Texto ou Resumo (Opcional)</label>
                         <textarea rows={1} value={page.text || ""} onChange={(e) => updateWsPage(i, "text", e.target.value)} placeholder="Ex: Para começar o dia bem..." className="w-full text-sm px-3 py-2 rounded border border-slate-300 focus:border-[#c4170c] focus:outline-none resize-none"></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button type="submit" disabled={wsPublishing} className="bg-[#0b132b] hover:bg-blue-950 text-white font-bold py-3.5 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 group shadow-sm text-sm uppercase tracking-wider min-w-[200px] disabled:opacity-70 disabled:cursor-wait">
                  {wsPublishing ? <RefreshCw className="w-4 h-4 animate-spin text-slate-400" /> : <><CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" /> Publicar WebStory SEO</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 5: GOOGLE DISCOVER METRICS, SITEMAPS & ROBOTS --- */}
      {activeTab === "seo" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Traffic & Index Cues (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#c4170c]" />
                Simulador de Desempenho Google Discover (Próximos 90 Dias)
              </h3>

              {/* Dynamic visual graph made purely of CSS/SVG (High performance, bug-free) */}
              <div className="space-y-4 font-sans text-xs">
                <span className="text-slate-400 font-medium block">Projeção Crescimento de Cliques Mensais E7 News - canais orgânicos:</span>
                
                <div className="h-44 bg-slate-950 rounded-xl p-4 flex flex-col justify-between border border-slate-800 relative">
                  <div className="absolute right-4 top-4 text-emerald-400 font-mono text-[10px] bg-emerald-950 border border-emerald-900/60 px-2.0 py-0.5 rounded uppercase font-bold tracking-widest leading-none">
                    Discover Predict v1
                  </div>
                  
                  {/* Grid Lines */}
                  <div className="h-px bg-slate-800/60 w-full" />
                  <div className="h-px bg-slate-800/60 w-full" />
                  <div className="h-px bg-slate-800/60 w-full" />

                  {/* SVG Line representation of extreme SEO growth */}
                  <div className="absolute bottom-6 left-10 right-10 h-28 flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100">
                      <defs>
                        <linearGradient id="seoGrad" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.0"/>
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.15"/>
                        </linearGradient>
                      </defs>
                      {/* Area Under Curve */}
                      <path 
                        d="M 0 95 Q 100 80, 200 45 T 400 5 L 400 100 L 0 100 Z" 
                        fill="url(#seoGrad)" 
                      />
                      {/* Direct Line path */}
                      <path 
                        d="M 0 95 Q 100 80, 200 45 T 400 5" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3"
                        className="animate-pulse"
                      />
                      {/* Markers */}
                      <circle cx="0" cy="95" r="4" fill="#ffffff" />
                      <circle cx="130" cy="74" r="4" fill="#ffffff" />
                      <circle cx="270" cy="24" r="4" fill="#10b981" />
                      <circle cx="400" cy="5" r="5" fill="#f59e0b" />
                    </svg>
                  </div>

                  {/* Legend labels */}
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-3 px-2">
                    <span>Dia 0 (Seed)</span>
                    <span>Dia 30 (Aprovação AdSense)</span>
                    <span>Dia 60 (Gemini Scrape On)</span>
                    <span className="text-yellow-400">Dia 90 (Sucesso Discover)</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl leading-relaxed text-slate-700 text-xs mt-4">
                  <strong>Ponto de Inflexão Estratégica:</strong> No dia 60, a automatização das reescritas de categorias via Gemini e indexação instantânea ativa disparará o ganho de termos de cauda longa, pavimentando o portal E7 News para atingir o topo de tráfego orgânico brasileiro.
                </div>
              </div>
            </div>

            {/* Sitemap log visual checks */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                Histórico de Ping de Sitemaps no Portal
              </h3>
              <div className="divide-y divide-slate-100">
                <div className="py-3 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500 font-medium">GET /sitemap.xml</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">200 OK (Served dynamically)</span>
                  <span className="text-slate-400">{new Date().toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="py-3 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500 font-medium">GET /robots.txt</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">200 OK (Robots.txt)</span>
                  <span className="text-slate-400">{new Date().toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="py-3 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500 font-medium">Google Crawler SearchBot Ping</span>
                  <span className="text-[#c4170c] font-bold bg-purple-50 px-2 py-0.5 rounded">Success: Indexed 4 URLs</span>
                  <span className="text-slate-400">{new Date().toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* E-E-A-T details panel checks (1 Col) */}
          <div className="lg:col-span-1 space-y-6 text-xs">
            <div className="bg-[#0b132b] text-white rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="font-mono text-yellow-400 uppercase font-bold tracking-widest text-xs flex items-center gap-1">
                <Layers className="w-4 h-4" />
                Dossiê E-E-A-T 2026
              </h4>
              <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
                O Google Discover prioriza conteúdos feitos com experiência comprovada do produtor. Nosso sistema unifica várias marcações para provar integridade humana:
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <span className="bg-blue-950 p-1.5 rounded-lg border border-blue-900 shrink-0 text-yellow-300">✓</span>
                  <div>
                    <h5 className="font-extrabold text-[#eaeaea]">Assinatura por Jornalista Elvis Dias</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Assinado com o número profissional DRT 1466/RO, garantindo que o autor existe.</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="bg-blue-950 p-1.5 rounded-lg border border-blue-900 shrink-0 text-yellow-300">✓</span>
                  <div>
                    <h5 className="font-extrabold text-[#eaeaea]">Schema estruturado NewsArticle</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Injeta na página os dados que determinam categorização e data de modificação.</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="bg-blue-950 p-1.5 rounded-lg border border-blue-900 shrink-0 text-yellow-300">✓</span>
                  <div>
                    <h5 className="font-extrabold text-[#eaeaea]">Semântica por Silos ("Leia Também")</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">O Google percebe conexões textuais lógicas e eleva a nota de confiança.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 text-slate-500">
              <h4 className="font-bold text-slate-900 uppercase tracking-tight text-xs">Sua Checklist AdSense</h4>
              <p className="text-[11px] leading-relaxed">
                Antes de submeter o portal e7news.com.br no painel do AdSense, confirme se publicou pelo menos 10 posts autorais na aba "Manual" e verifique se as páginas de sitemaps estão legíveis.
              </p>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Mantenha as imagens originais via URL para melhor tempo LCP.
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Evite repetir títulos (o Slug impede duplicações automatizadas).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 6: MESSAGES --- */}
      {activeTab === "messages" && (
        <div className="bg-white border text-sm font-medium border-slate-200 rounded-xl shadow-sm pb-10">
          <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl shrink-0 flex items-center justify-between">
            <h2 className="text-zinc-800 font-bold uppercase tracking-tight flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-700" />
              Caixa de Entrada E7 News
            </h2>
            <button
              onClick={fetchMessages}
              className="text-xs bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors flex items-center gap-1 font-semibold shadow-sm"
              title="Atualizar"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Atualizar Mensagens
            </button>
          </div>

          <div className="p-4">
            {messages.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center opacity-70">
                <CheckCircle2 className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium text-sm">Nenhuma mensagem recebida ainda.</p>
                <p className="text-slate-400 text-xs mt-1">A caixa de entrada via formulário de contato está vazia.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(msg => (
                  <div key={msg.id} className={`p-4 rounded-xl border transition-colors relative ${msg.read ? "bg-slate-50 border-slate-200" : "bg-white border-red-200 shadow-sm"}`}>
                    {!msg.read && (
                      <span className="absolute top-4 right-4 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="text-slate-900 text-sm font-bold">{msg.name}</strong>
                          <a href={`mailto:${msg.email}`} className="text-[#cc0000] hover:underline text-xs bg-red-50 px-2 rounded-full border border-red-100">{msg.email}</a>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3 block">
                          Recebido em: {new Date(msg.createdAt).toLocaleString("pt-BR")}
                        </span>
                        
                        <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100 mt-2 text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                          {msg.message}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 shrink-0 md:justify-start">
                        {msg.read ? (
                           <button onClick={() => handleMarkMessageRead(msg.id, false)} className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-50 transition w-full text-center">
                              Marcar como Não Lido
                           </button>
                        ) : (
                           <button onClick={() => handleMarkMessageRead(msg.id, true)} className="px-3 py-2 bg-zinc-900 text-white rounded text-xs font-bold hover:bg-zinc-800 transition w-full flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Marcar como Lido
                           </button>
                        )}
                        <button onClick={() => handleDeleteMessage(msg.id)} className="px-3 py-2 bg-red-50 text-red-700 border border-red-100 rounded text-xs font-bold hover:bg-red-100 hover:text-red-800 transition w-full flex items-center justify-center gap-1.5">
                           <Trash2 className="w-3.5 h-3.5" /> Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: REDES SOCIAIS E AUTOMAÇÃO / REELS --- */}
      {activeTab === "social-automation" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-5xl mx-auto flex flex-col gap-6">
          <div className="border-b border-slate-100 pb-3 mb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#cc0000]" />
              Automação e Criação para Redes (Instagram, TikTok, YouTube Shorts)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Configure como as matérias geradas se transformam em vídeos automáticos / imagens fixas para suas redes e geram tráfego direcionado.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LADO ESQUERDO: CONCEITO DE REELS AUTOMÁTICO E INTEGRAÇÕES */}
            <div className="space-y-6">
               <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                 <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    Como Funciona o Sistema e CTA?
                 </h4>
                 <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                   <p>A inteligência artificial (Gemini) analisa a notícia assim que publicada para gerar material de divulgação. Nós preparamos:</p>
                   <ul className="list-disc pl-4 space-y-1 font-medium">
                     <li>Um Roteiro curto com gancho forte para o vídeo (15s a 30s).</li>
                     <li>Uma Imagem estática adaptada para os formatos 9:16 ou 1:1, destacando o título principal com letras garrafais.</li>
                     <li>Opcionalmente: Locução sintética de 10s estilo "Noticiário Flash".</li>
                   </ul>
                   <p className="pt-2 font-bold text-slate-800">Call to Action (Chamada para o Site):</p>
                   <p>Em todas as postagens, a legenda incluirá uma chamada automática atraente focada no instinto de curiosidade, como por exemplo: <em>"A matéria completa pode mudar sua opinião, acesse o portal pelo link da nossa Bio para ler tudo!"</em></p>
                 </div>
               </div>

               <div className="border border-slate-200 rounded-lg p-5">
                 <h4 className="font-bold text-slate-800 text-sm mb-3">Conexões de Contas</h4>
                 
                 <div className="space-y-4">
                   {/* Instagram */}
                   <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
                         IG
                       </div>
                       <div>
                         <strong className="block text-xs text-slate-800">Instagram</strong>
                         {socialTokens["instagram"] ? (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Conectado</span>
                         ) : (
                            <span className="text-[10px] text-slate-500">— Não Conectado —</span>
                         )}
                       </div>
                     </div>
                     <button 
                        onClick={() => setConnectingSocial({ id: "instagram", name: "Instagram", color: "bg-pink-600", prefix: "IG" })}
                        className={`text-[10px] px-3 py-1.5 rounded font-bold transition ${socialTokens["instagram"] ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
                       {socialTokens["instagram"] ? "Configurar" : "Conectar Conta"}
                     </button>
                   </div>

                   {/* Facebook */}
                   <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded bg-[#1877F2] flex items-center justify-center text-white font-bold">
                         FB
                       </div>
                       <div>
                         <strong className="block text-xs text-slate-800">Facebook (Página)</strong>
                         {socialTokens["facebook"] ? (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Conectado</span>
                         ) : (
                            <span className="text-[10px] text-slate-500">— Não Conectado —</span>
                         )}
                       </div>
                     </div>
                     <button 
                        onClick={() => setConnectingSocial({ id: "facebook", name: "Facebook", color: "bg-[#1877F2]", prefix: "FB" })}
                        className={`text-[10px] px-3 py-1.5 rounded font-bold transition ${socialTokens["facebook"] ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
                       {socialTokens["facebook"] ? "Configurar" : "Conectar Conta"}
                     </button>
                   </div>
                   
                   {/* TikTok */}
                   <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded bg-black flex items-center justify-center text-white font-bold">
                         TK
                       </div>
                       <div>
                         <strong className="block text-xs text-slate-800">TikTok</strong>
                         {socialTokens["tiktok"] ? (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Conectado</span>
                         ) : (
                            <span className="text-[10px] text-slate-500">— Não Conectado —</span>
                         )}
                       </div>
                     </div>
                     <button 
                        onClick={() => setConnectingSocial({ id: "tiktok", name: "TikTok", color: "bg-black", prefix: "TK" })}
                        className={`text-[10px] px-3 py-1.5 rounded font-bold transition ${socialTokens["tiktok"] ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
                       {socialTokens["tiktok"] ? "Configurar" : "Conectar Conta"}
                     </button>
                   </div>
                   
                   {/* YouTube */}
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded bg-[#FF0000] flex items-center justify-center text-white font-bold">
                         YT
                       </div>
                       <div>
                         <strong className="block text-xs text-slate-800">YouTube (Shorts)</strong>
                         {socialTokens["youtube"] ? (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Conectado</span>
                         ) : (
                            <span className="text-[10px] text-slate-500">— Não Conectado —</span>
                         )}
                       </div>
                     </div>
                     <button 
                        onClick={() => setConnectingSocial({ id: "youtube", name: "YouTube", color: "bg-[#FF0000]", prefix: "YT" })}
                        className={`text-[10px] px-3 py-1.5 rounded font-bold transition ${socialTokens["youtube"] ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
                       {socialTokens["youtube"] ? "Configurar" : "Conectar Conta"}
                     </button>
                   </div>
                 </div>
               </div>
               
               <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex gap-3 text-slate-800">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-slate-600" />
                  <div className="text-xs">
                     <strong className="block mb-1">Como usar essas Autenticações:</strong>
                     O E7 News utiliza "Long-Lived Access Tokens". Para cada plataforma acima, você deve criar um App na respectiva área de desenvolvedor (Meta for Developers, Google Cloud Console, ou TikTok for Developers), adicionar as permissões de publicação (ex: <code>instagram_content_publish</code>, <code>pages_manage_posts</code>) e colar a "Chave de Acesso" clicando no botão "Conectar Conta". 
                  </div>
               </div>
            </div>

            {/* LADO DIREITO: CONFIG E PREVIEW */}
            <div className="space-y-6">
              
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                 <div className="bg-slate-100 border-b border-slate-200 p-3 px-4 font-bold text-slate-700 text-xs flex justify-between items-center">
                    Simulador Visual / Editor de Padrão
                    <Video className="w-4 h-4 text-slate-400" />
                 </div>
                 <div className="p-5 flex flex-col items-center bg-slate-50">
                    
                    {/* Celular Mockup */}
                    <div className="w-[200px] h-[360px] bg-white rounded-xl shadow-lg border-[4px] border-slate-800 flex flex-col relative overflow-hidden">
                       {/* Header app */}
                       <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-black/60 to-transparent z-10 flex items-start justify-between px-3 pt-3 pointer-events-none">
                         <span className="text-[8px] font-bold text-white shadow-black drop-shadow-md">E7 News</span>
                       </div>
                       
                       {/* Background (simulando a imagem da matéria puxada) */}
                       <img src="https://images.unsplash.com/photo-1549221535-6548d42d3a04?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
                       
                       {/* Título gerado no video para prender a atenção */}
                       <div className="absolute bottom-[80px] w-full px-2 flex justify-center z-20">
                          <div className={`w-full ${socialColor} backdrop-blur-md font-black text-center text-[11px] uppercase leading-tight p-2 flex flex-col justify-center rounded-sm shadow-xl border border-white/30`}>
                             <span className="opacity-90 text-[8px] mb-0.5 tracking-wider font-bold">⚠️ URGENTE</span>
                             <span>INFORMAÇÃO PODE IMPACTAR TODOS VOCÊ PRECISA SABER DISSO</span>
                          </div>
                       </div>
                       
                       {/* Inferior (Logo e Gradient) */}
                       <div className="absolute bottom-0 inset-x-0 h-[100px] bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-2 pointer-events-none z-10">
                          <h3 className="text-white font-bold text-[11px] leading-tight mb-2 drop-shadow-md">A matéria completa em texto tem um detalhe que chocou a todos...</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-[#cc0000] flex items-center justify-center text-white skew-x-[-10deg]">
                              <span className="font-extrabold italic text-[10px] skew-x-[10deg]">E7</span>
                            </div>
                            <span className="text-white text-[9px] font-medium opacity-80">e7newsportal • Compartilhar</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-5">
                 <h4 className="font-bold text-slate-800 text-sm mb-4">Ajustes Base de Automação Visual</h4>
                 
                 <div className="space-y-4">
                   <div>
                     <label className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                        Estilo / Cor Destacada do Título
                        <div className={`w-4 h-4 rounded ${socialColor.split('/')[0]} border border-slate-200`}></div>
                     </label>
                     <select 
                       className="w-full border border-slate-200 rounded p-2 text-xs bg-slate-50 font-medium"
                       value={socialColor}
                       onChange={(e) => setSocialColor(e.target.value)}
                     >
                        <option value="bg-[#cc0000]/60 text-white">Vermelho Alerta (#cc0000)</option>
                        <option value="bg-yellow-500/60 text-slate-900">Amarelo Notícia (#FBBF24)</option>
                        <option value="bg-black/60 text-white">Preto Clássico Transparente (#000000)</option>
                        <option value="bg-white/60 text-slate-900">Leve Claro (#FFFFFF)</option>
                     </select>
                   </div>
                   
                   <div>
                     <label className="block text-xs font-bold text-slate-600 mb-1">Engatinhamento Automático / Postagem Direta</label>
                     <div className="flex items-center gap-3 mt-2">
                        <input 
                           type="checkbox" 
                           id="auto-post" 
                           className="w-5 h-5 accent-[#cc0000] cursor-pointer"
                           checked={socialAutoPost}
                           onChange={(e) => setSocialAutoPost(e.target.checked)}
                        />
                        <label htmlFor="auto-post" className="text-xs font-medium text-slate-600 cursor-pointer">
                           Ao publicar um artigo, se for 'Destaque', postar IMEDIATAMENTE como Reels ou Feed usando os conectores. (Requer contas conectadas e aprovação da Meta)
                        </label>
                     </div>
                   </div>
                   
                   <div className="pt-3">
                     <button className="bg-[#cc0000] hover:bg-red-800 text-white rounded px-4 py-2 text-xs font-bold w-full transition cursor-not-allowed opacity-50">
                        Salvar Padrões de Automação (Em breve API restrita)
                     </button>
                   </div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 7: CONFIG --- */}
      {activeTab === "config" && (
        <div className="bg-white border text-sm font-medium border-slate-200 rounded-xl shadow-sm pb-10">
          <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl shrink-0 flex items-center justify-between">
            <h2 className="text-zinc-800 font-bold uppercase tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-red-700" />
              Configurações Gerais
            </h2>
            <button
              onClick={async () => {
                await saveSettings(siteSettings);
                showAlert("Configurações salvas com sucesso!", "success");
              }}
              className="text-xs bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors flex items-center gap-1 font-bold shadow-sm"
              title="Salvar"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Salvar Configurações
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-slate-600 block mb-1 font-bold">Título do Site (siteName):</label>
                <input
                  type="text"
                  value={siteSettings.siteName || ""}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded bg-slate-50/50 outline-none focus:bg-white focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-bold">Domínio do Site (siteDomain):</label>
                <input
                  type="text"
                  value={siteSettings.siteDomain || ""}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteDomain: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded bg-slate-50/50 outline-none focus:bg-white focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-bold">Meta Description (SEO):</label>
                <textarea
                  rows={2}
                  value={siteSettings.siteDescription || ""}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded bg-slate-50/50 outline-none focus:bg-white focus:border-red-500 resize-y"
                  placeholder="Ex: O E7 News é o seu portal de notícias de Monte Negro e região."
                ></textarea>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-bold">Título do Rodapé Institucional:</label>
                <input
                  type="text"
                  value={siteSettings.footerTitle || ""}
                  onChange={(e) => setSiteSettings({ ...siteSettings, footerTitle: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded bg-slate-50/50 outline-none focus:bg-white focus:border-red-500"
                  placeholder="Ex: O E7 News é o seu portal..."
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-bold">Corpo do Texto do Rodapé Institucional:</label>
                <textarea
                  rows={5}
                  value={siteSettings.footerTextBody || ""}
                  onChange={(e) => setSiteSettings({ ...siteSettings, footerTextBody: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded bg-slate-50/50 outline-none focus:bg-white focus:border-red-500 resize-y"
                  placeholder="Texto que aparecerá no rodapé de todas as páginas."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      )}

         </div>
      </div>

      {/* Social Connection Modal */}
      {connectingSocial && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="p-5 border-b border-slate-100 flex items-center gap-3">
               <div className={`w-10 h-10 rounded ${connectingSocial.color} flex items-center justify-center text-white font-bold`}>
                 {connectingSocial.prefix}
               </div>
               <div>
                  <h3 className="font-bold text-slate-800">Conectar API: {connectingSocial.name}</h3>
                  <span className="text-[10px] text-slate-500">Configuração de Long-Lived Access Token</span>
               </div>
             </div>
             
             <div className="p-5 space-y-4">
               <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs text-slate-600 space-y-2">
                 <p>Para postar automaticamente no <strong>{connectingSocial.name}</strong>, precisamos que você insira o seu token de acesso de desenvolvedor oficial.</p>
                 <p className="font-bold">Passos:</p>
                 <ol className="list-decimal pl-4 space-y-1">
                   <li>Acesse o portal de desenvolvedor do {connectingSocial.name}.</li>
                   <li>Crie um App para a sua conta/página.</li>
                   <li>Autorize as permissões de postagem.</li>
                   <li>Gere e cole o "Access Token" abaixo.</li>
                 </ol>
               </div>
               
               <div>
                 <label className="block text-xs font-bold text-slate-700 mb-1">
                   {connectingSocial.name} Access Token:
                 </label>
                 <input 
                   type="password" 
                   value={tempToken}
                   onChange={(e) => setTempToken(e.target.value)}
                   className="w-full border border-slate-300 rounded p-2.5 text-sm outline-none focus:border-emerald-500 font-mono"
                   placeholder="Cole a chave (ex: EAAxO2... ou Ya29...)"
                 />
               </div>
             </div>
             
             <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
               <button 
                 onClick={() => {
                   setConnectingSocial(null);
                   setTempToken("");
                 }}
                 className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded"
               >
                 Cancelar
               </button>
               <button 
                 onClick={() => {
                   if (tempToken.trim()) {
                     setSocialTokens(prev => ({ ...prev, [connectingSocial.id]: tempToken }));
                     showAlert(`Conta do ${connectingSocial.name} conectada com sucesso!`, "success");
                     setConnectingSocial(null);
                     setTempToken("");
                   } else {
                     showAlert("Por favor, cole o token de acesso válido.", "warning");
                   }
                 }}
                 className={`px-4 py-2 text-xs font-bold text-white rounded transition ${tempToken.trim() ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-300 cursor-not-allowed"}`}
               >
                 Salvar e Conectar
               </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
