import { DBStore, Article } from "./types";
import * as cheerio from "cheerio";

// Inject 'Leia Também' and semantic links into the HTML content
export function injectInternalLinks(htmlContent: string, db: DBStore, tags: string[], currentSlug: string): string {
  const $ = cheerio.load(htmlContent, null, false);
  let paragraphs = $("p").toArray();

  if (paragraphs.length >= 2) {
    // Find related articles based on tags to distribute link juice
    const related = db.articles
      .filter(a => a.id !== currentSlug && a.tags.some(t => tags.includes(t)))
      // Sort by newest to pass juice to recent
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 2);

    if (related.length > 0) {
      // Inject the first contextual "Leia Também" after the 2nd paragraph
      const firstSilo = related[0];
      const siloHtml = `
        <div class="my-6 border-l-4 border-red-700 bg-zinc-50 p-4 rounded-r-lg shadow-sm font-sans not-prose max-w-2xl">
          <span class="block text-[10px] font-black text-red-700 uppercase tracking-widest mb-1 items-center flex gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            Relacionado
          </span>
          <a href="/artigo/${firstSilo.slug}" class="text-sm sm:text-base font-bold text-zinc-900 hover:text-red-700 transition-colors block">
            ${firstSilo.title}
          </a>
        </div>
      `;
      $(paragraphs[1]).after(siloHtml);
    }

    if (related.length > 1 && paragraphs.length >= 4) {
      // Inject the second contextual "Leia Também" deeper in the content
      const secondSilo = related[1];
      const siloHtml = `
        <div class="my-8 border-l-4 border-zinc-400 bg-zinc-100 p-4 rounded-r-lg shadow-sm font-sans not-prose max-w-2xl">
          <span class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 items-center flex gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            Recomendado para você
          </span>
          <a href="/artigo/${secondSilo.slug}" class="text-sm sm:text-base font-bold text-zinc-800 hover:text-red-700 transition-colors block">
            ${secondSilo.title}
          </a>
        </div>
      `;
      const midPoint = Math.floor(paragraphs.length / 2);
      $(paragraphs[midPoint]).after(siloHtml);
    }
  }

  // Find exact exact tag keywords in paragraphs and wrap them in internal links to the home filtered by tag
  // We do it once per tag to avoid over-linking
  const linkedTags = new Set<string>();
  $("p").each((_, p) => {
     let pHtml = $(p).html() || "";
     let modified = false;

     for (const tag of tags) {
       if (linkedTags.has(tag)) continue;

       // Simple regex to match whole word tag
       const regex = new RegExp("\\\\b(" + tag + ")\\\\b", "i");
       if (regex.test(pHtml)) {
         pHtml = pHtml.replace(regex, `<a href="/?tag=${encodeURIComponent(tag)}" class="text-red-700 font-bold hover:underline" title="Ver mais sobre ${tag}">$1</a>`);
         linkedTags.add(tag);
         modified = true;
       }
     }

     if (modified) {
       $(p).html(pHtml);
     }
  });

  return $.html();
}
