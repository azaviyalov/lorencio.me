import html2pdf from "html2pdf.js";

const PDF_CONFIG = {
  margin: 10,
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true, allowTaint: true },
  jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
};

const setLang = (lang) => {
  const views = document.querySelectorAll("[data-lang-view]");
  const buttons = document.querySelectorAll("[data-lang]");
  const langStatus = document.getElementById("lang-status");

  views.forEach((view) => {
    const { langView } = view.dataset;
    const isActive = langView === lang;
    view.hidden = !isActive;

    if (isActive) {
      const name = view.querySelector(".page__name")?.textContent ?? "";
      const title = view.querySelector(".page__title")?.textContent ?? "";
      document.title = `${name} - ${title}`;
    }
  });

  buttons.forEach((btn) => {
    btn.classList.toggle(
      "language-selector__button--active",
      btn.dataset.lang === lang
    );
  });

  document.documentElement.lang = lang;
  if (langStatus) langStatus.textContent = `Language set to ${lang.toUpperCase()}`;

  localStorage.setItem("lang", lang);
};

const initLanguage = () => {
  const storedLang = localStorage.getItem("lang");
  const views = document.querySelectorAll("[data-lang-view]");
  const hasStoredView =
    storedLang && [...views].some((v) => v.dataset.langView === storedLang);

  setLang(hasStoredView ? storedLang : "ru");
};

const revealContacts = (section) => {
  if (!section) return;
  const list = section.querySelector(".contacts-list");
  if (list) list.hidden = false;
  const button = section.querySelector(".js-show-contacts");
  if (button) {
    button.setAttribute("aria-expanded", "true");
    button.remove();
  }
};

const prepareElementForPDF = (element) => {
  const cloned = element.cloneNode(true);
  Object.assign(cloned.style, {
    border: "none",
    boxShadow: "none",
  });

  cloned.querySelector(".language-selector")?.remove();
  cloned.querySelector(".page__export-pdf")?.remove();

  const showButton = cloned.querySelector(".js-show-contacts");
  if (showButton) revealContacts(showButton.closest(".contacts-section"));

  return cloned;
};

const exportToPDF = () => {
  const element = document.querySelector("[data-lang-view]:not([hidden])");
  if (!element) return;

  const filename = `${
    element.querySelector(".page__name")?.textContent ?? "resume"
  }.pdf`;

  html2pdf()
    .set({ ...PDF_CONFIG, filename })
    .from(prepareElementForPDF(element))
    .save();
};

const showContacts = (button) => {
  const section = button.closest(".contacts-section");
  if (!section) return;
  revealContacts(section);
};

initLanguage();

document.addEventListener("click", (event) => {
  const target = event.target.closest("[class*='js-']");

  if (target?.classList.contains("js-show-contacts")) {
    showContacts(target);
  } else if (target?.classList.contains("js-export-pdf")) {
    exportToPDF();
  }

  const langButton = event.target.closest("[data-lang]");
  if (langButton) {
    setLang(langButton.dataset.lang);
  }
});
