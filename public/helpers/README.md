# Helper Icons

Place your custom helper icon images in this directory.

## File Naming Convention

Each helper should have a corresponding PNG image file named after its ID:

- `marketing.png` - Marketing Pro helper
- `sales.png` - Sales Expert helper
- `finance.png` - Finance Guru helper
- `operations.png` - Ops Manager helper
- `customer.png` - Support Hero helper
- `email.png` - Email Pro helper
- `tech.png` - Tech Assistant helper
- `analytics.png` - Data Analyst helper
- `ecommerce.png` - E-commerce Pro helper
- `content.png` - Content Writer helper
- `social.png` - Social Media helper
- `strategy.png` - Strategist helper

## Image Specifications

- **Format:** PNG (recommended) or JPG
- **Size:** 256x256px or 512x512px (square)
- **Background:** Transparent (recommended)
- **Style:** Icon or avatar style

## Fallback Behavior

If a helper icon image is not found, the UI will automatically display:
- The helper's emoji character
- A gradient background matching the helper's color scheme

## Example Icon Sources

You can create or find icons from:
- Custom illustrations
- Icon libraries (Flaticon, Icons8, etc.)
- AI-generated avatars (Midjourney, DALL-E)
- Professional designers

## Usage in Code

The avatars are automatically loaded using:
```tsx
<AvatarImage src={`/helpers/${helper.id}.png`} alt={helper.name} />
```

Simply add the PNG files to this directory and they will be loaded automatically!

