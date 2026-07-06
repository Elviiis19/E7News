const Parser = require("rss-parser");
const parser = new Parser();
parser.parseURL("https://agenciabrasil.ebc.com.br/cultura")
.then(feed => console.log("RSS OK", feed.items.length))
.catch(e => console.error("RSS Error:", e.message));
