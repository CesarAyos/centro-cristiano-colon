const PROD_URL = import.meta.env.VITE_PUBLIC_SITE_URL || 'https://centro-cristiano-colon.vercel.app';

export function getSiteUrl() {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.location.origin;
  }
  return PROD_URL;
}
