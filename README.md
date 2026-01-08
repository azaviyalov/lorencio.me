# lorencio.me

Static resume site. Stack: HTML, CSS, Handlebars templates, YAML data. Build renders static HTML.

## Run locally

```bash
npm install
npm run build
python3 -m http.server 8000
# then open http://localhost:8000 or http://localhost:8000/ru.html
```

## Edit

- Content and translations: `content.yaml`
- Page templates: `templates/layout.hbs` + partials in `templates/partials/`
- Build script: `scripts/build.js`
- Styles: `style.css`

## Export

Click the PDF button in the header to download PDF.

## License

GPL-3.0
