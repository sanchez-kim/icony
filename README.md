# Icony - Icon Customization Tool

🎨 A modern, elegant web application for customizing icons with custom colors, sizes, and exporting them in multiple formats. Perfect for designers and developers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## Features

### Core Features
- **2,000+ Icons**: Comprehensive library with Lucide (96) and Font Awesome Free (1,983) icons
- **67 Categories**: Organized by official Font Awesome categories (UI, Arrows, Business, etc.)
- **Multiple Export Formats**: Download as PNG or SVG
- **Smart Search & Filter**: Real-time search with category filtering
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Advanced Customization
- **Color Customization**:
  - Preset color swatches
  - HEX color picker with real-time preview
  - Direct HEX input (#000000 format)
  - EyeDropper tool (pick colors from screen - requires HTTPS or localhost)
  - Recent colors history
  - Custom color palettes (save and manage)
- **Flexible Sizing**: 16px to 512px with slider and preset buttons

### User Experience
- **Landing Page**: Professional landing page with feature showcase
- **Dark Mode**: Full dark mode support with system preference detection
- **Favorites**: Save frequently used icons for quick access
- **Recent History**: Automatically track recently used icons
- **Share Links**: Generate shareable URLs with icon configurations
- **Onboarding Tutorial**: Interactive 5-step guide for new users
- **Clipboard Support**: Copy icons directly to clipboard for presentations
- **Accessibility**: Keyboard navigation and ARIA labels

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library (96 icons)
- **FontAwesome Free** - Icon library (1,983 icons)
- **React Colorful** - Color picker
- **React Hot Toast** - Notifications
- **EyeDropper API** - Screen color picker (Chrome/Edge/Opera)

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3030](http://localhost:3030) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Browse Icons**: Search through 2,000+ icons or filter by 67 categories
2. **Select Icon**: Click any icon from the gallery
3. **Customize Color**:
   - Choose from preset swatches
   - Use HEX color picker with real-time preview
   - Type HEX value directly (#000000 format)
   - Pick colors from screen with EyeDropper (HTTPS or localhost required)
   - Save recent colors and custom palettes
4. **Adjust Size**: Use slider (16px to 512px) or preset size buttons
5. **Export**:
   - Download as PNG or SVG
   - Copy to clipboard for presentations
   - Generate shareable URL with your configuration
6. **Manage**:
   - Save frequently used icons to favorites (⭐)
   - Access recently used icons automatically
   - Toggle dark mode for comfortable viewing

### Tips

- **EyeDropper Tool**: Only works on HTTPS or localhost. If using local network IP (e.g., `192.168.x.x`), use `http://localhost:5173` instead
- **Onboarding**: Click the help button (?) in the header to replay the tutorial
- **Dark Mode**: System preference is detected automatically, or toggle manually

## Project Structure

```
icony/
├── src/
│   ├── components/          # React components
│   │   ├── IconGallery/    # Icon gallery, search, and category filter
│   │   ├── CustomizationPanel/  # Color, size, export controls
│   │   ├── Layout/         # Layout components
│   │   └── Header.tsx      # Application header
│   ├── context/            # React context for state management
│   ├── services/           # Core services (rendering, clipboard, export)
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── data/               # Icon data
│       ├── icons.ts        # Lucide icons (96)
│       └── fontawesome-icons.ts  # FontAwesome icons (1,983)
├── docs/                   # Project documentation
│   ├── README.md           # Documentation index
│   ├── design/             # Design documents
│   ├── guides/             # User guides
│   └── reports/            # Work reports
├── scripts/                # Utility scripts
│   ├── README.md           # Scripts documentation
│   ├── generate-all-icons-v2.cjs  # Icon generation script
│   └── .archive/           # Generated data and logs
└── [config files]          # Vite, TypeScript, Tailwind configs
```

## Deployment

### Vercel (Recommended)

The easiest way to deploy this application:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Manual Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains the production-ready files
# Upload to any static hosting service (Netlify, Cloudflare Pages, etc.)
```

### Environment Notes

- **EyeDropper API**: Only works on HTTPS or localhost
- **For local network access**: Use `http://localhost:5173` instead of IP address
- **Production**: Deploy to HTTPS domain for full functionality

## Browser Support

- **Chrome 90+** ✅ (Full support including EyeDropper)
- **Firefox 88+** ✅ (EyeDropper not supported)
- **Safari 13.1+** ✅ (EyeDropper not supported)
- **Edge 90+** ✅ (Full support including EyeDropper)

**Note**:
- Clipboard functionality requires modern browsers with Clipboard API support
- EyeDropper API only available in Chromium-based browsers (Chrome, Edge, Opera)

## License

### Source Code License

The **source code** of this project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Icony Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Icon Licenses

**⚠️ IMPORTANT**: The icons used in this application are provided by third-party libraries and are subject to their respective licenses:

#### Font Awesome Free 6.7.2
- **License**: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://fontawesome.com/license/free)
- **Icons**: 1,983 icons
- **Attribution Required**: Yes
- **Commercial Use**: Allowed with proper attribution
- **Website**: https://fontawesome.com
- **Copyright**: Font Awesome Free by Fonticons, Inc.

#### Lucide Icons
- **License**: [ISC License](https://github.com/lucide-icons/lucide/blob/main/LICENSE)
- **Icons**: 96 icons
- **Attribution Required**: No (but appreciated)
- **Commercial Use**: Fully allowed
- **Website**: https://lucide.dev

### Attribution

This application includes icons from:
- **Font Awesome Free** (CC BY 4.0 License) - https://fontawesome.com
- **Lucide Icons** (ISC License) - https://lucide.dev

All icon copyrights belong to their respective owners.

### Important Notes

1. **If you use this application commercially** (with ads, paid features, etc.):
   - The source code is MIT licensed (free to use)
   - Font Awesome icons require attribution (already included in footer)
   - Consider switching to MIT-licensed icon libraries (Heroicons, Tabler Icons) for full commercial freedom

2. **For personal/internal use**:
   - Everything is free to use
   - Attribution in footer satisfies Font Awesome requirements

3. **Icon Redistribution**:
   - Be aware that providing icon downloads may have implications under icon library terms
   - Current implementation is designed for personal/internal use

## Documentation

For detailed documentation, see the [docs](./docs) directory:

### Design Documentation
- [Architecture](./docs/design/architecture.md) - System architecture
- [Components](./docs/design/components.md) - Component specifications
- [Technical Specifications](./docs/design/technical-specs.md) - TypeScript types and APIs
- [Implementation Guide](./docs/design/implementation-guide.md) - Step-by-step guide
- [User Flows](./docs/design/user-flows.md) - User scenarios

### Guides
- [Quick Start](./docs/guides/QUICK_START.md) - Get started quickly
- [Project Organization](./docs/guides/PROJECT_ORGANIZATION.md) - Project structure
- [Deployment](./docs/guides/DEPLOYMENT.md) - Deploy to production

### Other
- [Documentation Index](./docs/README.md) - All documentation
- [Changelog](./docs/CHANGELOG.md) - Version history
