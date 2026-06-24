import html2pdf from "html2pdf.js";

const DEFAULT_LANG = "ru";
const selectors = {
  exportPdf: ".js-export-pdf",
  langButton: "[data-lang]",
  langStatus: "#lang-status",
  langView: "[data-lang-view]",
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const PDF_CONFIG = {
  margin: [20, 30, 20, 10],
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true, allowTaint: true },
  jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
};

const setLang = (lang) => {
  $$(selectors.langView).forEach((view) => {
    const isActive = view.dataset.langView === lang;
    view.hidden = !isActive;

    if (isActive) {
      const name = $(".page__name", view)?.textContent ?? "";
      const title = $(".page__title", view)?.textContent ?? "";
      document.title = `${name} - ${title}`;
    }
  });

  $$(selectors.langButton).forEach((btn) => {
    btn.classList.toggle(
      "language-selector__button--active",
      btn.dataset.lang === lang
    );
  });

  document.documentElement.lang = lang;
  $(selectors.langStatus)?.replaceChildren(`Language set to ${lang.toUpperCase()}`);
  localStorage.setItem("lang", lang);
};

const initLanguage = () => {
  const storedLang = localStorage.getItem("lang");
  const hasStoredLang = $$(selectors.langView).some(
    (view) => view.dataset.langView === storedLang
  );

  setLang(hasStoredLang ? storedLang : DEFAULT_LANG);
};

const prepareElementForPDF = (element) => {
  const cloned = element.cloneNode(true);
  Object.assign(cloned.style, {
    border: "none",
    boxShadow: "none",
  });

  cloned.classList.add("pdf-export");

  $(".language-selector", cloned)?.remove();
  $(".page__export-pdf", cloned)?.remove();

  return cloned;
};

const exportToPDF = () => {
  const element = $(`${selectors.langView}:not([hidden])`);
  if (!element) return;

  html2pdf()
    .set({
      ...PDF_CONFIG,
      filename: `${$(".page__name", element)?.textContent ?? "resume"}.pdf`,
    })
    .from(prepareElementForPDF(element))
    .save();
};

initLanguage();

document.addEventListener("click", ({ target }) => {
  if (target.closest(selectors.exportPdf)) {
    exportToPDF();
    return;
  }

  const langButton = target.closest(selectors.langButton);
  if (langButton) setLang(langButton.dataset.lang);
});
