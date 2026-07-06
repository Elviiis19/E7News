const cheerio = require("cheerio");
const sourceUrl = "https://agenciabrasil.ebc.com.br/cultura";
fetch(sourceUrl)
.then(r => r.text())
.then(html => {
  const $ = cheerio.load(html);
  let parsedItems = [];
  $("a").each((i, el) => {
    const href = $(el).attr("href") || "";
    const title = $(el).text().trim();
    if (href.length > 5 && title.length > 20 && !href.startsWith("javascript") && !href.startsWith("#")) {
       let absoluteUrl = new URL(href, sourceUrl).href;
       if (parsedItems.some(item => item.url === absoluteUrl)) return;
       const imgUrl = $(el).closest("div, section, article").find("img").attr("src") 
                           || $(el).find("img").attr("src")
                           || "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?auto=format&fit=crop&w=600&q=80";
       parsedItems.push({url: absoluteUrl, title, imgUrl});
       if (imgUrl.startsWith && imgUrl.startsWith("/")) {
          // testing if this crashes
       }
    }
  });
  console.log("Found:", parsedItems.length);
  console.log(parsedItems.slice(0, 3));
})
.catch(e => console.error("Error:", e));
