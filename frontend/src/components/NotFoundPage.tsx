import React from 'react';
import { FileQuestion, Home } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-md shadow-indigo-100 animate-bounce">
        <FileQuestion className="w-10 h-10 stroke-[1.5]" />
      </div>

      <h1 className="text-4xl font-black text-slate-900 mb-2">۴۰۴</h1>
      <h2 className="text-lg font-bold text-slate-800 mb-2">صفحه مورد نظر پیدا نشد!</h2>
      <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-6">
        آدرسی که وارد کرده‌اید وجود ندارد یا منتقل شده است. می‌توانید به صفحه اصلی بازگردید.
      </p>

      <button
        type="button"
        onClick={onGoHome}
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-200 cursor-pointer"
      >
        <Home className="w-4 h-4" />
        <span>بازگشت به داشبورد اصلی</span>
      </button>
    </div>
  );
};
