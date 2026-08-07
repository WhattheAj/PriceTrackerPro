import { apiClient } from './auth';
import { Product } from '../types';

/**
 * Service function to search Digikala products via Django Backend API.
 * Endpoint: POST /api/search/
 */
export async function searchDigikalaProductsApi(query: string, page = 1): Promise<{ products: Product[]; remainingTokens: number }> {
  const trimmed = query.trim();
  if (!trimmed) return { products: [], remainingTokens: 0 };

  const response = await apiClient.post('/search/', {
    query: trimmed,
    page,
  });

  const { results, tokens_remaining } = response.data;

  // Format Django search response items to Product frontend type
  const products: Product[] = (results || []).map((item: any) => ({
    id: item.id || item.digikala_id,
    title_fa: item.title_fa || item.title,
    title_en: item.title_en || '',
    price: {
      selling_price: item.price_selling || item.price?.selling_price || 0,
      rrp_price: item.price_rrp || item.price?.rrp_price || 0,
      discount_percent: item.discount_percent || item.price?.discount_percent || 0,
      currency: 'تومان',
    },
    rating: {
      rate: item.rating?.rate || 4.5,
      count: item.rating?.count || 10,
    },
    image: item.image_url || item.image || '',
    url: item.product_url || item.url || '#',
    seller: item.seller || 'دیجی‌کالا',
    brand: item.brand || 'متفرقه',
    category: item.category || 'عمومی',
    status: item.is_in_stock ? 'marketable' : 'out_of_stock',
  }));

  return {
    products,
    remainingTokens: tokens_remaining,
  };
}
