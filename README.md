# IME Website Redesign

A modern, responsive redesign of the IME School website with improved accessibility, SEO, and performance.

## Quick Start (Windows PowerShell)

```powershell
cd 'c:\Users\PC\OneDrive\Documents\Projects\Ime website'
npm install
npm start
```

Open `http://127.0.0.1:5500` in your browser. All pages are live at the same address.

## What's Included

### Pages
- `index.html` — Home with hero, highlights, news teaser, sidebar.
- `about.html` — Mission and vision.
- `admissions.html` — Application steps and info.
- `news.html` — Announcements and updates.
- `contact.html` — Contact form and info.

### Assets
- `assets/css/styles.css` — Custom responsive CSS with IME color tokens (`--ime-red`, `--ime-blue`, `--ime-white`) and accessibility features.
- `assets/js/main.js` — Mobile nav toggle, keyboard handling, focus management.
- `assets/images/` — Logo and SVG placeholders; optimized WebP/AVIF variants auto-generated.

### SEO & Build
- `sitemap.xml` and `robots.txt` for search engines.
- `package.json` with npm scripts for dev and image optimization.
- `tools/image-opt.js` — Node.js script using `sharp` to generate modern image formats.

### Documentation
- `report.md` — Full improvement report with accessibility, performance, and SEO details.

## Features

✅ **Responsive design** — Mobile-first, works on all screen sizes.  
✅ **Accessibility** — WCAG 2.1 Level A (skip links, ARIA, keyboard nav, focus indicators).  
✅ **SEO** — Meta tags, JSON-LD structured data, sitemap, robots.txt.  
✅ **Performance** — Image optimization (WebP/AVIF), lazy loading, minimal CSS/JS.  
✅ **Brand colors** — Red/blue/white palette preserved via CSS variables.  

## Available Scripts

```powershell
# Start local preview on http://127.0.0.1:5500
npm start

# Generate optimized image formats (WebP/AVIF)
npm run images:optimize

# Test placeholder (no-op)
npm test
```

## Deploying

Upload the entire folder to any static host:
- **GitHub Pages**: Commit and enable Pages in repo settings.
- **Netlify**: Drag & drop folder or connect GitHub repo.
- **Vercel**: Import from GitHub or upload directly.
- **AWS S3 + CloudFront**: Use AWS CLI or console to upload and distribute.

No build step required — all files are ready to serve.

## Customization

### Colors
Edit CSS variables in `assets/css/styles.css`:
```css
:root {
  --ime-red: #c8102e;
  --ime-blue: #0b57a4;
  --ime-white: #ffffff;
  /* ... */
}
```

### Content
Edit HTML files directly; no templating required for a simple site like this.

### Images
1. Add PNG/JPG files to `assets/images/`.
2. Run `npm run images:optimize` to generate WebP/AVIF variants.
3. Update HTML `<picture>` elements to reference new images.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge).
- Picture element with fallbacks ensures broad compatibility.
- Graceful degradation for older browsers (falls back to PNG).

## Notes

- For faster builds, optionally install **ImageMagick** or use an online service like **TinyPNG** to pre-optimize images.
- If you add new images, re-run `npm run images:optimize` before deploying.
- The site is fully static — no backend required. For forms, consider **Netlify Forms**, **Formspree**, or **EmailJS**.

See `report.md` for the full improvement report and next steps.
