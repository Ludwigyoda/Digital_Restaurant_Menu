---
name: feedback-menu-card-style
description: For the tablet menu (ItemCard.tsx), keep the full-bleed image with bottom gradient overlay — don't split into "square image on top + solid info band below".
metadata:
  type: feedback
---

For [src/components/menu/ItemCard.tsx](src/components/menu/ItemCard.tsx), keep the current visual treatment: image fills the entire card via `object-cover`, with a bottom-anchored dark gradient overlay carrying name/zh/price/allergens, and the accent-ringed Plus button top-right.

**Why:** When asked to "make images square / less rectangle" for tablets, I proposed splitting the card into `aspect-square` image + solid info band below. User shipped it visually, said "c'est devenu laid reviens en arrière" and reverted. The split approach breaks because the grid produces cells of variable aspect (1, 2, 5-item layouts have wide cells; hero is 2×2): a forced square image leaves large blank info-band areas or pushes text into too little room. The overlay-on-image style is what makes the menu feel cohesive across all grid configurations.

**How to apply:** If the user asks again to change image format, aspect ratio, or "make it more square", do NOT touch the card layout (don't move text out of the overlay, don't add aspect-ratio constraints on the image container). Either propose changing the GRID cell shapes (so cards become square-ish naturally and the existing overlay structure still works), or push back and ask for a more specific complaint — what looks bad? Cropping? Hero too dominant? Photo content? The answer is almost never "split the card".
