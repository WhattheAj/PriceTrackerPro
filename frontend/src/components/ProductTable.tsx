import React from 'react';
import { Product } from '../types';
import { formatPrice, toPersianDigits } from '../utils/farsi';
import { Star, ExternalLink, ArrowUpDown, Check } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  selectedIds: Array<string | number>;
  onToggleSelect: (id: string | number) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  onSort: (key: 'price' | 'discount' | 'rating') => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  isAllSelected,
  onSort,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th className="p-3 sm:p-4 text-center w-12">
                <button
                  type="button"
                  onClick={onSelectAll}
                  className={`w-4 h-4 mx-auto rounded flex items-center justify-center border transition-all cursor-pointer ${
                    isAllSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                  }`}
                  title="انتخاب همه"
                >
                  {isAllSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </button>
              </th>
              <th className="p-3 sm:p-4 min-w-[200px]">عنوان محصول</th>
              <th className="p-3 sm:p-4">
                <button
                  onClick={() => onSort('price')}
                  className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
                >
                  <span>قیمت فروش (تومان)</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </th>
              <th className="p-3 sm:p-4">
                <button
                  onClick={() => onSort('discount')}
                  className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
                >
                  <span>تخفیف</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </th>
              <th className="p-3 sm:p-4">فروشنده</th>
              <th className="p-3 sm:p-4">
                <button
                  onClick={() => onSort('rating')}
                  className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
                >
                  <span>امتیاز</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </th>
              <th className="p-3 sm:p-4 text-center">لینک</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium">
            {products.map((p) => {
              const isSelected = selectedIds.includes(p.id);
              return (
                <tr 
                  key={p.id}
                  className={`hover:bg-indigo-50/40 transition-colors ${
                    isSelected ? 'bg-indigo-50/70' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="p-3 sm:p-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleSelect(p.id)}
                      className={`w-4 h-4 mx-auto rounded flex items-center justify-center border transition-all cursor-pointer ${
                        isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </button>
                  </td>

                  {/* Image & Title */}
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.title_fa}
                        className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{p.title_fa}</div>
                        {p.title_en && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 font-sans">{p.title_en}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="p-3 sm:p-4 font-extrabold text-slate-900 whitespace-nowrap">
                    {formatPrice(p.price.selling_price)}
                  </td>

                  {/* Discount */}
                  <td className="p-3 sm:p-4 whitespace-nowrap">
                    {p.price.discount_percent > 0 ? (
                      <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold text-xs">
                        {toPersianDigits(p.price.discount_percent)}٪
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>

                  {/* Seller */}
                  <td className="p-3 sm:p-4 text-slate-600 text-xs whitespace-nowrap">
                    {p.seller}
                  </td>

                  {/* Rating */}
                  <td className="p-3 sm:p-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-bold text-amber-700 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{toPersianDigits(p.rating.rate.toFixed(1))}</span>
                    </div>
                  </td>

                  {/* Link */}
                  <td className="p-3 sm:p-4 text-center whitespace-nowrap">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-lg transition-all"
                      title="مشاهده در دیجی‌کالا"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
