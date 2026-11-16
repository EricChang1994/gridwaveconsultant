'use strict';

// Marks the document as script-enabled so CSS can switch to the enhanced navigation.
document.documentElement.classList.add('js');
const isChinese = document.documentElement.lang === 'zh-TW';
const t = (english, chinese) => isChinese ? chinese : english;
// Keep the selected project, service and section when switching language.
document.querySelectorAll('[data-language]').forEach((link) => {
  const target = new URL(link.href);
  target.search = location.search;
  target.hash = location.hash;
  link.href = target.href;
});

/* ---------- Mobile navigation ---------- */
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');

function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}

if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (nav.classList.contains('open') && !event.target.closest('.site-header')) closeMenu();
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
}

/* ---------- Project register: category filter + text search ---------- */
const search = document.querySelector('#project-search');
if (search) {
  document.querySelector('.filter-toolbar').hidden = false;
  const cards = [...document.querySelectorAll('.project-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('#project-count');
  const empty = document.querySelector('#no-results');
  const head = document.querySelector('.register-head');
  let current = 'all';

  function applyFilters() {
    const term = search.value.trim().toLocaleLowerCase();
    let shown = 0;
    cards.forEach((card) => {
      const show =
        (current === 'all' || card.dataset.category === current) &&
        card.dataset.search.toLocaleLowerCase().includes(term);
      card.hidden = !show;
      if (show) shown++;
    });
    count.textContent = isChinese ? `${shown} 個專案` : `${shown} ${shown === 1 ? 'project' : 'projects'}`;
    empty.hidden = shown !== 0;
    if (head) head.hidden = shown === 0;
  }

  filters.forEach((button) =>
    button.addEventListener('click', () => {
      current = button.dataset.filter;
      filters.forEach((b) => {
        const active = b === button;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      applyFilters();
    })
  );
  search.addEventListener('input', applyFilters);
  document.querySelector('#reset-filters').addEventListener('click', () => {
    search.value = '';
    filters[0].click();
    search.focus();
  });
}

/* ---------- Contact: copy email address ---------- */
const copy = document.querySelector('#copy-email');
if (copy) {
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(copy.dataset.email);
      status.textContent = t('Email address copied.', '已複製電子郵件地址。');
    } catch {
      status.textContent = t('Please select and copy the email address above.', '請選取並複製上方的電子郵件地址。');
    }
  });
}

/* ---------- Contact: enquiry form → mailto draft (nothing is sent or stored) ---------- */
const enquiry = document.querySelector('#enquiry-form');
if (enquiry) {
  enquiry.hidden = false;
  const address = enquiry.dataset.email;
  const params = new URLSearchParams(location.search);
  const serviceNames = {
    'owners-engineering': 'Owner’s engineering',
    'package-management': 'HV package management',
    'commissioning': 'Commissioning & energization',
    'interface-advisory': 'Interface & delivery advisory',
  };
  const projectNames = {
    'east-anglia-one-north': 'East Anglia ONE North',
    'fengmiao': t('Fengmiao I', 'Fengmiao I'),
    'coastal-virginia': t('Coastal Virginia Offshore Wind', 'Coastal Virginia Offshore Wind'),
    'formosa-4': 'Formosa 4',
    'greater-changhua-2b-4': t('Greater Changhua 2b & 4', 'Greater Changhua 2b & 4'),
    'greater-changhua-1-2a': t('Greater Changhua 1 & 2a', 'Greater Changhua 1 & 2a'),
    'mailiao': t('Mailiao Power Plant', '麥寮發電廠'),
  };

  const service = serviceNames[params.get('service')];
  if (service) enquiry.elements.service.value = service;
  const project = projectNames[params.get('project')];
  if (project) {
    enquiry.elements.message.value =
      t(`I would like to discuss a scope similar to the experience described in ${project}.\n\n`, `我想洽談與 ${project} 所述經驗類似的工程需求。\n\n`) +
      t('Project location:\nCurrent stage:\nSupport needed:\nTarget timing:', '專案地點：\n目前階段：\n所需支援：\n目標時程：');
  }

  enquiry.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!enquiry.reportValidity()) return;
    const data = new FormData(enquiry);
    const support = enquiry.elements.service.selectedOptions[0].textContent;
    const subject = t(`GridWave enquiry — ${support}`, `GridWave 專案諮詢 — ${support}`);
    const body =
      t(`Hello Eric,\n\n${data.get('message')}\n\n`, `Eric 您好：\n\n${data.get('message')}\n\n`) +
      t(`Name: ${data.get('name')}\nCompany: ${data.get('company') || 'Not specified'}\nSupport: ${support}\n`, `姓名：${data.get('name')}\n公司：${data.get('company') || '未填寫'}\n所需支援：${support}\n`);
    document.querySelector('#email-draft').value = t(`To: ${address}\nSubject: ${subject}\n\n${body}`, `收件人：${address}\n主旨：${subject}\n\n${body}`);
    document.querySelector('#draft-fallback').hidden = false;
    document.querySelector('#email-status').textContent =
      t('Your draft is ready. Review and send it from your email application, or copy the text below.', '郵件草稿已備妥。請在電子郵件應用程式中確認後寄出，或複製下方文字。');
    location.href = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
