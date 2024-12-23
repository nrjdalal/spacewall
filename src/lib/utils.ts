import { clsx, type ClassValue } from "clsx"
import { DateArg, formatDistanceToNow } from "date-fns"
import { customAlphabet } from "nanoid"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function createChecksum(data: Blob | File) {
  const arrayBuffer = await data.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashBase64 = btoa(String.fromCharCode(...hashArray))
  return hashBase64
}

export function humanBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  let index = 0
  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024
    index++
  }
  return `${bytes.toFixed(2)} ${units[index]}`
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
