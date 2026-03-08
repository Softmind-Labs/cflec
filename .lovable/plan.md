

# Fix Portal Card Images — Show Faces

## Problem
The `h-64` fixed height on the image containers crops the subjects' faces. The `object-cover` is defaulting to center, which may not include the faces depending on the image composition.

## Change — `src/pages/Index.tsx`

On both portal card images (lines 216 and 237), add `object-top` to shift the focal point to the top of the image where faces typically are, and increase the image container height from `h-64` to `h-72` for more breathing room:

- Line 215: `h-64` → `h-72`
- Line 216: add `object-top` to the img class
- Line 236: `h-64` → `h-72`  
- Line 237: add `object-top` to the img class

