import React from 'react';
import { Product } from '../types';
import { formatPrice, toPersianDigits } from '../utils/farsi';
import { X, ExternalLink, Star, CheckCircle2, XCircle } from 'lucide-react';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 text-base">جدول مقایسه محصولات دیجی‌کالا</h3>
            <p className="text-xs text-slate-500">مقایسه قیمت، میزان تخفیف و فروشنده {toPersianDigits(products.length)} کالا</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid Table */}
        <div className="p-6 overflow-x-auto overflow-y-auto">
          {products.length === 0 ? (
            <p className="text-center py-8 text-sm text-slate-500">محصولی برای مقایسه انتخاب نشده است.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-w-[600px]">
              {products.map((p) => (
                <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <img
                      src={p.image}
                      alt={p.title_fa}
                      className="w-24 h-24 object-contain mx-auto bg-white p-2 rounded-xl border border-slate-200"
                    />
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 h-10">{p.title_fa}</h4>
                    
                    <div className="space-y-2 text-xs pt-2 border-t border-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-500">قیمت نهایی:</span>
                        <span className="font-extrabold text-slate-900">{formatPrice(p.price.selling_price)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">قیمت اصلی:</span>
                        <span className="line-through text-slate-400">{formatPrice(p.price.rrp_price)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">درصد تخفیف:</span>
                        <span className="font-bold text-rose-600">{toPersianDigits(p.price.discount_percent)}٪</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">امتیاز کاربران:</span>
                        <span className="font-bold text-amber-700 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {toPersianDigits(p.rating.rate.toFixed(1))}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">فروشنده:</span>
                        <span className="font-semibold text-slate-800">{p.seller}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">وضعیت:</span>
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>موجود</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <span>خرید در دیجی‌کالا</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
