import React from 'react';
import { SearchHistoryItem } from '../types';
import { formatPersianDate, toPersianDigits } from '../utils/farsi';
import { History, X, Search, Coins } from 'lucide-react';

interface SearchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onRepeatSearch: (query: string) => void;
}

export const SearchHistoryModal: React.FC<SearchHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onRepeatSearch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">تاریخچه جستجوهای شما</h3>
              <p className="text-xs text-slate-500">لیست کلمات جستجو شده و مصرف توکن</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Search className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="text-sm font-bold">هنوز جستجویی ثبت نشده است.</p>
              <p className="text-xs text-slate-400">کالا یا برند موردنظر خود را در کادر اصلی جستجو وارد نمایید.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-indigo-50/50 hover:border-indigo-200 transition-all group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{item.query}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        {toPersianDigits(item.resultCount)} محصول
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatPersianDate(item.timestamp)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded-md">
                      <Coins className="w-3 h-3 text-amber-600" />
                      <span>{toPersianDigits(item.tokensUsed)} توکن</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        onRepeatSearch(item.query);
                        onClose();
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      جستجوی مجدد
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
