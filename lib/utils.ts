import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as United Arab Emirates Dirham (AED)
 */
export function formatAED(value: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a number as US Dollars (USD)
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Creates a URL-friendly slug from text
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartment: 'Apartment',
    villa: 'Villa',
    penthouse: 'Penthouse',
    townhouse: 'Townhouse',
    mansion: 'Mansion',
    duplex: 'Duplex',
    commercial: 'Commercial',
    retail: 'Retail',
    office: 'Office',
  };
  return labels[type] || type;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    buy: 'For Sale',
    rent: 'For Rent',
    'off-plan': 'Off Plan',
    sold: 'Sold',
    rented: 'Rented',
  };
  return labels[status] || status;
}

export function getCompletionLabel(status: string): string {
  const labels: Record<string, string> = {
    ready: 'Ready to Move',
    'off-plan': 'Off Plan',
    'under-construction': 'Under Construction',
  };
  return labels[status] || status;
}
