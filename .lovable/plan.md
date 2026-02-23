

# Update White Certificate Color to #B8BEC7

Four targeted edits across 2 files.

## 1. `src/lib/cert-colors.ts` — line 3
Change `accent: '#FFFFFF'` → `accent: '#B8BEC7'`, update `bg` to `#f4f5f6` and `border` to `#d1d5db` for better visual harmony with the cooler gray accent.

## 2. `src/index.css` — line 47
Change `--cflp-white: 0 0% 95%` → `--cflp-white: 216 10% 75%` (HSL of #B8BEC7).

## 3. `src/index.css` — line 112
Same change in dark mode: `--cflp-white: 0 0% 95%` → `--cflp-white: 216 10% 75%`.

## 4. `src/index.css` — line 224
Change `.certificate-white` background-color from `#FFFFFF` to `#B8BEC7`.

All pages importing `CERT_COLORS` (Dashboard, Modules, Certificates, ModulePlayer) pick up the new accent automatically — no other files need changes.

