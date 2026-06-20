import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Article, SystemSettings } from "../types";

const articlesCol = collection(db, "articles");
const settingsDoc = doc(db, "settings", "global");

export async function getArticles(): Promise<Article[]> {
  try {
    const q = query(articlesCol, orderBy("publishedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getArticle(id: string): Promise<Article | null> {
  try {
    const snap = await getDoc(doc(db, "articles", id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Article;
    }
    return null;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function saveArticle(article: Article): Promise<void> {
  const { id, ...data } = article;
  await setDoc(doc(db, "articles", id), data);
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<void> {
  await updateDoc(doc(db, "articles", id), data);
}

export async function deleteArticle(id: string): Promise<void> {
  await deleteDoc(doc(db, "articles", id));
}

// Settings
export async function getSettings(): Promise<SystemSettings | null> {
  try {
    const snap = await getDoc(settingsDoc);
    if (snap.exists()) {
      return snap.data() as SystemSettings;
    }
    return null;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

export async function saveSettings(settings: SystemSettings): Promise<void> {
  await setDoc(settingsDoc, settings);
}
