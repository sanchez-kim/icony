# Icony - Icon Customization Tool

🎨 A simple and elegant web application for customizing icons with custom colors and exporting them as PNG files or copying to clipboard for easy insertion into presentations and documents.

## Features

- **2,000+ Icons**: Comprehensive icon library with Lucide (96) and FontAwesome Free (1,983) icons
- **67 Categories**: Organized by official FontAwesome categories (UI, Arrows, Business, etc.)
- **Advanced Color Customization**:
  - Preset color swatches
  - HEX color picker
  - Direct HEX input (#000000 format)
  - EyeDropper tool (pick colors from screen in Chrome/Edge/Opera)
- **Flexible Sizing**: Export from 16px to 256px with slider control
- **PNG Export**: Download high-quality PNG files with custom colors and sizes
- **Clipboard Copy**: Copy icons directly to clipboard for PowerPoint/presentation insertion
- **Smart Search & Filter**: Real-time search with category filtering
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

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

1. **Filter by category** - Select from 67 categories or use quick filter chips
2. **Search for an icon** - Type keywords in the search bar
3. **Select an icon** - Click any icon from the gallery (2,079 available)
4. **Customize the color**:
   - Choose from preset swatches
   - Use HEX color picker
   - Type HEX value directly
   - Pick colors from your screen with EyeDropper (Chrome/Edge/Opera)
5. **Adjust size** - Use slider (16px to 256px)
6. **Export** - Download as PNG or copy to clipboard for PowerPoint

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

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 13.1+
- Edge 90+

**Note**: Clipboard functionality requires modern browsers with Clipboard API support.

## License

MIT

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
