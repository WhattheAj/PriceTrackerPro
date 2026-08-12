import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { formatPrice, toPersianDigits } from '../utils/farsi';
import { BellRing, X, Check, Bell } from 'lucide-react';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Product, targetPrice: number) => Promise<void>;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      const defaultTarget = Math.round(product.price.selling_price * 0.9);
      setTargetPrice(defaultTarget);
      setErrorMsg(null);
      setIsSuccess(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleQuickDiscount = (percent: number) => {
    const calculated = Math.round(product.price.selling_price * (1 - percent / 100));
    setTargetPrice(calculated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice <= 0) {
      setErrorMsg('لطفاً قیمت هدف معتبر وارد کنید.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onSave(product, targetPrice);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    } catch {
      setErrorMsg('خطا در ثبت هشدار. لطفاً مجدداً تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden relative">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-200">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">تنظیم هشدار افت قیمت</h3>
              <p className="text-xs text-slate-500">اعلام خودکار هنگام ارزان شدن کالا</p>
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

        <div className="p-6">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-5">
            <img
              src={product.image}
              alt={product.title_fa}
              className="w-14 h-14 object-contain shrink-0 bg-white rounded-lg p-1 border border-slate-100"
            />
            <div className="space-y-1 overflow-hidden">
              <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-relaxed">
                {product.title_fa}
              </h4>
              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>قیمت فعلی:</span>
                <span className="font-bold text-slate-800">{formatPrice(product.price.selling_price)}</span>
              </div>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">هشدار افت قیمت ثبت شد!</h4>
              <p className="text-xs text-slate-500">به محض رسیدن قیمت به عدد تعیین‌شده به شما اطلاع می‌دهیم.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  قیمت هدف شما (تومان):
                </label>
                <input
                  type="number"
                  value={targetPrice || ''}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  placeholder="مثال: ۴۵۰۰۰۰۰۰"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dir-ltr text-right"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  پیشنهادهای سریع:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDiscount(5)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    ۵٪ ارزان‌تر
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDiscount(10)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    ۱۰٪ ارزان‌تر
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDiscount(20)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    ۲۰٪ ارزان‌تر
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Bell className="w-4 h-4" />
                <span>{isSubmitting ? 'در حال ثبت...' : 'ثبت در لیست هشدارهای من'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
