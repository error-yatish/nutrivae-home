export const FEATURES = {
    enableCartAndAuth: true, // Set to false to disable cart/auth and fallback to WhatsApp checkout
    enableFarmOrigins: true
};

// central dynamic environment configuration
export const STRAPI_URL =
  (typeof window !== 'undefined' && (window as any).STRAPI_URL) ||
  (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.STRAPI_URL) ||
  import.meta.env.STRAPI_URL ||
  'http://127.0.0.1:1337';

export const STRAPI_TOKEN =
  (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.STRAPI_TOKEN) ||
  import.meta.env.STRAPI_TOKEN ||
  '';
