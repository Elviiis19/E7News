const sourceUrl = "https://g1.globo.com/rss/g1/";
fetch(sourceUrl, {
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
}).then(r => r.text()).then(r => console.log(r.substring(0, 100))).catch(e => console.error(e));
