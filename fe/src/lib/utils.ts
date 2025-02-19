import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime(); // Difference in milliseconds
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHours = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffDays / 365);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, "seconds");
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minutes");
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hours");
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "days");
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "months");
  return rtf.format(diffYears, "years");
}
