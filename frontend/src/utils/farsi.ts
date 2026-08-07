/**
 * Converts English numbers/digits to Farsi/Persian digits
 */
export function toPersianDigits(n: number | string): string {
  if (n === null || n === undefined) return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n
    .toString()
    .replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

/**
 * Formats currency in Toman with proper thousands separators
 */
export function formatPrice(priceInToman: number, includeCurrency = true): string {
  if (!priceInToman || priceInToman <= 0) {
    return 'ناموجود';
  }
  
  const formatted = priceInToman.toLocaleString('fa-IR');
  return includeCurrency ? `${formatted} تومان` : formatted;
}

/**
 * Formats date string to Persian Jalali string representation
 */
export function formatPersianDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return dateString;
  }
}
