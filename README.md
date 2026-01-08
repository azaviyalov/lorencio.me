# lorencio.me

Static resume site. Stack: HTML, CSS, Handlebars templates, YAML data. Build renders static HTML to `docs/` for GitHub Pages.

## Run locally

```bash
npm install
npm run dev
# then open http://localhost:3000
# Browser auto-reloads on file changes (livereload + nodemon watch all sources)
```

## Build process

```bash
npm install
npm run build
# To preview production build locally:
cd docs
python3 -m http.server 8000
# then open http://localhost:8000
```

The build consists of two steps:
1. `scripts/build.js` - Generates HTML from Handlebars templates and YAML data
2. `scripts/bundle.js` - Bundles client-side JavaScript (including html2pdf.js) using esbuild

Both steps run automatically with `npm run build`.

## Edit

- Content and translations: `data/content.yaml`
- Page templates: `templates/layout.hbs` + partials in `templates/partials/`
- Build scripts: `scripts/build.js`, `scripts/bundle.js`
- Dev server: `scripts/server.js`
- Shared utilities: `scripts/utils.js`
- Client-side JS: `src/client.js` (language switching and PDF export)
- Styles: `src/style.css`

After editing, run `npm run build` to regenerate `docs/`.

## Dependencies

- **handlebars** - Template engine
- **js-yaml** - YAML parsing
- **date-fns** - Date calculations (age computation)
- **html2pdf.js** - PDF export functionality
- **esbuild** - Fast JavaScript bundler
- **fast-glob** - File pattern matching
- **fs-extra** - Enhanced file system operations
- **express** - Web server for development
- **chalk** - Terminal styling

### Development
- **nodemon** - Auto-restart server on script changes
- **livereload** - Auto-reload browser on content/template changes
- **csso** - CSS minifier
- **html-minifier-terser** - HTML minifier

## Export

Click the PDF button in the header to download PDF.

## License

GPL-3.0
