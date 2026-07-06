const cheerio = require("cheerio");
fetch("https://g1.globo.com/")
.then(r => r.text())
.then(html => {
  const $ = cheerio.load(html);
  let parsedItems = [];
  $("a").each((i, el) => {
    const href = $(el).attr("href") || "";
    const title = $(el).text().trim();
    if (href.length > 5 && title.length > 20 && !href.startsWith("javascript") && !href.startsWith("#")) {
       parsedItems.push({href, title});
    }
  });
  console.log("Found:", parsedItems.length);
  console.log(parsedItems.slice(0, 3));
})
.catch(e => console.error(e));
