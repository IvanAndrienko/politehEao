const DEFAULT_API_BASE_URL = 'http://localhost:5000';

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL
);

const shouldPrefixSlash = (path: string) => path.startsWith('/');

export const apiUrl = (path: string) => {
  const normalizedPath = shouldPrefixSlash(path) ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const assetUrl = (source?: string | null) => {
  if (!source) {
    return '';
  }

  if (/^https?:\/\//i.test(source)) {
    return source;
  }

  return apiUrl(source);
};
