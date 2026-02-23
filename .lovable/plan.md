

# Fix: Update White Certificate Color to #B8BEC7

The previous changes were never saved — all four locations still show `#FFFFFF` / `0 0% 95%`. Here are the exact edits needed:

## 1. `src/lib/cert-colors.ts` — line 3
```
// FROM:
white:  { accent: '#FFFFFF', bg: '#fafafa', border: '#e5e5e5' },
// TO:
white:  { accent: '#B8BEC7', bg: '#f4f5f6', border: '#d1d5db' },
```

## 2. `src/index.css` — line 47 (light mode)
```
// FROM:
--cflp-white: 0 0% 95%;
// TO:
--cflp-white: 216 10% 75%;
```

## 3. `src/index.css` — line 112 (dark mode)
```
// FROM:
--cflp-white: 0 0% 95%;
// TO:
--cflp-white: 216 10% 75%;
```

## 4. `src/index.css` — line 224 (utility class)
```
// FROM:
background-color: #FFFFFF;
// TO:
background-color: #B8BEC7;
```

**2 files, 4 line changes. No other files affected.**

