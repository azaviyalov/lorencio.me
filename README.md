# lorencio.me

Static resume site. Stack: HTML, CSS, Handlebars templates, YAML data. Build renders static HTML to `docs/` for GitHub Pages.

## Run locally

```bash
npm install
npm run build
# Server must be run from docs/ directory
cd docs
python3 -m http.server 8000
# then open http://localhost:8000
```

## Build process

The build consists of two steps:
1. `scripts/build.js` - Generates HTML from Handlebars templates and YAML data
2. `scripts/bundle.js` - Bundles client-side JavaScript (including html2pdf.js) using esbuild

Both steps run automatically with `npm run build`.

## Edit

- Content and translations: `data/content.yaml`
- Page templates: `templates/layout.hbs` + partials in `templates/partials/`
- Build script: `scripts/build.js`
- Client-side JS: `src/client.js` (language switching and PDF export)
- Styles: `assets/style.css`

After editing, run `npm run build` to regenerate `docs/`.

## Dependencies

- **handlebars** - Template engine
- **js-yaml** - YAML parsing
- **date-fns** - Date calculations (age computation)
- **html2pdf.js** - PDF export functionality
- **esbuild** - Fast JavaScript bundler
- **fast-glob** - File pattern matching
- **fs-extra** - Enhanced file system operations

## Export

Click the PDF button in the header to download PDF.

## License

GPL-3.0
