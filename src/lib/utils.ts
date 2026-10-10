import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function statusTone(status: string) {
  switch (status) {
    case "Available":
      return "available" as const;
    case "Reserved":
      return "reserved" as const;
    default:
      return "collection" as const;
  }
}

export function pad(n: number, size = 2) {
  return String(n).padStart(size, "0");
}
