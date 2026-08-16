![Feriekolonien logo](/apps/web/public/logo.png)

# Feriekolonien Website

> Modern, fast website for Feriekolonien powered by [Lume](https://lume.land/) (Deno)

This project organizes the pages and content for [new.feriekolonien.no](https://new.feriekolonien.no/)

## ✨ Features

- ⚡ **Fast & Modern** - Static site generation with Lume
- 📱 **Responsive** - Works perfectly on all devices
- 🖼️ **Photo Galleries** - Beautiful image galleries with PhotoSwipe lightbox
- 🎨 **Modern CSS** - Styled with TailwindCSS
- 📊 **CMS Integration** - Content managed through Sanity CMS
- 🚀 **Zero JavaScript** - Works without JavaScript (progressive enhancement)
- 🔍 **SEO Optimized** - Server-side rendered with proper meta tags

## 🚀 Getting Started

### Prerequisites
- [Deno](https://deno.land/) 2.x or later

### Installation

```sh
git clone https://github.com/feriekolonien/site.git
cd site
```

### Development

```sh
# Start development server with hot reload
deno task dev

# Build for production
deno task build

# Serve built site locally
deno task serve
```

The site will be available at `http://localhost:3000`

## 🏗️ Built With

- **[Lume](https://lume.land/)** - Static site generator for Deno
- **[Deno](https://deno.land/)** - Modern JavaScript/TypeScript runtime
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[PhotoSwipe](https://photoswipe.com/)** - JavaScript image gallery and lightbox
- **[Sanity](https://www.sanity.io/)** - Headless CMS for content management

## 📁 Project Structure

```
├── _components/          # Reusable UI components
│   ├── image.vto        # Modern image component
│   └── navbar.vto       # Navigation component
├── _includes/           # Page layouts and templates
│   ├── base.vto        # Base HTML layout
│   └── album.vto       # Photo album layout
├── _data/              # Data files and API fetchers
├── bilder/             # Photo gallery pages
├── assets/             # Static assets (images, fonts, etc.)
├── _config.ts          # Lume configuration
└── deno.json          # Deno project configuration
```

## 🖼️ Image Handling

The site features a modern image component with:
- **Responsive images** - Automatic `srcset` generation
- **Lazy loading** - Images load as needed
- **Modern formats** - WebP/AVIF support through Sanity
- **Layout shift prevention** - CSS `aspect-ratio` for stable layouts
- **Performance optimized** - Proper `fetchpriority` and `loading` attributes

## 📱 Photo Galleries

Photo galleries use a justified rows layout algorithm with PhotoSwipe lightbox:
- **Server-side layout calculation** - No layout shift
- **Touch/swipe support** - Perfect for mobile
- **Keyboard navigation** - Arrow keys, ESC to close
- **Zoom functionality** - Pinch to zoom, mouse wheel
- **Responsive design** - Works on all screen sizes

## 🚀 Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions:

1. **Push to `main`** triggers automatic deployment
2. **GitHub Actions** builds the site with Lume
3. **GitHub Pages** serves the static files
4. **Custom domain** available at `new.feriekolonien.no`

### Manual Deployment

```sh
# Build and deploy
deno task build
# Files are generated in _site/ directory
```

## 🔧 Configuration

### Environment Variables
- `SANITY_PROJECT_ID` - Sanity project ID
- `SANITY_DATASET` - Sanity dataset (usually "production")

### Sanity CMS
Content is managed through Sanity CMS. The site fetches:
- Photo albums and images
- Page content and metadata
- Site configuration

## 📝 Content Management

1. **Albums** - Photo galleries organized by year
2. **Images** - High-resolution photos with metadata
3. **Pages** - Static content pages
4. **Site settings** - Global configuration

### Annual season update

The active season is configured in `season.ts`. Update the year, registration
dates, final party date, and party labels there before opening registration for
a new summer.

The public site changes automatically between these states in the visitor's
browser, without requiring a deployment at the date boundary:

1. Countdown before registration opens
2. Open registration
3. Waitlist after the registration deadline
4. "Takk for i år" after the final party ends

In the final state, registration and waitlist links disappear and the embedded
Google Form is no longer loaded. The landing and gallery pages say that the
current summer's photos are coming soon. When an album whose title is the season
year (for example `2026`) is available in the built site, the landing-page copy
automatically links to that album instead.

Albums are fetched from Sanity when the site builds. After publishing a new
album in Sanity, run the GitHub Actions workflow **Deploy Lume site to GitHub
Pages** (or push a code change) to rebuild and publish it.

## 🔍 SEO & Performance

- **Server-side rendering** - All content pre-rendered
- **Semantic HTML** - Proper heading structure and landmarks
- **Meta tags** - Open Graph and Twitter Card support
- **Sitemap** - Automatically generated
- **Fast loading** - Optimized images and minimal JavaScript

## 📄 License

[MIT License](LICENSE)

---

<p align="center">
  Made with ❤️ for Feriekolonien
</p>
