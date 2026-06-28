import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const USD_TO_INR = 83;

export function formatPrice(price: number): string {
  const inr = Math.round(price * USD_TO_INR);
  return `₹${inr.toLocaleString("en-IN")}`;
}

export function formatOriginalPrice(price: number): string {
  return formatPrice(price);
}
