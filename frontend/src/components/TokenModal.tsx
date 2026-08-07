import React, { useState } from 'react';
import { User } from '../types';
import { toPersianDigits } from '../utils/farsi';
import { Coins, X, Check, Zap, Sparkles } from 'lucide-react';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAddTokens: (amount: number) => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  user,
  onAddTokens,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<number>(50);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCharge = (amount: number) => {
    onAddTokens(amount);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-200">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">شارژ اعتبار و توکن جستجو</h3>
              <p className="text-xs text-slate-500">افزایش موجودی کیف پول پرایس تراکر</p>
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
        <div className="p-6">
          
          {/* Current Balance */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-800 font-semibold block">موجودی فعلی شما:</span>
              <span className="text-xl font-extrabold text-amber-950">
                {toPersianDigits(user?.tokens || 0)} <span className="text-sm font-normal">توکن</span>
              </span>
            </div>
            <Zap className="w-8 h-8 text-amber-500 opacity-80" />
          </div>

          {isSuccess ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">اعتبار با موفقیت شارژ شد!</h4>
              <p className="text-xs text-slate-500">توکن‌های جدید به کیف پول شما اضافه گردید.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">انتخاب بسته توکن:</span>

              {/* Package 1: 10 Tokens Free Recharge */}
              <div
                onClick={() => setSelectedPackage(10)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedPackage === 10
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-indigo-600 font-bold flex items-center justify-center text-xs">
                    +۱۰
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">بسته آزمایشی (۱۰ توکن)</div>
                    <div className="text-[11px] text-slate-500">مناسب ۱۰ بار جستجوی دیجی‌کالا</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  رایگان
                </span>
              </div>

              {/* Package 2: 50 Tokens */}
              <div
                onClick={() => setSelectedPackage(50)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between relative ${
                  selectedPackage === 50
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="absolute -top-2.5 left-4 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                  پیشنهاد ویژه
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
                    +۵۰
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">بسته حرفه‌ای (۵۰ توکن)</div>
                    <div className="text-[11px] text-slate-500">مناسب ردیابی قیمت‌ها و استخراج CSV</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {toPersianDigits('25,000')} تومان
                </span>
              </div>

              {/* Package 3: 100 Tokens */}
              <div
                onClick={() => setSelectedPackage(100)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedPackage === 100
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    +۱۰۰
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">بسته نامحدود (۱۰۰ توکن)</div>
                    <div className="text-[11px] text-slate-500">برای استخراج‌های سنگین گروهی</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {toPersianDigits('45,000')} تومان
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCharge(selectedPackage)}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>افزایش {toPersianDigits(selectedPackage)} توکن به حساب</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
