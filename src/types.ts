export interface Author {
  name: string;
  drt: string;
  bio: string;
  role: string;
  avatarUrl: string;
}

export type LayoutModel = "editorial-mix" | "g1-classic" | "discover-modern" | "r7-bento";

export interface SystemSettings {
  layoutModel: LayoutModel;
  autoScraping: boolean;
  elvisPrompt: string;
  autoPublish: boolean;
  siteName: string;
  siteDomain: string;
  siteDescription?: string;
  footerTitle?: string;
  footerTextBody?: string;
  socialAutomation?: {
    color: string;
    autoPost: boolean;
    tokens: Record<string, string>;
  };
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  seoTitle?: string;
  slug: string;
  content: string; // HTML-safe content
  originalTitle?: string;
  originalUrl?: string;
  originalSource?: string;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt: string;
  imageCredit?: string;
  category: string;
  publishedAt: string;
  author: Author;
  tags: string[];
  readCount: number;
  relatedArticleIds: string[];
  isManual: boolean;
  isTopHeadline?: boolean;
  engagementScore?: number; // Simulated index
  status?: "draft" | "scheduled" | "published";
  scheduledFor?: string; // ISO string para agendamento
}

export interface ScrapingSource {
  id: string;
  name: string;
  url: string;
  category: string;
  isActive: boolean;
  intervalHours?: number; // Frequência de captura em horas
  lastScrapedAt?: string;
  lastScrapeResult?: string;
  articlesFound?: number;
}

export interface SitemapLog {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export interface WebStoryPage {
  imageUrl: string;
  imageAlt: string;
  caption?: string;
  title?: string;
  text?: string;
  animation?: "pan-up" | "pan-down" | "zoom-in" | "zoom-out";
}

export interface WebStory {
  id: string;
  title: string;
  slug: string;
  description: string;
  pages: WebStoryPage[]; // Max 10 pages
  publishedAt: string;
  tags: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface DBStore {
  settings: SystemSettings;
  articles: Article[];
  webStories?: WebStory[];
  sources: ScrapingSource[];
  scrapedHistory: string[]; // Set of URLs already scraped to prevent duplicate posts
  messages?: ContactMessage[]; // Contact messages received via the site
}
