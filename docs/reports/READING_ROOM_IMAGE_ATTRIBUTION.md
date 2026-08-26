---
visibility: public
---

# Reading Room Image Attribution

The Coffee and Books reading-room theme uses two local WebP derivatives.

## Bright sunlit garden wallpaper

- Photograph: “Sunlight filters through lush green trees in a park.”
- Photographer: [Ran Ding](https://unsplash.com/@dingran)
- Source: https://unsplash.com/photos/sunlight-filters-through-lush-green-trees-in-a-park-UIqDr16kZzY
- License: [Unsplash License](https://unsplash.com/license)
- Local derivative: `assets/reading-room/garden-sunlight.webp`
- Processing: resized to 1800×1200 WebP; natural source color retained; no brightness, saturation, contrast, fade, or color-wash filter; EXIF removed
- Content boundary: outdoor trees, foliage, grass, and natural daylight only; no café ceiling, roller shade, furniture, building, or person

## Retouched Coffee and Books header

- Source: **User-supplied approved header** provided for this Library design
- Local derivative: `assets/reading-room/retouched-coffee-header.webp`
- Dimensions: 1044×237, lossless RGB WebP
- Processing: the approved native-resolution header was cropped without upscaling; baked logo/title/subtitle pixels on the left were removed with deterministic two-scale OpenCV inpainting, while the cup, latte art, handle, table, garden, and lighting on the right were preserved unchanged
- Metadata: EXIF removed
- Rendering: the public page overlays its logo and title as semantic HTML; the WebP contains no navigation, logo, title, subtitle, search controls, or book metadata
