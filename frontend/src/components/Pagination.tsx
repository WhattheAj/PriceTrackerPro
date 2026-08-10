import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { toPersianDigits } from '../utils/farsi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== '...' &&
        (i < currentPage - delta || i > currentPage + delta)
      ) {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-10 mb-6 flex-wrap">
      <button
        type="button"
        disabled={currentPage <= 1 || isLoading}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
        <span>قبلی</span>
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((item, index) => {
          if (item === '...') {
            return (
              <span key={`dots-${index}`} className="px-2 py-1 text-slate-400 text-xs font-bold">
                ...
              </span>
            );
          }

          const pageNum = item as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              disabled={isLoading}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-200'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              {toPersianDigits(pageNum)}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={currentPage >= totalPages || isLoading}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
      >
        <span>بعدی</span>
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
};
