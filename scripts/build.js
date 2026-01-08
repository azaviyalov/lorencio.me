import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Handlebars from 'handlebars';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, content) => fs.writeFileSync(path.join(root, p), content);

Handlebars.registerHelper('link', (url, text) =>
  url
    ? new Handlebars.SafeString(
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
      )
    : text
);

Handlebars.registerHelper('eq', (a, b) => a === b);

const computeAge = (birthdate) => {
  const dob = new Date(birthdate);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const formatAge = (age, lang, label, translations) => {
  const pr = new Intl.PluralRules(lang);
  const category = pr.select(age);
  const ageUnitMap = translations?.labels?.ageUnit;
  const unit = ageUnitMap ? (ageUnitMap[category] ?? ageUnitMap.other ?? '') : '';
  const prefix = label ? `${label}: ` : '';
  return `${prefix}${age}${unit ? ` ${unit}` : ''}`;
};

const mergeJobs = (jobs, translations = {}) =>
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

const mergeEducation = (education, translations = {}) =>
  education.map((item) => ({
    ...item,
    ...(translations[item.id] || {}),
  }));

const mergePetProjects = (projects, translations = {}) =>
  projects.map((project) => ({
    ...project,
    ...(translations[project.id] || {}),
  }));

function build() {
  const content = yaml.load(read('content.yaml'));
  const builtAt = new Date().toUTCString();

  // Register partials
  Handlebars.registerPartial('job', read('templates/partials/job.hbs'));
  Handlebars.registerPartial('education', read('templates/partials/education.hbs'));
  Handlebars.registerPartial('pet-project', read('templates/partials/pet-project.hbs'));
  Handlebars.registerPartial('contact', read('templates/partials/contact.hbs'));

  const layout = Handlebars.compile(read('templates/layout.hbs'));

  const langs = ['en', 'ru'];
  const views = langs.map((lang) => {
    let t = content.i18n[lang];
    const currentLang = t ? lang : 'en';
    if (!t) t = content.i18n['en'];

    const age = computeAge(content.birthdate);
    const ageLabel = t.labels?.age;
    const ageText = formatAge(age, currentLang, ageLabel, t);

    const headings = t.headings || {};

    return {
      lang: currentLang,
      name: t.name,
      titleText: t.title,
      ageText,
      headings,
      jobs: mergeJobs(content.jobs, t.jobs),
      education: mergeEducation(content.education, t.education),
      petProjects: mergePetProjects(content['pet-projects'], t['pet-projects']),
      contacts: content.contacts,
      pageTitle: `${t.name} - ${t.title}`,
      isDefault: currentLang === 'en',
    };
  });

  const html = layout({ views, builtAt });
  write('index.html', html);
  console.log('Generated index.html');
}

build();
