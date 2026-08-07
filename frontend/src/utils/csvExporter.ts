import { Product } from '../types';
import { formatPrice } from './farsi';

export function exportProductsToCSV(products: Product[], filenameStr?: string): void {
  if (!products || products.length === 0) {
    alert('محصولی برای دریافت خروجی CSV انتخاب نشده است.');
    return;
  }

  // Headers in Farsi
  const headers = [
    'شناسه محصول',
    'عنوان فارسی محصول',
    'عنوان انگلیسی',
    'قیمت فروش (تومان)',
    'قیمت اصلی (تومان)',
    'درصد تخفیف',
    'امتیاز کاربران',
    'تعداد نظرات',
    'فروشنده',
    'برند',
    'دسته‌بندی',
    'وضعیت موجودی',
    'لینک مستقیم دیجی‌کالا'
  ];

  // Map rows
  const rows = products.map((p) => [
    p.id,
    `"${(p.title_fa || '').replace(/"/g, '""')}"`,
    `"${(p.title_en || '').replace(/"/g, '""')}"`,
    p.price.selling_price > 0 ? p.price.selling_price : '0',
    p.price.rrp_price > 0 ? p.price.rrp_price : '0',
    `${p.price.discount_percent || 0}%`,
    p.rating.rate ? p.rating.rate.toFixed(1) : '0',
    p.rating.count || 0,
    `"${(p.seller || 'دیجی‌کالا').replace(/"/g, '""')}"`,
    `"${(p.brand || 'متفرقه').replace(/"/g, '""')}"`,
    `"${(p.category || 'عمومی').replace(/"/g, '""')}"`,
    p.status === 'marketable' ? 'موجود' : 'ناموجود',
    `"${p.url || ''}"`
  ]);

  // UTF-8 BOM byte sequence (\uFEFF) ensures Excel renders Persian letters correctly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().slice(0, 10);
  const defaultFilename = filenameStr || `digikala_prices_${timestamp}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', defaultFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
