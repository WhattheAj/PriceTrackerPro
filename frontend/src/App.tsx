import React, { useState, useEffect } from 'react';
import { User, Product, ViewMode, DisplayLayout, SearchHistoryItem } from './types';
import { getSavedUser, logoutUser, fetchUserProfileApi } from './services/auth';
import { searchDigikalaProductsApi } from './services/digikala';
import { exportProductsToCSV } from './utils/csvExporter';
import { toPersianDigits, formatPrice } from './utils/farsi';

// Components
import { Header } from './components/Header';
import { AuthPage } from './components/AuthPage';
import { SearchBar } from './components/SearchBar';
import { ProductCard } from './components/ProductCard';
import { ProductTable } from './components/ProductTable';
import { TokenModal } from './components/TokenModal';
import { SearchHistoryModal } from './components/SearchHistoryModal';
import { ProductCompareModal } from './components/ProductCompareModal';

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
  Filter
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>('auth'); // Default to Auth view
  const [layoutMode, setLayoutMode] = useState<DisplayLayout>('grid');

  // Search & Products
  const [currentQuery, setCurrentQuery] = useState('لپ تاپ ریزر');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Selection & Filters
  const [selectedProductIds, setSelectedProductIds] = useState<Array<string | number>>([]);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'discount' | 'rating'>('default');

  // Modals
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Initialize User Profile on Mount from Django API
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

  // Handle Auth Login / Signup success
  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setActiveView('auth');
    setProducts([]);
  };

  // Execute Digikala Search via Django API
  const handleSearch = async (queryText: string, activeUser = user) => {
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
      // Fetch products and updated remaining tokens directly from Django Backend
      const { products: fetchedProducts, remainingTokens } = await searchDigikalaProductsApi(queryText);

      // Update local user tokens balance from Django response
      setUser((prev) => (prev ? { ...prev, tokens: remainingTokens } : null));

      setProducts(fetchedProducts);
      setSelectedProductIds([]);
    } catch (err: any) {
      console.error('Search error:', err);
      const msg = err.response?.data?.error || err.response?.data?.detail || 'خطا در دریافت اطلاعات از سرور. لطفاً مجدداً تلاش کنید.';
      setSearchError(msg);
    } finally {
      setIsLoading(false);
    }
  };


  // Add Tokens to User Balance
  const handleAddTokens = (amount: number) => {
    const updated = addTokensToUser(amount);
    if (updated) {
      setUser(updated);
    }
  };

  // Toggle selection for batch export or comparison
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

  // CSV Export trigger
  const handleExportCSV = () => {
    const exportList =
      selectedProductIds.length > 0
        ? products.filter((p) => selectedProductIds.includes(p.id))
        : products;

    exportProductsToCSV(
      exportList,
      `pricetrackerpro_${currentQuery.replace(/\s+/g, '_')}.csv`
    );
  };

  // Sorting products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price.selling_price - b.price.selling_price;
    if (sortBy === 'price_desc') return b.price.selling_price - a.price.selling_price;
    if (sortBy === 'discount') return b.price.discount_percent - a.price.discount_percent;
    if (sortBy === 'rating') return b.rating.rate - a.rating.rate;
    return 0; // default
  });

  const selectedForCompare = products.filter((p) => selectedProductIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Vazirmatn',sans-serif]">
      
      {/* Header Bar */}
      <Header
        user={user}
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeView === 'auth' ? (
          <AuthPage
            onAuthSuccess={handleAuthSuccess}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            
            {/* Top User Balance Summary Banner */}
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
                <p className="text-xs text-slate-400">
                  اطلاعات محصول نظیر قیمت، تخفیف، فروشنده و امتیاز را جستجو کرده و فایل CSV دانلود کنید.
                </p>
              </div>

              {/* Token Counter Widget */}
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

            {/* Search Bar Component */}
            <SearchBar
              onSearch={(q) => handleSearch(q)}
              isLoading={isLoading}
              tokens={user?.tokens || 0}
              onOpenTokenModal={() => setIsTokenModalOpen(true)}
            />

            {/* Error Alert */}
            {searchError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {/* Results Header & Tools Bar */}
            {products.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Results Count & Query Info */}
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
                        {toPersianDigits(products.length)} کالا
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      برگرفته مستقیم از API دیجی‌کالا | آماده خروجی اکسل
                    </p>
                  </div>
                </div>

                {/* Filters, View Toggle & CSV Action */}
                <div className="flex items-center gap-2 flex-wrap">
                  

                  {/* Grid/Table Layout Switcher */}
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setLayoutMode('grid')}
                      className={`p-1.5 rounded-lg transition-all ${
                        layoutMode === 'grid' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-500'
                      }`}
                      title="نمایش شبکه‌ای (کارت)"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutMode('table')}
                      className={`p-1.5 rounded-lg transition-all ${
                        layoutMode === 'table' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-500'
                      }`}
                      title="نمایش جدولی (فشرده)"
                    >
                      <TableIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Compare Button (if items selected) */}
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

                  {/* Export CSV Button */}
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
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">در حال دریافت قیمت‌ها از دیجی‌کالا...</h3>
                  <p className="text-xs text-slate-500">لطفاً چند لحظه شکیبا باشید. ۱ توکن از اعتبار شما کسر شد.</p>
                </div>
              </div>
            )}

            {/* Results Grid / Table Layout */}
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
              </>
            )}

            {/* Empty Search State */}
            {!isLoading && products.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">کالا یا عبارت موردنظر را سرچ بزنید</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
                  کافیست نام محصول (مانند «لپ تاپ ریزر»، «گوشی سامسونگ»، «آیفون ۱۵») را وارد کرده و دکمه جستجو را فشار دهید تا لیست قیمت‌ها استخراج شود.
                </p>
                <button
                  type="button"
                  onClick={() => handleSearch('لپ تاپ ریزر')}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-100"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>جستجوی نمونه «لپ تاپ ریزر»</span>
                </button>
              </div>
            )}

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <span>PriceTrackerPro</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
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
        onRepeatSearch={(q) => handleSearch(q)}
      />

      <ProductCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={selectedForCompare}
      />

    </div>
  );
}
