Handlebars.registerHelper("link", (url, text) =>
  url
    ? new Handlebars.SafeString(
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
      )
    : text
);

const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);
const compile = (id) => Handlebars.compile($(id).innerHTML);

const templates = {
  job: compile("job"),
  education: compile("education-template"),
  petProject: compile("pet-project"),
  contact: compile("contact"),
};

const loadYaml = async (url) => {
  try {
    const res = await fetch(url);
    return jsyaml.load(await res.text());
  } catch (e) {
    console.error("Failed to load:", e);
    return null;
  }
};

const mergeJobs = (jobs, translations) =>
  jobs.map((job) => {
    const tJob = translations[job.id] || {};
    return {
      ...job,
      ...tJob,
      projects: job.projects?.map((p) => ({
        ...p,
        ...(tJob.projects?.[p.id] || {}),
      })),
    };
  });

const mergeEducation = (education, translations) =>
  education.map((item) => ({
    ...item,
    ...translations[item.id],
  }));

const mergePetProjects = (projects, translations) =>
  projects.map((project) => ({
    ...project,
    ...translations[project.id],
  }));

const formatBirthdate = (birthdate, lang) => {
  const date = new Date(birthdate);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const locale = lang === 'ru' ? 'ru-RU' : 'en-US';
  return date.toLocaleDateString(locale, options);
};

const render = (content, lang) => {
  let currentLang = lang;
  let t = content.i18n[currentLang];
  if (!t) {
    currentLang = 'en';
    t = content.i18n[currentLang];
  }
  
  const title = `${t.name} - ${t.title}`;

  document.title = title;
  $("name").textContent = t.name;
  $("title").textContent = t.title;
  $("birthdate").textContent = formatBirthdate(content.birthdate, lang);

  const headings = t.headings || {};
  $("heading-education").textContent = headings.education || "";
  $("heading-experience").textContent = headings.experience || "";
  $("heading-pet-projects").textContent = headings.petProjects || "";
  $("heading-contacts").textContent = headings.contacts || "";
  
  $("jobs").innerHTML = templates.job(mergeJobs(content.jobs, t.jobs));
  $("education").innerHTML = templates.education(mergeEducation(content.education, t.education));
  $("pet-projects").innerHTML = templates.petProject(mergePetProjects(content["pet-projects"], t["pet-projects"]));
  $("contacts").innerHTML = templates.contact(content.contacts);

  $$('[data-lang]').forEach((btn) =>
    btn.classList.toggle(
      "language-selector__button--active",
      btn.dataset.lang === currentLang
    )
  );
  
  document.documentElement.lang = currentLang;
  
  localStorage.setItem("lang", currentLang);
};

const exportToPDF = () => {
  const element = document.querySelector('.page');
  if (!element) {
    console.error("Page element not found");
    return;
  }
  
  if (typeof html2pdf === "undefined") {
    console.error("html2pdf library not loaded");
    return;
  }
  
  // Clone the page element
  const clonedElement = element.cloneNode(true);
  
  // Remove page borders and shadows
  clonedElement.style.border = 'none';
  clonedElement.style.boxShadow = 'none';
  
  // Remove header and footer buttons
  const languageSelector = clonedElement.querySelector('.language-selector');
  const pdfButton = clonedElement.querySelector('.page__export-pdf');
  
  if (languageSelector) languageSelector.remove();
  if (pdfButton) pdfButton.remove();
  
  const name = document.getElementById("name")?.textContent || "resume";
  const opt = {
    margin: 10,
    filename: `${name}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, allowTaint: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };
  
  html2pdf().set(opt).from(clonedElement).save();
};

document.addEventListener("DOMContentLoaded", async () => {
  const content = await loadYaml("content.yaml");
  if (!content) return;

  let lang = localStorage.getItem("lang") ?? "en";
  if (!content.i18n[lang]) lang = 'en';
  
  $$("[data-lang]").forEach((btn) =>
    btn.addEventListener("click", () => render(content, btn.dataset.lang))
  );
  
  document.addEventListener("click", (e) => {
    if (e.target.id === "export-pdf") {
      exportToPDF();
    }
  });
  
  render(content, lang);
});