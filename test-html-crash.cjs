const cheerio = require("cheerio");
const source = { url: "https://agenciabrasil.ebc.com.br/cultura", category: "Geral" };

fetch(source.url)
.then(r => r.text())
.then(html => {
  const $ = cheerio.load(html);
  let parsedItems = [];
  try {
        $("a").each((i, el) => {
          const href = $(el).attr("href") || "";
          const title = $(el).text().trim();
          
          if (
            href.length > 5 && 
            title.length > 20 && 
            !href.startsWith("javascript") && 
            !href.startsWith("#")
          ) {
            let absoluteUrl = href;
            try {
              absoluteUrl = new URL(href, source.url).href;
            } catch (e) {
              return;
            }

            if (parsedItems.some(item => item.url === absoluteUrl)) {
                return;
            }
            
            const imgUrl = $(el).closest("div, section, article").find("img").attr("src") 
                           || $(el).find("img").attr("src")
                           || "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?auto=format&fit=crop&w=600&q=80";

            parsedItems.push({
              title,
              summary: "Clique em 'Reescrever' para que o motor de Inteligência Estrutural contextualize essa captura original.",
              url: absoluteUrl,
              imageUrl: imgUrl.startsWith("/") ? new URL(imgUrl, source.url).href : imgUrl,
              category: source.category || "Geral"
            });
          }
        });
        console.log("Success! Items:", parsedItems.length);
  } catch (e) {
    console.error("Crash!", e);
  }
});
