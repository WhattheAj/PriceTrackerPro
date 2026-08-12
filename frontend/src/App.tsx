import React, { useState, useEffect } from 'react';
import { User, Product, ViewMode, DisplayLayout, SearchHistoryItem, WatchlistItem } from './types';
import { getSavedUser, logoutUser, fetchUserProfileApi } from './services/auth';
import { 
  searchDigikalaProductsApi, 
  exportProductsCSVApi, 
  fetchSearchHistoryApi,
  fetchWatchlistApi,
  addToWatchlistApi,
  removeFromWatchlistApi
} from './services/digikala';
import { exportProductsToCSV } from './utils/csvExporter';
import { toPersianDigits, formatPrice } from './utils/farsi';

import { Header } from './components/Header';
import { AuthPage } from './components/AuthPage';
import { SearchBar } from './components/SearchBar';
import { ProductCard } from './components/ProductCard';
import { ProductTable } from './components/ProductTable';
import { Pagination } from './components/Pagination';
import { SkeletonCard } from './components/SkeletonCard';
import { NotFoundPage } from './components/NotFoundPage';
import { TokenModal } from './components/TokenModal';
import { SearchHistoryModal } from './components/SearchHistoryModal';
import { ProductCompareModal } from './components/ProductCompareModal';
import { WatchlistModal } from './components/WatchlistModal';
import { WatchlistManageModal } from './components/WatchlistManageModal';

import { 
  FileSpreadsheet, 
  LayoutGrid, 
  Table as TableIcon, 
  ArrowUpDown, 
  Layers, 
  Coins, 
  AlertCircle, 
  Sparkles,
  CheckSquare,
  Search,
  Filter,
  Check
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>('auth');
  const [layoutMode, setLayoutMode] = useState<DisplayLayout>('grid');

  const [currentQuery, setCurrentQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedProductIds, setSelectedProductIds] = useState<Array<string | number>>([]);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'discount' | 'rating'>('default');
  const [selectedStore, setSelectedStore] = useState<'all' | 'digikala' | 'technolife'>('all');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);
  const [isWatchlistManageOpen, setIsWatchlistManageOpen] = useState(false);
  const [selectedWatchlistProduct, setSelectedWatchlistProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function initUser() {
      const saved = getSavedUser();
      if (saved) {
        setUser(saved);
        setActiveView('dashboard');
      }
      const remoteUser = await fetchUserProfileApi();
      if (remoteUser) {
        setUser(remoteUser);
        setActiveView('dashboard');
      } else if (!saved) {
        setActiveView('auth');
      }
    }
    initUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadWatchlist();
    }
  }, [user?.id]);

  const loadWatchlist = async () => {
    try {
      const items = await fetchWatchlistApi();
      setWatchlistItems(items);
    } catch {}
  };

  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setActiveView('auth');
    setProducts([]);
    setWatchlistItems([]);
  };

  const handleSearch = async (queryText: string, pageNum = 1, activeUser = user) => {
    if (!activeUser) {
      setActiveView('auth');
      return;
    }

    if (activeUser.tokens <= 0) {
      setIsTokenModalOpen(true);
      return;
    }

    setIsLoading(true);
    setSearchError(null);
    setCurrentQuery(queryText);

    try {
      const res = await searchDigikalaProductsApi(queryText, pageNum);

      setUser((prev) => (prev ? { ...prev, tokens: res.remainingTokens } : null));

      setProducts(res.products);
      setSelectedProductIds([]);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems);
      setCurrentPage(res.currentPage);

      const newUrl = `${window.location.pathname}?q=${encodeURIComponent(queryText)}&page=${res.currentPage}`;
      window.history.pushState({ path: newUrl }, '', newUrl);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Search error:', err);
      if (err.response?.status === 401) {
        logoutUser();
        setUser(null);
        setActiveView('auth');
        setSearchError('نشست کاری شما منقضی شده است. لطفاً مجدداً وارد شوید.');
        return;
      }
      const msg = err.response?.data?.error || err.response?.data?.detail || 'خطا در دریافت اطلاعات از سرور. لطفاً مجدداً تلاش کنید.';
      setSearchError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    const pageParam = parseInt(params.get('page') || '1', 10);
    if (qParam && !products.length) {
      handleSearch(qParam, pageParam, user);
    }
  }, [user?.id]);

  const handleAddTokens = (amount: number) => {
    setUser((prev) => (prev ? { ...prev, tokens: prev.tokens + amount } : null));
  };

  const toggleSelectProduct = (id: string | number) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllProducts = () => {
    if (selectedProductIds.length === sortedProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(sortedProducts.map((p) => p.id));
    }
  };

  const handleExportCSV = async () => {
    const exportList =
      selectedProductIds.length > 0
        ? products.filter((p) => selectedProductIds.includes(p.id))
        : products;

    try {
      await exportProductsCSVApi(exportList);
    } catch {
      exportProductsToCSV(
        exportList,
        `pricetrackerpro_${currentQuery.replace(/\s+/g, '_')}.csv`
      );
    }
  };

  const handleOpenWatchlistModal = (product: Product) => {
    setSelectedWatchlistProduct(product);
    setIsWatchlistModalOpen(true);
  };

  const handleSaveWatchlist = async (product: Product, targetPrice: number) => {
    await addToWatchlistApi({
      product_id: String(product.id),
      title: product.title_fa,
      provider: product.seller,
      current_price: product.price.selling_price,
      target_price: targetPrice,
      product_url: product.url,
      image_url: product.image,
    });
    await loadWatchlist();
  };

  const handleRemoveWatchlist = async (id: number) => {
    await removeFromWatchlistApi(id);
    await loadWatchlist();
  };

  const filteredProducts = products.filter((product) => {
    if (onlyInStock && product.status !== 'marketable') return false;
    if (selectedStore === 'digikala') {
      return product.seller.includes('دیجی‌کالا') || product.seller.toLowerCase().includes('digikala');
    }
    if (selectedStore === 'technolife') {
      return product.seller.includes('تکنولایف') || product.seller.toLowerCase().includes('technolife');
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price.selling_price - b.price.selling_price;
    if (sortBy === 'price_desc') return b.price.selling_price - a.price.selling_price;
    if (sortBy === 'discount') return b.price.discount_percent - a.price.discount_percent;
    if (sortBy === 'rating') return b.rating.rate - a.rating.rate;
    return 0;
  });

  const selectedForCompare = products.filter((p) => selectedProductIds.includes(p.id));

  const handleOpenHistoryModal = async () => {
    setIsHistoryModalOpen(true);
    try {
      const logs = await fetchSearchHistoryApi();
      setHistory(logs);
    } catch {}
  };

  const quickSearchTags = ['لپ تاپ ریزر', 'گوشی سامسونگ', 'آیفون ۱۵', 'ساعت شیائومی', 'هدفون بی سیم'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Vazirmatn',sans-serif]">
      
      <Header
        user={user}
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
        onOpenHistoryModal={handleOpenHistoryModal}
        onOpenWatchlistModal={() => setIsWatchlistManageOpen(true)}
        watchlistCount={watchlistItems.length}
        onLogout={handleLogout}
      />

      <main className="flex-1 pb-16">
        {activeView === 'auth' || !user ? (
          <AuthPage
            onAuthSuccess={handleAuthSuccess}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            
            <div className="bg-slate-900 text-white rounded-2xl p-6 mb-6 shadow-xl shadow-slate-200/50 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-indigo-500/20 border border-indigo-400/30 px-2.5 py-0.5 rounded-full font-bold text-indigo-300">
                    خوش آمدید {user?.name}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  جستجو و استخراج لحظه‌ای قیمت‌ها
                </h1>
              </div>

              <div className="shrink-0 bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl flex items-center gap-4 relative z-10">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">توکن‌های باقی‌مانده</div>
                  <div className="text-2xl font-black text-amber-400">
                    {toPersianDigits(user?.tokens || 0)} <span className="text-xs font-semibold text-white">توکن</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTokenModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1"
                >
                  <Coins className="w-4 h-4" />
                  <span>شارژ توکن</span>
                </button>
              </div>
            </div>

            <SearchBar
              onSearch={(q) => handleSearch(q, 1)}
              isLoading={isLoading}
              tokens={user?.tokens || 0}
              onOpenTokenModal={() => setIsTokenModalOpen(true)}
            />

            {searchError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {products.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          نتایج جستجو برای «{currentQuery}»
                        </span>
                        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-slate-200">
                          {toPersianDigits(sortedProducts.length)} از {toPersianDigits(totalItems || products.length)} کالا
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setLayoutMode('grid')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                          layoutMode === 'grid' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-500'
                        }`}
                        title="نمایش شبکه‌ای"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setLayoutMode('table')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                          layoutMode === 'table' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-500'
                        }`}
                        title="نمایش جدولی"
                      >
                        <TableIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {selectedProductIds.length >= 2 && (
                      <button
                        type="button"
                        onClick={() => setIsCompareModalOpen(true)}
                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Layers className="w-4 h-4" />
                        <span>مقایسه ({toPersianDigits(selectedProductIds.length)})</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-100 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>
                        {selectedProductIds.length > 0
                          ? `خروجی CSV (${toPersianDigits(selectedProductIds.length)} مورد)`
                          : 'خروجی CSV کل کالاها'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-700">فروشگاه:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedStore('all')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          selectedStore === 'all'
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        همه
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedStore('digikala')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          selectedStore === 'digikala'
                            ? 'bg-rose-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        دیجی‌کالا
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedStore('technolife')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          selectedStore === 'technolife'
                            ? 'bg-amber-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        تکنولایف
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setOnlyInStock(!onlyInStock)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                        onlyInStock
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                        onlyInStock ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
                      }`}>
                        {onlyInStock && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                      <span>فقط کالاهای موجود</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <ArrowUpDown className="w-4 h-4 text-slate-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-slate-100 border border-slate-200 text-slate-700 py-1 px-2 rounded-lg font-bold text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="default">مرتب‌سازی پیش‌فرض</option>
                        <option value="price_asc">ارزان‌ترین</option>
                        <option value="price_desc">گران‌ترین</option>
                        <option value="discount">بیشترین تخفیف</option>
                        <option value="rating">بیشترین امتیاز</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {!isLoading && products.length > 0 && (
              <>
                {layoutMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {sortedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isSelected={selectedProductIds.includes(product.id)}
                        onToggleSelect={toggleSelectProduct}
                        onOpenWatchlist={handleOpenWatchlistModal}
                      />
                    ))}
                  </div>
                ) : (
                  <ProductTable
                    products={sortedProducts}
                    selectedIds={selectedProductIds}
                    onToggleSelect={toggleSelectProduct}
                    onSelectAll={selectAllProducts}
                    isAllSelected={selectedProductIds.length === sortedProducts.length}
                    onSort={(key) => {
                      if (key === 'price') setSortBy(sortBy === 'price_asc' ? 'price_desc' : 'price_asc');
                      if (key === 'discount') setSortBy('discount');
                      if (key === 'rating') setSortBy('rating');
                    }}
                  />
                )}

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(pageNum) => handleSearch(currentQuery, pageNum)}
                  isLoading={isLoading}
                />
              </>
            )}

            {!isLoading && products.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">کالا یا عبارت موردنظر را سرچ بزنید</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
                  کافیست نام محصول را وارد کرده و دکمه جستجو را فشار دهید تا لیست قیمت‌ها استخراج شود.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">پیشنهادهای محبوب:</span>
                  {quickSearchTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSearch(tag, 1)}
                      className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        user={user}
        onAddTokens={handleAddTokens}
      />

      <SearchHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onRepeatSearch={(queryText) => {
          setIsHistoryModalOpen(false);
          handleSearch(queryText, 1);
        }}
      />

      <ProductCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={selectedForCompare}
      />

      <WatchlistModal
        isOpen={isWatchlistModalOpen}
        onClose={() => setIsWatchlistModalOpen(false)}
        product={selectedWatchlistProduct}
        onSave={handleSaveWatchlist}
      />

      <WatchlistManageModal
        isOpen={isWatchlistManageOpen}
        onClose={() => setIsWatchlistManageOpen(false)}
        items={watchlistItems}
        onRemove={handleRemoveWatchlist}
      />

    </div>
  );
}
