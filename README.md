# lorencio.me

Static resume built with Handlebars templates, YAML content, and a tiny client bundle. Running `npm run build` outputs static assets into `build/` for GitHub Pages.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000 (auto reload enabled)
```

## Build & preview

```bash
npm run build
cd build && python3 -m http.server 8000
# open http://localhost:8000
```

## Editing guide

- Content: `data/content.yaml`
- Templates: `templates/layout.hbs`, partials in `templates/partials/`
- Client JS: `src/client.js`
- Styles: `src/style.css`
- Build scripts: files in `scripts/`

Use `npm run build` after changes; the dev server watches sources automatically.

## PDF export

The header includes a PDF button powered by `html2pdf.js` for quick resume downloads.

## License

GPL-3.0
