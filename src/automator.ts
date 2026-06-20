import cron from "node-cron";
import * as cheerio from "cheerio";
import { DBStore, Article } from "./types";

// Extracted from server.ts for reuse
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z0-9\s-]/g, "") 
    .trim()
    .replace(/\s+/g, "-") 
    .replace(/-+/g, "-"); 
}

// Configura o motor de automação (Web Scraping + IA rewrite via cron)
export function setupAutomator(
  db: DBStore,
  writeDb: (db: DBStore) => void,
  generateArticleContent: (sourceText: string, category: string, title?: string, url?: string) => Promise<any>
) {
  // Execute every 1 hour in background (simulating cron jobs for scraping)
  // Expressive schedule: At minute 0 past every hour
  cron.schedule("0 * * * *", async () => {
    console.log("[AUTOMATOR] Iniciando motor de automação e scraping (Fase 2)...");
    await runAutomationCycle(db, writeDb, generateArticleContent);
  });

  console.log("[AUTOMATOR] Cron Jobs registrados. Fase 2 de automação ativa.");
}

export async function runAutomationCycle(
  db: DBStore,
  writeDb: (db: DBStore) => void,
  generateArticleContent: (sourceText: string, category: string, title?: string, url?: string) => Promise<any>
) {
  const activeSources = db.sources.filter(s => s.isActive);
  
  if (activeSources.length === 0) {
    console.log("[AUTOMATOR] Nenhuma fonte ativa para raspar.");
    return;
  }

  const defaultAuthor = {
    name: "Elvis Dias",
    drt: "1466/RO",
    role: "Editor-Chefe / Jornalista Político e Investigativo",
    bio: "Elvis Dias é jornalista profissional sob o DRT 1466/RO, especializado em SEO de alta performance.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80"
  };

  for (const source of activeSources) {
    try {
      console.log("[AUTOMATOR] Analisando fonte: " + source.name + " (" + source.url + ")");
      
      const response = await fetch(source.url, {
        headers: { "User-Agent": "E7News-Bot/1.0" },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) throw new Error("HTTP " + response.status);
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const candidates: { title: string; url: string; imgUrl: string }[] = [];
      
      $("a").each((i, el) => {
        const href = $(el).attr("href") || "";
        const title = $(el).text().trim();
        
        if (
          href && 
          title.length > 30 && 
          !db.scrapedHistory.includes(href) &&
          !candidates.some(c => c.url === href)
        ) {
          const imgUrl = $(el).closest("div").find("img").attr("src") || 
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80";
          candidates.push({ title, url: href, imgUrl });
        }
      });

      // Limit to 2 per cycle to avoid API rate limits and spamming
      const toProcess = candidates.slice(0, 2);
      
      for (const item of toProcess) {
        console.log("[AUTOMATOR] Scraped nova URL: " + item.title.substring(0, 50) + "...");
        
        // Simulating the deeper fetch of the inner article content
        const innerText = "Conteúdo simulado rastreado de: " + item.url + ". A matéria fala sobre: " + item.title;
        
        // Call Gemini logic
        const generated = await generateArticleContent(innerText, source.category, item.title, item.url);
        
        const baseSlug = generateSlug(generated.title);
        let finalSlug = baseSlug;
        let count = 1;
        while (db.articles.some(a => a.slug === finalSlug)) {
          finalSlug = baseSlug + "-" + count;
          count++;
        }

        const { injectInternalLinks } = await import("./seo");
        const finalHtml = injectInternalLinks(generated.content, db, generated.tags, finalSlug);

        const newArticle: Article = {
          id: finalSlug,
          title: generated.title,
          subtitle: generated.subtitle,
          slug: finalSlug,
          content: finalHtml,
          imageUrl: item.imgUrl,
          imageAlt: generated.title,
          category: source.category,
          publishedAt: new Date().toISOString(),
          author: defaultAuthor,
          tags: generated.tags,
          readCount: 0,
          relatedArticleIds: [],
          isManual: false,
          originalUrl: item.url,
          originalSource: source.name,
          engagementScore: Math.floor(Math.random() * 30) + 70
        };

        db.articles.push(newArticle);
        db.scrapedHistory.push(item.url);
        
        console.log("[AUTOMATOR] + Post Publicado via Scraping: " + newArticle.title);
      }

      source.lastScrapeResult = "Automação rodou com sucesso. Extraídos: " + toProcess.length;
      source.lastScrapedAt = new Date().toISOString();
      writeDb(db);
      
    } catch (err: any) {
      console.log("[AUTOMATOR] Falhou fonte " + source.name + ": ", err.message);
      source.lastScrapeResult = "Automação falhou: " + err.message;
      writeDb(db);
    }
  }

  console.log("[AUTOMATOR] Ciclo concluído.");
}
