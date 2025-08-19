// main.js - minimal, modern, real developer style
'use strict';
document.addEventListener('DOMContentLoaded', async () => {
  let content;
  try {
    content = await (await fetch('content.json')).json();
  } catch (e) {
    console.error('Failed to load content.json:', e);
    return;
  }

  const getById = id => document.getElementById(id);
  const langBtns = Array.from(document.querySelectorAll('[data-lang]'));

  function render(lang) {
    const container = document.querySelector('.container');
    if (container) container.style.opacity = '0.5';
    setTimeout(() => {
      updateContent(lang);
      if (container) container.style.opacity = '1';
    }, 150);
  }

  function updateContent(lang) {
    const t = content[lang];
    document.title = `${t.name} - ${t.title}`;
    getById('page-title').textContent = document.title;
    getById('name').textContent = t.name;
    getById('title').textContent = t.title;
    getById('skills').textContent = t.skills.title;
    list('skills-list', t.skills.list);
    getById('experience').textContent = t.experience;
    list('experience-list', t.experienceList);
    getById('jobs').textContent = t.jobs;
    list('jobs-list', t.jobsList);
    getById('projects').textContent = t.projects.title;
    list('projects-list', t.projects.list, true);
    contacts(content.contacts);
    langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    moveLangIndicator(lang);
    localStorage.setItem('lang', lang);
  }

  function list(id, arr, isProjects = false) {
    const el = getById(id);
    if (!el) return;
    if (id === 'skills-list' || id === 'experience-list') {
      el.innerHTML = arr.map(item => `<li>${item}</li>`).join('');
      return;
    }
    el.innerHTML = arr.map(item => {
      if (typeof item === 'string') return `<li>${item}</li>`;
      if (isProjects && item.url)
        return `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a> — ${item.desc}</li>`;
      if (item.companyUrl)
        return `<li><a href="${item.companyUrl}" target="_blank" rel="noopener noreferrer">${item.company}</a> — ${item.title}: ${item.desc}</li>`;
      return `<li>${item.company ? item.company + ' — ' : ''}${item.title}${item.desc ? ': ' + item.desc : ''}</li>`;
    }).join('');
  }

  function contacts(c) {
    set('github', c.github);
    set('linkedin', c.linkedin);
    set('telegram', c.telegram);
    set('email', `mailto:${c.email}`, 'Email');
  }

  function set(id, href, text) {
    const el = getById(id);
    if (el) {
      el.href = href || '#';
      if (text) el.textContent = text;
    }
  }

  function moveLangIndicator(lang, instant = false) {
    const nav = document.querySelector('.lang-switcher');
    const indicator = nav.querySelector('.lang-switcher-indicator');
    const btn = nav.querySelector(`[data-lang="${lang}"]`);
    if (indicator && btn) {
      indicator.style.transition = instant ? 'none' : '';
      indicator.style.left = btn.offsetLeft + 'px';
      indicator.style.width = btn.offsetWidth + 'px';
      indicator.setAttribute('data-ready', 'true');
      if (instant) void indicator.offsetWidth;
    }
  }

  langBtns.forEach(btn => btn.onclick = () => render(btn.dataset.lang));
  render(localStorage.getItem('lang') || 'en');
  moveLangIndicator(localStorage.getItem('lang') || 'en', true);
});
