fetch("https://agenciabrasil.ebc.com.br/cultura", {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml"
          },
          signal: AbortSignal.timeout(8000)
}).then(r => console.log("OK", r.status)).catch(e => console.error("Error", e));
