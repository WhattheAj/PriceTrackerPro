import React, { useState } from 'react';
import { Product } from '../types';
import { formatPrice, toPersianDigits } from '../utils/farsi';
import { Star, ExternalLink, Store, Check, Percent, Copy, CheckCheck, BellRing } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (id: string | number) => void;
  onOpenWatchlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onToggleSelect,
  onOpenWatchlist,
}) => {
  const [copied, setCopied] = useState(false);
  const hasDiscount = product.price.discount_percent > 0;

  const isTechnolife = product.seller.includes('تکنولایف') || product.seller.toLowerCase().includes('technolife');

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.url) {
      navigator.clipboard.writeText(product.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div 
      className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg flex flex-col justify-between overflow-hidden relative ${
        isSelected 
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md' 
          : 'border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div>
        <div className="p-3 pb-0 flex items-center justify-between gap-2 relative z-10">
          <button
            type="button"
            onClick={() => onToggleSelect(product.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
              isSelected ? 'border-white bg-indigo-600' : 'border-slate-400 bg-white'
            }`}>
              {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
            </div>
            <span>{isSelected ? 'انتخاب شده' : 'انتخاب'}</span>
          </button>

          {hasDiscount && (
            <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-2xs">
              <Percent className="w-3 h-3" />
              <span>{toPersianDigits(product.price.discount_percent)}٪</span>
            </span>
          )}
        </div>

        <div className="px-4 py-3 flex items-center justify-center h-48 bg-white relative">
          <img
            src={product.image}
            alt={product.title_fa}
            className="max-h-40 max-w-full object-contain hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80';
            }}
          />
        </div>

        <div className="p-4 pt-1 border-t border-slate-100">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-relaxed min-h-[40px]" title={product.title_fa}>
            {product.title_fa}
          </h3>

          <div className="flex items-center justify-between gap-2 mt-2.5 text-[11px] text-slate-500">
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${
              isTechnolife 
                ? 'bg-amber-50 text-amber-900 border-amber-200' 
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              <Store className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{product.seller}</span>
            </span>

            <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-md font-bold">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{toPersianDigits(product.rating.rate.toFixed(1))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          {hasDiscount && (
            <span className="text-[11px] text-slate-400 line-through font-medium">
              {formatPrice(product.price.rrp_price, false)}
            </span>
          )}
          <span className="text-sm sm:text-base font-extrabold text-slate-900">
            {formatPrice(product.price.selling_price)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onOpenWatchlist && (
            <button
              type="button"
              onClick={() => onOpenWatchlist(product)}
              className="p-2 bg-white hover:bg-amber-50 text-amber-600 border border-slate-200 hover:border-amber-300 rounded-xl transition-all shadow-2xs cursor-pointer"
              title="تنظیم هشدار افت قیمت"
            >
              <BellRing className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="p-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition-all shadow-2xs cursor-pointer"
            title={copied ? 'کپی شد!' : 'کپی لینک محصول'}
          >
            {copied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border border-slate-200 rounded-xl transition-all shadow-2xs group flex items-center justify-center"
            title="مشاهده مستقیم در فروشگاه"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

    </div>
  );
};
