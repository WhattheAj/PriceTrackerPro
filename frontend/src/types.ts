export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  tokens: number;
  searchCount: number;
  createdAt: string;
}

export interface ProductPrice {
  selling_price: number;
  rrp_price: number;
  discount_percent: number;
  currency: 'تومان' | 'ریال';
}

export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number | string;
  title_fa: string;
  title_en?: string;
  price: ProductPrice;
  rating: ProductRating;
  image: string;
  url: string;
  seller: string;
  brand: string;
  category: string;
  status: 'marketable' | 'out_of_stock';
  digikalaId?: number;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  tokensUsed: number;
  resultCount: number;
}

export interface WatchlistItem {
  id: number;
  product_id: string;
  title: string;
  provider: string;
  current_price: number;
  target_price: number;
  product_url: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type AuthMode = 'login' | 'signup';
export type ViewMode = 'auth' | 'dashboard';
export type DisplayLayout = 'grid' | 'table';
