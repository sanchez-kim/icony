# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## ✨ Features Checklist

- [x] 100+ Lucide icons (expandable to 1000+)
- [x] Real-time search and filtering
- [x] Color customization with 8 preset swatches
- [x] Custom color picker with hex input
- [x] 4 size options (32px, 64px, 128px, 256px)
- [x] PNG download with auto-generated filenames
- [x] Clipboard copy for direct paste into PPT/docs
- [x] Responsive design (mobile, tablet, desktop)
- [x] Accessibility features (ARIA labels, keyboard navigation)
- [x] Loading states and error handling
- [x] Toast notifications

## 📁 Project Structure

```
icony/
├── docs/                       # Comprehensive documentation
│   ├── README.md              # Project overview
│   ├── architecture.md        # System architecture
│   ├── components.md          # Component specifications
│   ├── technical-specs.md     # Technical details
│   ├── implementation-guide.md # Step-by-step guide
│   └── user-flows.md          # User scenarios
├── src/
│   ├── components/            # React components
│   │   ├── IconGallery/      # Icon browsing
│   │   ├── CustomizationPanel/ # Color & size controls
│   │   └── Layout/           # Layout components
│   ├── services/             # Core functionality
│   │   ├── iconRenderer.ts   # SVG → PNG conversion
│   │   ├── clipboardManager.ts # Clipboard API
│   │   └── exportManager.ts  # File downloads
│   ├── context/              # State management
│   ├── hooks/                # Custom hooks
│   ├── types/                # TypeScript types
│   ├── utils/                # Utilities
│   └── data/                 # Icon data
└── package.json
```

## 🎨 Usage

1. **Search** for icons using the search bar
2. **Click** an icon to select it
3. **Choose** a color from swatches or custom picker
4. **Select** a size (32px, 64px, 128px, 256px)
5. **Download** as PNG or **Copy** to clipboard

## 🔧 Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Lucide React (icons)
- React Colorful (color picker)
- React Hot Toast (notifications)

## 🌐 Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 13.1+ ✅
- Edge 90+ ✅

## 📝 Next Steps

- Add more icons from Lucide React library
- Implement SVG export option
- Add icon favorites/bookmarks
- Support for custom icon upload
- Batch export multiple icons
- Dark mode toggle

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
