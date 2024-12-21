import { supabase } from "../lib/supabase";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  category?: string;
  title: string;
  description: string;
  source: {
    name: string;
  };
  publishedAt: string;
  urlToImage: string;
  url: string;
}

export async function getKeywords(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('keywords')
      .select('keyword, priority')
      .order('priority', { ascending: true });

    if (error) {
      throw error;
    }

    // Combine keywords into a query string based on priority
    const prioritizedKeywords = data.map((item) => item.keyword).join(' OR ');
    return prioritizedKeywords ? [prioritizedKeywords] : [];
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return [];
  }
}

export async function getFinanceNews(): Promise<NewsArticle[]> {
  try {
    // Fetch prioritized keywords
    const keywords = await getKeywords();
    const query = keywords.length ? keywords[0] : 'Tesla Stock OR stock market';

    // Call NewsAPI with the dynamic query
    const response = await fetch(
      `${BASE_URL}/everything?q=${encodeURIComponent(
        query
      )}&language=en&sortBy=publishedAt&pageSize=6&apiKey=${API_KEY}`
    );
    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}