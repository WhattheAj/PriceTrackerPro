import { apiClient } from './auth';
import { Product, SearchHistoryItem } from '../types';

export interface SearchApiResponse {
  products: Product[];
  remainingTokens: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export async function searchDigikalaProductsApi(query: string, page = 1): Promise<SearchApiResponse> {
  const trimmed = query.trim();
  if (!trimmed) return { products: [], remainingTokens: 0, totalItems: 0, totalPages: 0, currentPage: 1 };

  const response = await apiClient.post('/search/', {
    query: trimmed,
    page,
  });

  const { products: rawProducts, results: rawResults, tokens_remaining, total_items, total_pages, current_page } = response.data;
  const rawList = rawProducts || rawResults || [];

  const products: Product[] = rawList.map((item: any) => ({
    id: item.id || item.raw_id || item.digikala_id,
    title_fa: item.title || item.title_fa || '',
    title_en: item.title_en || '',
    price: {
      selling_price: item.price_toman ?? item.price_selling_toman ?? (item.price_selling ? Math.round(item.price_selling / 10) : 0),
      rrp_price: item.rrp_price_toman ?? item.price_rrp_toman ?? (item.price_rrp ? Math.round(item.price_rrp / 10) : 0),
      discount_percent: item.offer ?? item.discount_percent ?? 0,
      currency: 'تومان',
    },
    rating: {
      rate: item.rating?.rate || 4.5,
      count: item.rating?.count || 10,
    },
    image: item.image_url || item.image || '',
    url: item.link || item.product_url || item.url || '#',
    seller: item.provider || item.store_name || item.seller || 'فروشگاه',
    brand: item.description || item.brand || 'متفرقه',
    category: item.category || 'کالای دیجیتال',
    status: item.is_in_stock ? 'marketable' : 'out_of_stock',
  }));

  return {
    products,
    remainingTokens: tokens_remaining,
    totalItems: total_items || products.length,
    totalPages: total_pages || 1,
    currentPage: current_page || page,
  };
}

export async function exportProductsCSVApi(products: Product[]): Promise<void> {
  const response = await apiClient.post('/export-csv/', { products }, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8-sig;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'products.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function fetchSearchHistoryApi(): Promise<SearchHistoryItem[]> {
  const response = await apiClient.get('/search/history/');
  return response.data || [];
}
