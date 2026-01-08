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

  localStorage.setItem("lang", lang);
};

const initLanguage = () => {
  const storedLang = localStorage.getItem("lang");
  const views = document.querySelectorAll("[data-lang-view]");
  const hasStoredView =
    storedLang && [...views].some((v) => v.dataset.langView === storedLang);

  setLang(hasStoredView ? storedLang : "ru");
};

const prepareElementForPDF = (element) => {
  const cloned = element.cloneNode(true);
  Object.assign(cloned.style, {
    border: "none",
    boxShadow: "none",
  });

  // Remove language selector and PDF export buttons
  cloned.querySelector(".language-selector")?.remove();
  cloned.querySelector(".page__export-pdf")?.remove();

  // Если кнопка "Показать" есть, значит контакты не раскрыты - создаём их для PDF
  const showButton = cloned.querySelector(".js-show-contacts");
  if (showButton) {
    const section = showButton.closest(".contacts-section");
    if (section) {
      // Создаём список контактов
      const list = document.createElement("ul");
      list.className = "contacts-list";
      
      CONTACTS.forEach(contact => {
        const li = document.createElement("li");
        li.className = "contact-item";
        
        const link = document.createElement("a");
        link.href = contact.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = contact.url;
        
        li.textContent = `${contact.name} — `;
        li.appendChild(link);
        list.appendChild(li);
      });
      
      section.appendChild(list);
      showButton.remove();
    }
  }

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

// Данные контактов хранятся только в JavaScript, не в HTML
const CONTACTS = [
  { name: "GitHub", url: "https://github.com/azaviyalov" },
  { name: "LinkedIn", url: "https://linkedin.com/in/azaviyalov" },
  { name: "Telegram", url: "https://t.me/lorencio_a" },
  { name: "Email", url: "mailto:antonzaviyalov@gmail.com" }
];

const showContacts = (e) => {
  const button = e.target.closest(".js-show-contacts");
  if (!button) return;
  
  const section = button.closest(".contacts-section");
  if (!section) return;
  
  // Создаём контакты
  const list = document.createElement("ul");
  list.className = "contacts-list";
  
  CONTACTS.forEach(contact => {
    const li = document.createElement("li");
    li.className = "contact-item";
    
    const link = document.createElement("a");
    link.href = contact.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = contact.url;
    
    li.textContent = `${contact.name} — `;
    li.appendChild(link);
    list.appendChild(li);
  });
  
  // Добавляем список и удаляем кнопку
  section.appendChild(list);
  button.remove();
};

initLanguage();

document.addEventListener("click", (e) => {
  // Проверяем кнопку показа контактов
  if (e.target?.closest(".js-show-contacts")) {
    showContacts(e);
    return;
  }

  if (e.target?.closest(".js-export-pdf")) {
    exportToPDF();
    return;
  }
  
  const langButton = e.target?.closest("[data-lang]");
  if (langButton) {
    setLang(langButton.dataset.lang);
  }
});
