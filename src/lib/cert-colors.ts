export const CERT_COLORS = {
  green:  { accent: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  white:  { accent: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  gold:   { accent: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  blue:   { accent: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
} as const;

export type CertColorLevel = keyof typeof CERT_COLORS;
