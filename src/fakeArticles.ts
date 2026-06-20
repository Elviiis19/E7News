import { Article, ScrapingSource, SystemSettings } from "./types";

export const defaultSettings: SystemSettings = {
  layoutModel: "editorial-mix",
  autoScraping: false,
  siteName: "E7 News",
  siteDomain: "e7news.com.br",
  siteDescription: "O E7 News é o seu portal de notícias de Monte Negro e região.",
  footerTitle: "O E7 News é o seu portal de notícias de Monte Negro e região.",
  footerTextBody: "Aqui a informação é séria, rápida e feita para você.\n\nInformação local hoje.\nReferência nacional amanhã.",
  autoPublish: true,
  elvisPrompt: `Você é o experiente Jornalista Elvis Dias, portador do DRT 1466/RO.
Escreva matérias completas a partir de fatos originais ou matérias fornecidas.

DIRETRIZES DE ESTILO:
1. Tom factual, sério, mas com forte tom autoral e análises políticas/sociais pontuais no meio do texto.
2. Sempre inclua um bloco bem demarcado no final ou destacado no início intitulado "Análise de Elvis Dias" ou "Opinião do Elvis".
3. Use uma estrutura dinâmica: títulos diretos, subtítulos instigantes, parágrafos médios de 2 a 3 linhas para fácil leitura mobile (foco Google Discover).
4. Insira links semânticos e termos fortes que conversem com outros temas de tecnologia, economia ou esportes brasileiros.
5. Ao reescrever notícias de terceiros, mantenha os dados cronológicos e fatos originais 100% íntegros, mas reconstrua totalmente o fluxo textual, vocabulário e a ordem dos argumentos para afastar qualquer indício de cópia (evitando plágio e garantindo indexação limpa).
6. Use formatação HTML limpa: parágrafos (<p>), subtítulos (<h2>, <h3>), listas (<ul>, <ol>, <li>), e <strong> para ênfases. Não use tags Markdown no HTML.`
};

export const defaultSources: ScrapingSource[] = [
  {
    id: "g1-tecnologia",
    name: "G1 - Tecnologia e Games",
    url: "https://g1.globo.com/tecnologia/",
    category: "Tecnologia",
    isActive: true,
    lastScrapedAt: new Date().toISOString()
  },
  {
    id: "g1-esportes",
    name: "G1 - Esportes",
    url: "https://g1.globo.com/esportes/",
    category: "Esportes",
    isActive: true,
    lastScrapedAt: new Date().toISOString()
  },
  {
    id: "uol-economia",
    name: "UOL Economia - Notícias",
    url: "https://economia.uol.com.br/",
    category: "Economia",
    isActive: true,
    lastScrapedAt: new Date().toISOString()
  }
];

export const seedArticles: Article[] = [
  {
    id: "ai-discover-2026-revolucao",
    title: "Como os novos algoritmos do Google Discover em 2026 estão transformando o tráfego de portais independentes",
    subtitle: "A ascensão do E-E-A-T de autoridade local beneficia jornalistas independentes com DRT ativo frente à explosão de conteúdo artificial genérico.",
    slug: "como-novos-algoritmos-google-discover-2026-portais-independentes",
    category: "Tecnologia",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Linhas de conexão digitais abstratas que ilustram algoritmos de busca e tráfego orgânico.",
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    readCount: 1245,
    isManual: true,
    tags: ["Google Discover", "SEO 2026", "E-E-A-T", "Tráfego Orgânico"],
    author: {
      name: "Elvis Dias",
      drt: "1466/RO",
      role: "Editor-Chefe / Jornalista Político e Investigativo",
      bio: "Elvis Dias é jornalista profissional sob o DRT 1466/RO, especializado em SEO de alta performance, tráfego escalável e análise de tendências tecnológicas no norte do país.",
      avatarUrl: "https://i.pinimg.com/736x/f4/c6/fd/f4c6fd275ad5b3a881368a5d90d9ec93.jpg"
    },
    content: `
      <p>Nos últimos meses, o ecossistema de buscas do Google passou por sua transformação mais agressiva desde a última década. Em 2026, com o advento definitivo do SGE (Search Generative Experience), as buscas tradicionais mudaram radicalmente de canal. O verdadeiro ouro do tráfego independente migrou quase na totalidade para o <strong>Google Discover</strong>.</p>

      <p>Nossa investigação revela que portais estruturados sobre eixos locais, que carregam nomes reais e assinaturas com credenciais fortes, como o registro de DRT (Delegacia Regional do Trabalho), estão alcançando marcas de indexação até 40% mais céleres do que domínios gigantes estáticos.</p>

      <h2>O Foco absoluto em E-E-A-T no Cenário de 2026</h2>
      <p>Diferente de 2024, onde bastava rechear matérias de palavras-chaves mecânicas, o motor de recomendação neural do Google agora analisa traços de autoria humana, referências de reputação externa e congruência geográfica. Portais que automatizam sua produção sem crivo de um conselho editorial ou de jornalistas devidamente creditados estão sendo severamente punidos pela ferramenta.</p>
      
      <p>A linkagem de mão dupla — onde o portal E7 News faz ligações semânticas diretas que constroem tópicos robustos por silos (clusters de conteúdo) — cria barreiras de confiança que o robô do Google adora. É por essa razão que as matérias mais lidas devem se referenciar diretamente, nutrindo tópicos relacionados de um mesmo autor.</p>

      <p>Para ler mais sobre tendências financeiras, acesse nossa análise detalhada sobre <a href="/artigo/impacto-das-novas-moedas-digitais-na-economia-da-amazonia">o impacto de moedas digitais na Amazônia</a>.</p>

      <blockquote>
        <strong>Análise do Jornalista Elvis Dias (DRT 1466/RO):</strong><br/>
        <em>"O Google enviou um recado muito claro aos criadores de conteúdo: a IA virou commodity. Se você apenas replica o que outros portais de notícias nacionais postaram, o Discover te ignora. O segredo para o sucesso escalável do portal E7 News é cruzar dados com perspectivas regionais legítimas. No norte do Brasil, a cobertura dos fatos econômicos com assinaturas físicas é o que consolida o prestígio e quebra o algoritmo."</em>
      </blockquote>
    `,
    relatedArticleIds: ["amazonia-cripto-financas-2026", "selecao-brasileira-copa-prep"]
  },
  {
    id: "amazonia-cripto-financas-2026",
    title: "Impacto das novas moedas digitais e o Pix Inteligente na economia da Amazônia Legal",
    subtitle: "Como ferramentas de automação e canais de transferência instantânea remodelam o comércio de Rondônia ao Amazonas neste ano.",
    slug: "impacto-das-novas-moedas-digitais-na-economia-da-amazonia",
    category: "Economia",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Pessoas utilizando cartões e pagamentos móveis em feira de economia solidária.",
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(), // 8 hours ago
    readCount: 934,
    isManual: true,
    tags: ["Pix Inteligente", "Economia Regional", "Amazônia", "Moedas Digitais"],
    author: {
      name: "Elvis Dias",
      drt: "1466/RO",
      role: "Editor-Chefe / Jornalista Político e Investigativo",
      bio: "Elvis Dias é jornalista profissional sob o DRT 1466/RO, especializado em SEO de alta performance, tráfego escalável e análise de tendências tecnológicas no norte do país.",
      avatarUrl: "https://i.pinimg.com/736x/f4/c6/fd/f4c6fd275ad5b3a881368a5d90d9ec93.jpg"
    },
    content: `
      <p>A integração da infraestrutura de liquidação em tempo real do Banco Central com novos agregados tecnológicos está moldando o cotidiano mercadológico da região Norte de uma forma sem precedentes. Rondônia desponta como polo de testes de soluções voltadas ao agronegócio sustentável e cooperativas.</p>

      <p>Dentre as evoluções documentadas, o "Pix Inteligente com Condições" permite que contratos agroecológicos na bacia do Rio Madeira se liquidem instantaneamente com fiscalização por satélite. O fluxo de recursos mais ágil barateia micro-créditos locais e reduz custos estruturais.</p>

      <h2>O papel da descentralização financeira</h2>
      <p>A adoção em larga escala de serviços descentralizados diminui a dependência de agências físicas, um problema histórico em municípios interioranos da Amazônia Legal. Esse avanço permite que produtos como borracha, cacau e castanha encontrem canais de venda direta aos centros urbanos do Sudeste e exportadores mundiais.</p>

      <p>Como apontamos em nossa <a href="/artigo/como-novos-algoritmos-google-discover-2026-portais-independentes">análise de tráfego de portais 2026</a>, indexar conteúdos regionais de economia gera relevância temática imediata.</p>

      <blockquote>
        <strong>Análise do Jornalista Elvis Dias (DRT 1466/RO):</strong><br/>
        <em>"O Pix Inteligente não é apenas uma conveniência bancária; em Rondônia, ele representa a sobrevivência da cadeia produtiva local de pequena escala. Estar na vanguarda desta cobertura financeira com dados consolidados da região nos insere diretamente nos termos de busca do Google Discover, trazendo tráfego altíssimo para o E7 News devido ao frescor da notícia."</em>
      </blockquote>
    `,
    relatedArticleIds: ["ai-discover-2026-revolucao"]
  },
  {
    id: "selecao-brasileira-copa-prep",
    title: "Seleção Brasileira muda foco tático para Eliminatórias e revela nova geração de Rondônia",
    subtitle: "A preparação rumo ao grande torneio de 25/26 revela jogadores oriundos de ligas locais recebendo sondagens europeias.",
    slug: "selecao-brasileira-taticas-eliminatorias-revelacao-rondonia",
    category: "Esportes",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Vista aérea de um estádio de futebol iluminado durante jogo noturno com arquibancadas lotadas.",
    publishedAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
    readCount: 2210,
    isManual: true,
    tags: ["Seleção Brasileira", "Futebol", "Revelações de Rondônia", "Esportes"],
    author: {
      name: "Elvis Dias",
      drt: "1466/RO",
      role: "Editor-Chefe / Jornalista Político e Investigativo",
      bio: "Elvis Dias é jornalista profissional sob o DRT 1466/RO, especializado em SEO de alta performance, tráfego escalável e análise de tendências tecnológicas no norte do país.",
      avatarUrl: "https://i.pinimg.com/736x/f4/c6/fd/f4c6fd275ad5b3a881368a5d90d9ec93.jpg"
    },
    content: `
      <p>A reestruturação técnica da Seleção Brasileira de futebol masculino sob a nova comissão prioriza a descentralização de talentos nacionais. Nas últimas semanas, olheiros internacionais estiveram acompanhando torneios de base na região Norte, especificamente em Rondônia, onde desponta uma joia futebolística de dezoito anos.</p>

      <p>O jovem lateral direito que atuava no campeonato Rondoniense de base acaba de assinar pré-contrato com clube da série A nacional sob assédio de clubes da liga portuguesa. O futebol local celebra o avanço como um marco histórico.</p>

      <h2>O Foco Tático no Meio Campo</h2>
      <p>O treinador da seleção ressaltou que a mobilidade tática e a resistência em climas extremos favorecem atletas criados no Norte e Nordeste brasileiro. A nova comissão médica apoia treinamentos com imersão sensorial de última geração, aproximando a preparação física ao mais refinado patamar de ciências esportivas.</p>

      <blockquote>
        <strong>Análise do Jornalista Elvis Dias (DRT 1466/RO):</strong><br/>
        <em>"O futebol rondoniense sempre foi rico, porém esquecido pelas grandes corporações de notícias do eixo Rio-São Paulo. Quando o portal E7 News expõe essas reportagens ricas com alt de imagens impecáveis e detalhes estatísticos do garoto, atraímos interesse de torcedores do país inteiro. Esta é a união ideal das técnicas de SEO de cauda longa (Long-tail SEO) com as paixões nacionais."</em>
      </blockquote>
    `,
    relatedArticleIds: ["ai-discover-2026-revolucao", "amazonia-cripto-financas-2026"]
  }
];

// Seed templates for programmatic expansion up to 50 items
const techTemplates = {
  titles: [
    "Ji-Paraná desponta com cooperativas agrícolas adotando drones autônomos de pulverização",
    "Cursos de desenvolvimento de software em Porto Velho têm recorde de matrículas",
    "Prefeitura de Vilhena implanta central inteligente conectada via satélite para o interior",
    "Parque Tecnológico de Rondônia recebe aporte financeiro para impulsionar agrotechs locais",
    "Conexão de fibra óptica de alta velocidade avança ao longo da bacia do Rio Machado",
    "Inteligência Artificial na triagem de exames médicos reduz tempo de fila em Ariquemes",
    "Logística fluvial no Rio Madeira implementa rastreio por sensores IoT de última geração",
    "Cacoal sedia o maior simpósio de robótica educacional e automação da Região Norte",
    "Dificuldade de conexão é superada com implantação em massa de antenas Starlink no campo",
    "Sistemas de segurança digital de cooperativas de Rondônia recebem selo internacional de criptografia",
    "Rondônia lança edital pioneiro para incentivar patentes de biotecnologia sobre o açaí nativo",
    "Guajará-Mirim instala novas torres meteorológicas digitais integradas com monitoramento fluvial",
    "Comércio de Rolim de Moura triplica vendas integrando inteligência artificial ao atendimento",
    "Startup criada de forma independente em Jaru é selecionada para aceleração no Vale do Silício",
    "Rastreabilidade de cadeias de café conilon por blockchain entra em fase de testes reais",
    "Alunos de escola estadual de Ouro Preto do Oeste criam protótipo de estufa hidropônica automatizada"
  ],
  subtitles: [
    "A tecnologia em drones otimiza a produtividade das lavouras familiares rurais.",
    "A alta demanda de firmas nacionais acelera a busca por capacitação em Rondônia.",
    "Com novas conexões instantâneas, o sistema melhora o atendimento à saúde camponesa.",
    "Aceleração de agrotechs locais do Vale do Guaporé recebe incentivos inéditos.",
    "Banda larga via rádio atende distritos rurais para inclusão e rastreabilidade logística.",
    "Triagem diagnóstica por visão computacional agiliza as consultas e diminui custos no SUS.",
    "Sensores de telemetria fluvial evitam perdas de grãos em embarques rumo a Itacoatiara."
  ],
  images: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80"
  ],
  tags: ["Agrotech", "Automação", "Robótica", "Fomento Digital", "Internet Rural"]
};

const ecoTemplates = {
  titles: [
    "Cotação histórica: Saca do Café Conilon ultrapassa barreira histórica de preço em Rondônia",
    "Exportadora amplia terminal graneleiro de Porto Velho projetando exportação recorde de grãos",
    "Produção de cacau de manejo ecológico na bacia amazônica atrai aporte milionário estrangeiro",
    "Cooperativas de crédito rondonienses superam patamares históricos de liberação de microcrédito",
    "Feira Rondônia Rural Show projeta quebrar recorde de transações financeiras em sua nova edição",
    "Indústria de Vilhena impulsiona abertura de empregos formais com novas linhas de processamento",
    "Comércio regional em Ariquemes planeja expansão de contratações motivado pela safra de grãos",
    "Piscicultura rondoniense ganha mercado internacional com avanço nas exportações de tambaqui",
    "Pequenos produtores de castanha-do-pará celebram nova saca valorizada com suporte de cooperativas",
    "Instalação de novo porto seco na divisa estadual deve baratear fretes de importação em 18%",
    "Produção de lácteos certificados impulsiona faturamento de pequenas fazendas familiares de leite",
    "Inflação regional em queda estimula investimento imobiliário e construção civil em Porto Velho",
    "Governo estadual aprova pacote tributário favorável para atração de indústrias de energia solar",
    "PIB rondoniense cresce acima da média nacional sustentado pela diversificação da agroindústria",
    "Arroba do boi gordo apresenta firmeza de alta nas principais praças bovinas rondonienses",
    "Empreendedorismo feminino bate novos recordes de formalização em Ji-Paraná em cooperativas locais"
  ],
  subtitles: [
    "A forte valorização internacional e melhora na qualidade dos grãos beneficiam milhares de produtores.",
    "O investimento de escoamento rápido de soja para mercados globais ganha apoio fluvial.",
    "Projetos de bioeconomia aliam preservação florestal e alta rentabilidade de manejo florestal.",
    "Fomento ao produtor familiar impulsiona modernização e compra de novos equipamentos locais.",
    "O show agrícola atrai gigantes do maquinário do agronegócio nacional e internacional.",
    "Usinas integradas do sul de Rondônia expandem folha de pagamentos com vagas industriais.",
    "A força rondoniense impulsiona resultados fantásticos de fluxo de caixa no varejo urbano."
  ],
  images: [
    "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1521791136368-1a46827d0515?auto=format&fit=crop&w=600&q=80"
  ],
  tags: ["Café Conilon", "Cooperativismo", "Commodities RO", "Microcrédito", "Agronegócio", "Boi Gordo"]
};

const esportesTemplates = {
  titles: [
    "Inscrições para Meia-Maratona do Rio Madeira em Porto Velho superam expectativas",
    "Atletismo de Rondônia desponta com jovem de Ji-Paraná qualificado para finais nacionais",
    "Ji-Paraná FC e Real Ariquemes fazem clássico emocionante valendo vaga na Copa do Brasil",
    "Vilhena conquista título de futsal escolar unificado com campanha brilhante de invencibilidade",
    "Torneio regional de ciclismo de montanha reúne atletas de elite na serra de Teixeirópolis",
    "Pesca esportiva no Rio Guaporé se destaca internacionalmente e atrai competidores renomados",
    "Escolas públicas de Ariquemes recebem investimento para novos ginásios esportivos integrados",
    "Associação desportiva lança escolinha de futebol social atendendo mais de 400 jovens carentes",
    "Judoca de Ouro Preto do Oeste conquista medalha de prata de categoria peso pesado em torneio nacional",
    "Campeonato Rondoniense de Futebol registra maior audiência histórica em transmissões online",
    "Cacoal sedia fase regional de ginástica artística revelando promessas da modalidade olímpica",
    "Canoagem no Rio Machado ganha nova infraestrutura de treinamento para equipe rondoniense de alta performance",
    "Rondônia terá representantes na corrida internacional de São Silvestre visando pódios inéditos",
    "Lutadores de Porto Velho faturam cinturões de Jiu-Jitsu em campeonato unificado na Região Norte",
    "Clube local investe em inteligência de dados táticos para rastrear promessas do futebol interiorano"
  ],
  subtitles: [
    "A prova ao longo do rio cartão postal da capital promove turismo esportivo.",
    "O atleta bate recorde pessoal de velocidade nas eliminatórias do Troféu Brasil.",
    "O clássico lota arquibancadas do estádio municipal e gera renda inédita.",
    "O time escolar conquista medalha de ouro coroando excelente trabalho coletivo rondoniense.",
    "Trilhas extremas do norte desafiam concorrentes nacionais em corrida de montanhas.",
    "Manejo do turismo esportivo atrai competidores para pescar tucunarés gigantes do Guaporé."
  ],
  images: [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80"
  ],
  tags: ["Futebol RO", "Copa Regional", "Maratona", "Futsal", "Pesca Esportiva", "Atletismo"]
};

// Generate procedural items to complete 50 items
const categories = ["Tecnologia", "Economia", "Esportes"];

for (let i = 0; i < 47; i++) {
  const cat = categories[i % categories.length];
  let pool = techTemplates;
  if (cat === "Economia") pool = ecoTemplates;
  if (cat === "Esportes") pool = esportesTemplates;

  const tIdx = (i * 7) % pool.titles.length;
  const sIdx = (i * 3) % pool.subtitles.length;
  const imIdx = (i * 11) % pool.images.length;

  const title = pool.titles[tIdx];
  const subtitle = pool.subtitles[sIdx];
  const img = pool.images[imIdx];

  // Derive unique properties
  const rawSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const id = `proc-${cat.toLowerCase().slice(0, 3)}-${i}-${rawSlug.slice(0, 30)}`;
  const slug = `${rawSlug}-${i + 10}`;

  // Time decay backwards to simulate chronological history (each article published 3.5 hours earlier than previous)
  const pubTime = new Date(Date.now() - (3600000 * 4) - (i * 3600000 * 3.5)).toISOString();
  const reads = 200 + Math.floor(Math.sin(i) * 150) + (47 - i) * 15;

  // Build tags
  const tags = [pool.tags[i % pool.tags.length], pool.tags[(i + 1) % pool.tags.length], "Rondônia", cat];

  const content = `
    <p>A cobertura especial do portal E7 News destaca avanços importantes que moldam o cotidiano de Rondônia. Esta apuração exclusiva traz dados consolidados e o acompanhamento direto do desenvolvimento em cidades do estado, refletindo a dinâmica regional de empreendedorismo e transformação social.</p>

    <p>Entrevistados locais ressaltam que o ritmo acelerado de crescimento em pólos estratégicos como Ariquemes, Ji-Paraná e Porto Velho cria pontes de conectividade extremamente vantajosas para parcerias e investimentos de longo prazo.</p>

    <h2>Desafios e Soluções Globais Aplicadas Regionalmente</h2>
    <p>É importante considerar como os fluxos modernos de inovação nacional se acomodam em comunidades do Norte do Brasil. A agricultura e a tecnologia de pequenos agricultores mostram resiliência, gerando pautas de alto engajamento no Google Discover.</p>

    <blockquote>
      <strong>Análise do Jornalista Elvis Dias (DRT 1466/RO):</strong><br/>
      <em>"Acompanhar de perto o desenrolar dessas notícias rondonienses nos dá a certeza de que a cobertura profissional séria é essencial. Ao trazer análises com base no DRT 1466/RO, garantimos que o E7 News continue sendo a maior referência em credibilidade regional do estado, superando canais tradicionais."</em>
    </blockquote>
  `;

  seedArticles.push({
    id,
    title,
    subtitle,
    slug,
    content,
    imageUrl: img,
    imageAlt: `Ilustração dedicada para: ${title}`,
    category: cat,
    publishedAt: pubTime,
    author: {
      name: "Elvis Dias",
      drt: "1466/RO",
      role: "Editor-Chefe / Jornalista Político e Investigativo",
      bio: "Elvis Dias é jornalista profissional sob o DRT 1466/RO, especializado em SEO de alta performance, tráfego escalável e análise de tendências tecnológicas no norte do país.",
      avatarUrl: "https://i.pinimg.com/736x/f4/c6/fd/f4c6fd275ad5b3a881368a5d90d9ec93.jpg"
    },
    tags,
    readCount: reads,
    relatedArticleIds: ["ai-discover-2026-revolucao"],
    isManual: false,
    engagementScore: 70 + (i % 25)
  });
}
