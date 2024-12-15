import { clsx, type ClassValue } from "clsx"
import { DateArg, formatDistanceToNow } from "date-fns"
import { customAlphabet } from "nanoid"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function humanNumbers(number: number | string): string {
  if (typeof number === "string") number = parseInt(number)
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function humanTime(date: DateArg<Date> & {}) {
  if (!date) date = new Date()
  return formatDistanceToNow(date, { addSuffix: true })
}

export function generateId({
  chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  length = 12,
  type = "id",
}: {
  length?: number
  chars?: string
  type?: "id" | "otp"
} = {}) {
  chars = type === "id" ? chars : "0123456789"
  length = type === "id" ? length : 6
  const nanoid = customAlphabet(chars, length)
  return nanoid()
}

export function redirect(url: string, base: URL) {
  return Response.redirect(new URL(url, base))
}
