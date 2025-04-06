import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Validate and format URL
export function validateUrl(url: string | undefined): string {
  if (!url) {
    throw new Error('URL is undefined or empty');
  }
  
  // Check if URL has a protocol, add https:// if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  
  try {
    // Test if URL is valid by constructing a URL object
    new URL(url);
    return url;
  } catch (error) {
    console.error('Invalid URL format:', url, error);
    throw new Error(`Invalid URL format: ${url}`);
  }
}
