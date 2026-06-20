import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import * as cheerio from "cheerio";
import { seedArticles, defaultSettings, defaultSources } from "./src/fakeArticles";
import { DBStore, Article, ScrapingSource, SystemSettings } from "./src/types";
import { setupAutomator } from "./src/automator";
import { injectInternalLinks } from "./src/seo";
import { getArticles, getWebStories } from "./src/lib/db";

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Helper to load or initialize DB
function readDb(): DBStore {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data) as DBStore;
      
      // Auto-reseed/merge if the number of articles is low (e.g. from previous session) to ensure the newly requested ~50 articles structure is visible immediately
      if (!parsed.articles || parsed.articles.length < 10) {
        console.log("[E7 NEWS] Banco de dados existente com poucas notícias. Re-semeando a carga de 50 artigos...");
        parsed.articles = seedArticles;
        parsed.scrapedHistory = seedArticles.filter(a => !!a.originalUrl).map(a => a.originalUrl!);
        writeDb(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error("Erro lendo db.json, reiniciando bases...", err);
  }

  // Seed default DB
  const initialDb: DBStore = {
    settings: defaultSettings,
    articles: seedArticles,
    sources: defaultSources,
    scrapedHistory: seedArticles.filter(a => !!a.originalUrl).map(a => a.originalUrl!)
  };
  writeDb(initialDb);
  return initialDb;
}

function writeDb(db: DBStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro escrevendo em db.json:", err);
  }
}

// Exported for other modules to use if needed
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .trim()
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove duplicate hyphens
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // Initialize DB on start
  const db = readDb();

  // Define shared Gemini rewrite logic
  async function generateArticleWithGemini(sourceText: string, category: string, originalTitle?: string, originalUrl?: string) {
    const dbData = readDb();
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey || geminiKey === "MY_GEMINI_API_KEY") {
      return {
        isPlaceholder: true,
        title: `E7 News: REESCRITA - ${originalTitle || "Inovações em " + (category || "Destaques")}`,
        subtitle: `Editor-chefe do E7 News, Elvis Dias, traz perspectiva única sobre os últimos desdobramentos locais e nacionais.`,
        content: `
          <p><em>[Aviso: O motor Gemini não está ativado (Falta Chave de API). Demonstração IA.]</em></p>
          <p>O mercado de notícias digitais acaba de dar um salto definitivo em Rondônia e todo o território nacional...</p>
          <h2>O Fato sob a lupa</h2>
          <p>A partir do conteúdo originalmente postado, percebemos que as fontes necessitam de contextualização.</p>
          <blockquote>
            <strong>Análise do Jornalista Elvis Dias (DRT 1466/RO):</strong><br/>
            <em>"O tráfego só persegue de forma qualificada quem domina a arte da autoria séria."</em>
          </blockquote>
        `,
        tags: [category || "Geral", "Apuração Especial", "Elvis Dias"]
      };
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const promptText = `
      Reescreva e formate para o portal "E7 News". Tema original: ${originalTitle || ""}
      Texto bruto:
      ${sourceText}

      Retorne APENAS UM JSON VÁLIDO contendo as chaves:
      "title": Título curto SEO Discover.
      "subtitle": Linha fina/lead (20 palavras).
      "content": HTML formatado (<p>, <h2>) englobando a análise de Elvis Dias (DRT 1466/RO) no estilo de grandes portais.
      "tags": array de 3 strings com palavras-chave.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: dbData.settings.elvisPrompt,
        responseMimeType: "application/json"
      }
    });

    const responseText = (response.text || "{}").replace(/```json/gi, "").replace(/```/g, "").trim();
    const newsOutput = JSON.parse(responseText);
    return {
      isPlaceholder: false,
      title: newsOutput.title || `E7 News: Análise Exclusiva`,
      subtitle: newsOutput.subtitle,
      content: newsOutput.content,
      tags: newsOutput.tags || [category || "Destaques"]
    };
  }

  // Init Phase 2 Automator Cron Jobs
  setupAutomator(db, writeDb, generateArticleWithGemini);

  // --- API ROUTE: SYSTEM SETTINGS ---
  app.get("/api/settings", (req, res) => {
    const db = readDb();
    res.json(db.settings);
  });

  app.post("/api/settings", (req, res) => {
    const db = readDb();
    db.settings = { ...db.settings, ...req.body };
    writeDb(db);
    res.json({ message: "Configurações salvas!", settings: db.settings });
  });

  // --- API ROUTE: LOGIN ADMIN ---
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "elviiis19" && password === "Ohq35792022@") {
      res.json({ token: "e7news-admin-token-xyz-123", name: "Elvis Dias" });
    } else {
      res.status(401).json({ error: "Credenciais inválidas" });
    }
  });

  // --- API ROUTE: ALL ARTICLES ---
  app.get("/api/articles", (req, res) => {
    const db = readDb();
    // Sort by publication date desc
    const sorted = [...db.articles].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    res.json(sorted);
  });

  // --- API ROUTE: CONCRETE ARTICLES ---
  app.get("/api/articles/:slugOrId", (req, res) => {
    const db = readDb();
    const { slugOrId } = req.params;
    const article = db.articles.find(
      a => a.id === slugOrId || a.slug === slugOrId
    );

    if (!article) {
      return res.status(404).json({ error: "Matéria não encontrada." });
    }

    // Increment readCount slightly for simulation or direct hit
    article.readCount = (article.readCount || 0) + 1;
    writeDb(db);

    res.json(article);
  });

  // --- API ROUTE: MANUAL AND IMPORT POSTING ---
  app.post("/api/articles", (req, res) => {
    const db = readDb();
    const { title, subtitle, content, imageUrl, imageAlt, category, tags, originalUrl, originalSource } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Título e conteúdo são obrigatórios." });
    }

    const baseSlug = generateSlug(title);
    let finalSlug = baseSlug;
    let count = 1;

    // Check slug collision
    while (db.articles.some(a => a.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${count}`;
      count++;
    }

    const defaultAuthor = {
      name: "Elvis Dias",
      drt: "1466/RO",
      role: "Editor-Chefe / Jornalista Político e Investigativo",
      bio: "Elvis Dias é jornalista profissional sob o DRT 1466/RO, especializado em SEO de alta performance, tráfego escalável e análise de tendências tecnológicas no norte do país.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80"
    };

    // Auto semantic linking: select other posts from same tag/category
    const related = db.articles
      .filter(a => a.id !== finalSlug && (a.category === category || a.tags.some(t => tags?.includes(t))))
      .slice(0, 3)
      .map(a => a.id);

    const newArticle: Article = {
      id: finalSlug,
      title,
      subtitle: subtitle || title,
      slug: finalSlug,
      content: injectInternalLinks(content, db, Array.isArray(tags) ? tags : ["E7 News"], finalSlug),
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
      imageAlt: imageAlt || title,
      category: category || "Tecnologia",
      publishedAt: new Date().toISOString(),
      author: defaultAuthor,
      tags: Array.isArray(tags) ? tags : ["E7 News"],
      readCount: 0,
      relatedArticleIds: related,
      isManual: !originalUrl,
      originalUrl,
      originalSource,
      engagementScore: Math.floor(Math.random() * 30) + 70 // Discover score placeholder
    };

    db.articles.push(newArticle);
    if (originalUrl) {
      db.scrapedHistory.push(originalUrl);
    }
    writeDb(db);

    res.status(201).json({ message: "Artigo publicado com sucesso!", article: newArticle });
  });

  // --- API ROUTE: DELETE ARTICLE ---
  app.delete("/api/articles/:id", (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const initialLen = db.articles.length;
    db.articles = db.articles.filter(a => a.id !== id && a.slug !== id);
    if (db.articles.length < initialLen) {
      writeDb(db);
      res.json({ message: "Artigo excluído com sucesso." });
    } else {
      res.status(404).json({ error: "Artigo não encontrado." });
    }
  });

  // --- API ROUTE: REAL GEMINI REWRITER ---
  app.post("/api/articles/generate", async (req, res) => {
    const { sourceText, category, title: originalTitle, url: originalUrl } = req.body;

    if (!sourceText) {
      return res.status(400).json({ error: "Texto original é obrigatório." });
    }

    try {
      const generated = await generateArticleWithGemini(sourceText, category, originalTitle, originalUrl);
      res.json(generated);
    } catch (err: any) {
      console.error("Erro na API do Gemini:", err);
      res.status(500).json({ error: "Falha na comunicação com o Gemini AI.", details: err.message });
    }
  });

  // --- API ROUTE: WEBSTORY GEMINI GENERATOR ---
  app.post("/api/webstories/generate", async (req, res) => {
    const { sourceText } = req.body;

    if (!sourceText) {
      return res.status(400).json({ error: "Texto base ou contexto é obrigatório." });
    }

    try {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey || geminiKey === "MY_GEMINI_API_KEY") {
         return res.status(400).json({ error: "Chave da API Gemini ausente. Configure em Settings > Secrets." });
      }
      
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const promptText = `
        Crie um WebStory formatado em JSON a partir deste texto:
        "${sourceText}"

        Regulamentos:
        - Crie de 4 a 6 páginas (pages).
        - Cada página precisa de: "imageUrl" (pode usar um placeholder temporário: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"), "imageAlt", "title" (título curto SEO para a tela, 5 palavras máx), "text" (descrição breve na tela, máx 25 palavras), e "animation" (uma destas: "pan-up", "pan-down", "zoom-in", "zoom-out").
        - O retorno DEVE ser um objeto JSON exato:
          {
             "title": "titulo da story",
             "description": "resumo curto",
             "tags": ["tag1", "tag2"],
             "pages": [ { "imageUrl": "...", "imageAlt": "...", "title": "...", "text": "...", "animation": "zoom-in" } ]
          }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = (response.text || "{}").replace(/```json/gi, "").replace(/```/g, "").trim();
      const storyOutput = JSON.parse(responseText);

      res.status(200).json(storyOutput);
    } catch (err: any) {
      console.error("Erro na API do Gemini de WebStory:", err);
      res.status(500).json({ error: "Falha na comunicação com o Gemini AI para WebStory.", details: err.message });
    }
  });

  // --- API ROUTE: SCRAPING SOURCES ---
  app.get("/api/sources", (req, res) => {
    const db = readDb();
    res.json(db.sources);
  });

  app.post("/api/sources", (req, res) => {
    const db = readDb();
    const { name, url, category } = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: "Nome e URL são obrigatórios." });
    }

    const newSource: ScrapingSource = {
      id: "source-" + Date.now(),
      name,
      url,
      category: category || "Tecnologia",
      isActive: true,
      lastScrapedAt: ""
    };

    db.sources.push(newSource);
    writeDb(db);

    res.status(201).json(newSource);
  });

  // --- API ROUTE: WEB SCRAPER FEED PROXY ---
  app.post("/api/scrape/:sourceId", async (req, res) => {
    const db = readDb();
    const { sourceId } = req.params;
    const source = db.sources.find(s => s.id === sourceId);

    if (!source) {
      return res.status(404).json({ error: "Fonte de captura não cadastrada." });
    }

    // List of simulated articles matching general category style as fallback
    const simulatedG1Fallback: Record<string, any[]> = {
      "Tecnologia": [
        {
          title: "Novo modelo do Google revoluciona as integrações de desenvolvimento ágil",
          summary: "A nova geração de modelos com capacidades lógicas avançadas promete baratear custos operacionais e reestruturar servidores Cloud.",
          url: "https://g1.globo.com/tecnologia/noticia/2026/06/17/novo-modelo-google-revoluciona.html",
          imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
          category: "Tecnologia"
        },
        {
          title: "Inteligência Artificial avança em Rondônia para mapeamento do desmatamento ilegal",
          summary: "Uso de redes convulsionais por satélite ajuda equipes de fiscalização ambientais a identificar focos em minutos no interior do Estado.",
          url: "https://g1.globo.com/tecnologia/noticia/2026/06/17/ia-satelite-mapeamento-rondonia.html",
          imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
          category: "Tecnologia"
        }
      ],
      "Esportes": [
        {
          title: "Flamengo vence clássico e assume a ponta isolada do Campeonato Brasileiro",
          summary: "Com gol marcado no início do segundo tempo, equipe carioca segura investida paulista no Maracanã lotado e lidera isolado.",
          url: "https://g1.globo.com/esportes/noticia/2026/06/17/flamengo-vence-classico-tabu.html",
          imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6edd1d2297?auto=format&fit=crop&w=600&q=80",
          category: "Esportes"
        },
        {
          title: "Ariquemes FC conquista título da Taça Rondônia Sul Sub-20 com recorde de público",
          summary: "O torneio estadual encerra com goleada elástica e atrai atenção de empresários credenciados do futebol europeu para os destaques locais.",
          url: "https://g1.globo.com/esportes/noticia/2026/06/17/ariquemes-conquista-taca-rondonia.html",
          imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",
          category: "Esportes"
        }
      ],
      "Economia": [
        {
          title: "Dólar recua após ata do Banco Central indicar estabilidade inflacionária",
          summary: "O mercado financeiro internacional reage positivamente às decisões prudenciais de juros domésticos estabilizando o câmbio nacional.",
          url: "https://g1.globo.com/economia/noticia/2026/06/17/dolar-recua-ata-banco-central.html",
          imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
          category: "Economia"
        },
        {
          title: "Produção de café robusta em Rondônia projeta crescimento de 12% na safra atual",
          summary: "Investimentos em cooperativas locais e tecnologia de irrigação elevam estado à vice-liderança nacional de produção consolidada.",
          url: "https://g1.globo.com/economia/noticia/2026/06/17/reuniao-cafe-robusta-cresce-rondonia.html",
          imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
          category: "Economia"
        }
      ]
    };

    source.lastScrapedAt = new Date().toISOString();

    try {
      // Direct real scraper fetch logic
      const response = await fetch(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        },
        signal: AbortSignal.timeout(6000)
      });

      if (!response.ok) {
        throw new Error(`Falha de conexão com a URL (${response.status})`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const parsedItems: any[] = [];

      // Flexible matching for main news links (like G1 feed links)
      $("a").each((i, el) => {
        const href = $(el).attr("href") || "";
        const title = $(el).text().trim();
        // Look for rich G1 headers/feed titles
        if (
          (href.includes("globo.com") || href.startsWith("/")) && 
          title.length > 25 && 
          !parsedItems.some(item => item.url === href)
        ) {
          // Attempt to fetch surrounding image or details
          const imgUrl = $(el).closest("div").find("img").attr("src") || 
                         "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80";

          parsedItems.push({
            title,
            summary: "Clique em 'Reescrever' para que o motor de Inteligência Artificial do E7 News estruture, limpa e contextualize essa história original.",
            url: href.startsWith("/") ? "https://g1.globo.com" + href : href,
            imageUrl: imgUrl,
            category: source.category
          });
        }
      });

      // Filter out duplicates and limit
      const filtered = parsedItems.filter(item => !db.scrapedHistory.includes(item.url)).slice(0, 10);

      if (filtered.length > 0) {
        source.lastScrapeResult = `Sucesso: Encontrou ${filtered.length} novas notícias reais.`;
        source.articlesFound = filtered.length;
        writeDb(db);
        return res.json({ success: true, articles: filtered, isMock: false });
      } else {
        // Fallback if real cheerio match was dry
        throw new Error("Estrutura da página modificada, ativando fallback inteligente.");
      }

    } catch (err: any) {
      console.log(`Cheerio real-scrape falhou para ${source.url} (${err.message}). Ativando alimentador de fallback para demonstração segura.`);
      
      const fallbackList = simulatedG1Fallback[source.category] || simulatedG1Fallback["Tecnologia"];
      const filtered = fallbackList.filter(item => !db.scrapedHistory.includes(item.url));

      source.lastScrapeResult = `Fallback Ativo: Carregou ${filtered.length} matérias típicas para simulação.`;
      source.articlesFound = filtered.length;
      writeDb(db);

      return res.json({ success: true, articles: filtered, isMock: true });
    }
  });

  // --- API ROUTE: DEV RESET ---
  app.post("/api/dev/reset", (req, res) => {
    const freshDb: DBStore = {
      settings: defaultSettings,
      articles: seedArticles,
      sources: defaultSources,
      scrapedHistory: seedArticles.filter(a => !!a.originalUrl).map(a => a.originalUrl!)
    };
    writeDb(freshDb);
    res.json({ message: "Banco de dados restaurado!", db: freshDb });
  });

  // --- COMPLIANT DYNAMIC SITEMAP EXTENSION ---
  app.get("/sitemap.xml", async (req, res) => {
    const db = readDb();
    const domain = db.settings.siteDomain || "e7news.com.br";
    const baseUrl = `https://${domain}`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add Home
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n`;
    xml += `    <changefreq>always</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // Fetch from Firebase
    const firebaseArticles = await getArticles();
    const firebaseWebStories = await getWebStories();

    // Add Articles
    firebaseArticles.forEach(art => {
      const artDate = art.publishedAt.split("T")[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/artigo/${art.slug}</loc>\n`;
      xml += `    <lastmod>${artDate}</lastmod>\n`;
      xml += `    <changefreq>hourly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add WebStories
    firebaseWebStories.forEach(story => {
      const storyDate = story.publishedAt.split("T")[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/webstories/${story.slug}</loc>\n`;
      xml += `    <lastmod>${storyDate}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  // --- ROBOTS.TXT ---
  app.get("/robots.txt", (req, res) => {
    const db = readDb();
    const domain = db.settings.siteDomain || "e7news.com.br";
    res.header("Content-Type", "text/plain");
    res.send(`User-agent: *
Allow: /
Sitemap: https://${domain}/sitemap.xml
`);
  });

  // --- VITE DEV MIDDLEWARE AND SPA FALLBACKS FOR SEO ---
  const serveSEOHTML = async (url: string, template: string) => {
    try {
      const $ = cheerio.load(template);
      const firebaseArticles = await getArticles();
      const domain = "e7news.com.br";
      
      let title = "E7 News - Tudo o que você precisa saber hoje";
      let description = "O E7 News é o seu portal definitivo. Cobertura completa dos principais acontecimentos de Monte Negro, Rondônia e do mundo, atualizada 24h por dia.";
      let canonicalUrl = `https://${domain}${url}`;
      
      // Match Article
      if (url.startsWith('/artigo/')) {
        const slug = url.split('/artigo/')[1]?.split('?')[0];
        const article = firebaseArticles.find(a => a.slug === slug);
        if (article) {
          title = article.title;
          description = article.subtitle || description;
          
          // Inject Open Graph / Schema
          $('head').append(`<meta property="og:title" content="${title}">`);
          $('head').append(`<meta property="og:description" content="${description}">`);
          if (article.imageUrl) {
             $('head').append(`<meta property="og:image" content="${article.imageUrl}">`);
          }
        }
      } else if (url.startsWith('/webstories/')) {
        const slug = url.split('/webstories/')[1]?.split('?')[0];
        const webstories = await getWebStories();
        const story = webstories.find(w => w.slug === slug);
        if (story) {
           title = story.title;
           description = story.description || description;

           $('head').append(`<meta property="og:title" content="${title}">`);
           $('head').append(`<meta property="og:description" content="${description}">`);
           $('head').append(`<meta property="og:type" content="article">`);
           if (story.pages.length > 0) {
              $('head').append(`<meta property="og:image" content="${story.pages[0].imageUrl}">`);
           }
        }
      } else if (url.startsWith('/sobre')) {
        title = "Quem Somos - E7 News";
      } else if (url.startsWith('/contato')) {
        title = "Contato - E7 News";
      } else if (url.startsWith('/privacidade')) {
        title = "Política de Privacidade - E7 News";
      } else if (url.startsWith('/termos')) {
        title = "Termos de Uso - E7 News";
      } else if (url.startsWith('/cookies')) {
        title = "Política de Cookies - E7 News";
      }
      
      $('title').text(title);
      $('meta[name="description"]').attr('content', description);
      $('head').append(`<link rel="canonical" href="${canonicalUrl}" />`);
      
      return $.html();
    } catch {
      return template;
    }
  };

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Important to prevent Vite from intercepting all HTML
    });
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      try {
        const templateStr = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        const transformedHtml = await vite.transformIndexHtml(req.originalUrl, templateStr);
        const finalHtml = await serveSEOHTML(req.originalUrl, transformedHtml);
        res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { index: false })); // Disable automatic index.html
    
    app.get("*", async (req, res) => {
      const templateStr = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
      const finalHtml = await serveSEOHTML(req.originalUrl, templateStr);
      res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[E7 NEWS SERVER] Ativo em http://localhost:${PORT}`);
  });
}

startServer();
