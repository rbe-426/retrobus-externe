import { apiUrl } from './api.js';

export const normalizeNewsArticle = (article) => {
  const media = Array.isArray(article.media) ? article.media : [];
  const cover = article.imageUrl || media.find((item) => item.type === 'image' && item.url)?.url;

  return {
    ...article,
    id: article.slug || String(article.id),
    publishedAt: String(article.publishedAt || article.createdAt || '').slice(0, 10),
    excerpt: article.excerpt || String(article.content || article.body || '').replace(/[#*_[\]()`>-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180),
    image: cover || '/hero_rentree.jpg',
    imageAlt: article.imageAlt || article.title,
    media,
    content: article.content || article.body || '',
  };
};

export async function fetchPublicNews() {
  const response = await fetch(apiUrl('/public/news'));
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const news = await response.json();
  return Array.isArray(news) ? news.map(normalizeNewsArticle) : [];
}