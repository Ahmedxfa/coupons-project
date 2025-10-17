import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDiscount(
  type: string,
  percentage?: number | null,
  amount?: string | number | null
): string {
  if (type === 'PERCENTAGE' && percentage) {
    return `${percentage}% OFF`;
  }
  if (type === 'FIXED_AMOUNT' && amount) {
    return `${amount} OFF`;
  }
  if (type === 'FREE_SHIPPING') {
    return 'FREE SHIPPING';
  }
  if (type === 'BOGO') {
    return 'BOGO';
  }
  return 'DEAL';
}

export function getDaysUntilExpiration(expirationDate: Date | null): number | null {
  if (!expirationDate) return null;
  const now = new Date();
  const diff = expirationDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}