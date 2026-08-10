import React, { useState } from 'react';
import { Search, X, Coins } from 'lucide-react';
import { toPersianDigits } from '../utils/farsi';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  tokens: number;
  onOpenTokenModal: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  tokens,
  onOpenTokenModal,
}) => {
  const [query, setQuery] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (tokens <= 0) {
      onOpenTokenModal();
      return;
    }
    onSearch(query.trim());
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-200/50 p-4 sm:p-6 mb-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <h2 className="text-base font-bold text-slate-800">جستجوی هوشمند در محصولات</h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">هزینه هر جستجو:</span>
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-md border border-amber-200">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>{toPersianDigits(1)} توکن</span>
          </span>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="relative flex flex-col sm:flex-row items-center gap-2">
        <div className="relative w-full">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-indigo-500" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="کالای مورد نظر خود را جستجو کنید..."
            className="w-full pr-11 pl-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-inner"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {tokens > 0 ? (
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>در حال جستجو...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>جستجو و دریافت قیمت</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenTokenModal}
            className="w-full sm:w-auto shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-amber-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Coins className="w-4 h-4" />
            <span>شارژ توکن جهت جستجو</span>
          </button>
        )}
      </form>

    </div>
  );
};
