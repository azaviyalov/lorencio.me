# lorencio.me

Static resume site. Stack: HTML, CSS, Handlebars templates, YAML data. Build renders static HTML to `docs/` for GitHub Pages.

## Run locally

```bash
npm install
npm run build
cd docs && python3 -m http.server 8000
# then open http://localhost:8000
```

## Edit

- Content and translations: `data/content.yaml`
- Page templates: `templates/layout.hbs` + partials in `templates/partials/`
- Build script: `scripts/build.js`
- Styles: `assets/style.css`

After editing, run `npm run build` to regenerate `docs/`.

## Export

Click the PDF button in the header to download PDF.

## License

GPL-3.0
