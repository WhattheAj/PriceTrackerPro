import React from 'react';
import { WatchlistItem } from '../types';
import { formatPrice, toPersianDigits } from '../utils/farsi';
import { Bookmark, X, Trash2, ExternalLink, BellRing, CheckCircle2 } from 'lucide-react';

interface WatchlistManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WatchlistItem[];
  onRemove: (id: number) => Promise<void>;
}

export const WatchlistManageModal: React.FC<WatchlistManageModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">لیست هشدارهای افت قیمت</h3>
              <p className="text-xs text-slate-500">
                {toPersianDigits(items.length)} کالا در لیست هشدارهای فعال شما
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                <Bookmark className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">هنوز کالایی را نشان نکرده‌اید</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                می‌توانید روی آیکون نشان‌کردن در کارت محصولات کلیک کنید تا قیمت هدف آن ثبت شود.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const isTargetReached = item.current_price > 0 && item.current_price <= item.target_price;
              const diffPercent = item.current_price > 0 
                ? Math.round(((item.current_price - item.target_price) / item.current_price) * 100)
                : 0;

              return (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-12 h-12 object-contain shrink-0 bg-white rounded-lg p-1 border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 shrink-0 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <Bookmark className="w-5 h-5" />
                      </div>
                    )}
                    <div className="space-y-1 overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 truncate max-w-md" title={item.title}>
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-700">
                          {item.provider}
                        </span>
                        <span>فعلی: <strong className="text-slate-800">{formatPrice(item.current_price)}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-medium block">قیمت هدف:</span>
                      <span className="text-xs font-extrabold text-indigo-600 block">
                        {formatPrice(item.target_price)}
                      </span>
                      {isTargetReached ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>قیمت رسید!</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 block">
                          {toPersianDigits(diffPercent)}٪ بالاتر از هدف
                        </span>
                      )}
                    </div>

                    <a
                      href={item.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      title="مشاهده محصول"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="حذف از هشدارهای من"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
