// GridWave site generator — no dependencies.
//
//   node src/build.mjs
//
// Reads src/pages/*.html (page bodies) and src/projects.json (project data),
// wraps them in the shared header/footer and writes finished static HTML to
// the repository root, which is what GitHub Pages serves.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLocales } from './localize.mjs';

const SRC = dirname(fileURLToPath(import.meta.url));
const OUT = join(SRC, '..');

const SITE = {
  url: 'https://gridwavepower.com',
  name: 'GridWave Power Consulting',
  email: 'ericchangpe@gmail.com',
  linkedin: 'https://www.linkedin.com/in/wen-jui-eric-chang-pe-pmp-022a58127',
  year: 2026,
  defaultReviewed: '12 October 2026',
  featured: ['east-anglia-one-north', 'fengmiao', 'greater-changhua-1-2a'],
};

const SERVICES = {
  'owners-engineering': 'Owner’s engineering',
  'package-management': 'HV package management',
  'commissioning': 'Commissioning & energization',
  'interface-advisory': 'Interface & delivery advisory',
};
const CATEGORIES = { offshore: 'Offshore wind', grid: 'Grid integration', operations: 'Operations' };
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const arrow = '<span class="arr" aria-hidden="true">→</span>';

const projects = JSON.parse(readFileSync(join(SRC, 'projects.json'), 'utf8'));

/* ---------- Shared chrome ---------- */

const brand = (root) => `<a class="brand" href="${root}index.html" aria-label="GridWave home">
        <svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="6" fill="#0b2434"/><path d="M13 46V34h9v12zm14 0V24h9v22zm14 0V14h9v32z" fill="#62d2cd"/></svg>
        <span class="brand-text"><b>GridWave</b><small>Power Consulting</small></span>
      </a>`;

function layout({ file, title, fullTitle, ogTitle, description, current = '', root = '', body, noindex = false, cta = true }) {
  const pageTitle = fullTitle || `${title} | ${SITE.name}`;
  const og = ogTitle || `${title} | GridWave`;
  const canonical = `${SITE.url}/${file === 'index.html' ? '' : file}`;
  const navLink = (key, href, label) =>
    `<a href="${root}${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;
  const jsonLd = file === 'index.html' ? `
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'GridWave Power Consulting LLC',
    url: SITE.url,
    image: `${SITE.url}/assets/offshore-substation-yard.webp`,
    description: 'Independent HV engineering consulting for offshore wind, substations, package management and commissioning.',
    founder: { '@type': 'Person', name: 'Wen Jui (Eric) Chang', sameAs: SITE.linkedin },
    sameAs: [SITE.linkedin],
  })}</script>` : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(description)}">${noindex ? '\n  <meta name="robots" content="noindex">' : ''}
  <meta name="theme-color" content="#0b2434">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:title" content="${esc(og)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE.url}/assets/offshore-substation-yard.webp">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="${root}styles.css">
  <script src="${root}script.js" defer></script>${jsonLd}
</head>
<body id="top">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container nav-wrap">
      ${brand(root)}
      <div class="language-switch" role="group" aria-label="Language">
        <a href="${root}${file}" data-language="en" lang="en" hreflang="en" aria-current="true">EN</a>
        <span aria-hidden="true">/</span>
        <a href="${root}zh-TW/${file}" data-language="zh-TW" lang="zh-Hant" hreflang="zh-TW">繁體中文</a>
      </div>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu <i aria-hidden="true"></i></button>
      <nav id="primary-nav" aria-label="Main navigation">
        ${navLink('services', 'services.html', 'Services')}
        ${navLink('expertise', 'expertise.html', 'Expertise')}
        ${navLink('projects', 'projects.html', 'Projects')}
        ${navLink('about', 'about.html', 'About')}
        <a class="nav-cta" href="${root}contact.html"${current === 'contact' ? ' aria-current="page"' : ''}>Let’s talk <span aria-hidden="true">→</span></a>
      </nav>
    </div>
  </header>

  <main id="main">
${body.trim()}
${cta ? `
<section class="cta-band">
  <div class="container cta-inner">
    <div>
      <p class="eyebrow">Start a conversation</p>
      <h2>Let’s connect the engineering to your next milestone.</h2>
    </div>
    <a class="button light" href="${root}contact.html">Discuss your project ${arrow}</a>
  </div>
</section>` : ''}
  </main>

  <footer>
    <div class="container footer-grid">
      <div>
        ${brand(root)}
        <p>Independent engineering.<br>Connected project thinking.</p>
      </div>
      <div>
        <p class="eyebrow">Explore</p>
        <a href="${root}services.html">Services</a>
        <a href="${root}expertise.html">Technical expertise</a>
        <a href="${root}projects.html">Project experience</a>
        <a href="${root}about.html">About GridWave</a>
      </div>
      <div>
        <p class="eyebrow">Connect</p>
        <a href="mailto:${SITE.email}">${SITE.email}</a>
        <a href="${SITE.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        <a href="${root}contact.html">Discuss a project</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${SITE.year} GridWave Power Consulting LLC</span>
      <span>HV &amp; Power Infrastructure Engineering</span>
      <a href="#top">Back to top ↑</a>
    </div>
  </footer>
</body>
</html>
`;
}

/* ---------- Project register (index + projects pages) ---------- */

function register(list, root) {
  const rows = list.map((p) => {
    const no = pad(projects.indexOf(p) + 1);
    const searchText = [p.name, p.subtitle, p.country, p.location, p.discipline, p.employer, ...p.tags].join(' ');
    return `      <li class="project-card" data-category="${p.category}" data-search="${esc(searchText)}">
        <a href="${root}projects/${p.slug}.html">
          <span class="r-no">${no}</span>
          <span class="r-name"><strong>${esc(p.name)}</strong><small>${esc(p.subtitle)}</small></span>
          <span class="r-scope">${esc(p.discipline)}</span>
          <span class="r-loc">${esc(p.country)}</span>
          <span class="r-scale">${esc(p.capacity)}</span>
          <span class="r-arrow" aria-hidden="true">→</span>
        </a>
      </li>`;
  });
  return `<div class="register-head" aria-hidden="true"><span>No.</span><span>Project</span><span>Founder’s scope</span><span>Location</span><span>Scale / period</span><span></span></div>
    <ol class="register">
${rows.join('\n')}
    </ol>`;
}

/* ---------- Project detail pages ---------- */

function projectPage(p, i) {
  const root = '../';
  const next = projects[(i + 1) % projects.length];
  const no = pad(i + 1);
  const facts = [['Location', p.location], ...p.facts]
    .map(([k, v]) => `          <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n');
  const work = p.work
    .map(([h, t], n) => `        <article class="work-item"><span>${pad(n + 1)}</span><div><h3>${esc(h)}</h3><p>${esc(t)}</p></div></article>`).join('\n');
  const tags = p.tags.map((t) => `<span>${esc(t)}</span>`).join('');
  const related = p.services
    .map((s) => `<a href="${root}services.html#${s}">${esc(SERVICES[s])} →</a>`).join('');
  const sources = p.sources
    .map(([org, label, url]) => `          <li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(org)} ↗</strong><span>${esc(label)}</span></a></li>`).join('\n');

  const body = `
<section class="project-heading gridded">
  <div class="container">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${root}index.html">Home</a><span aria-hidden="true">/</span><a href="${root}projects.html">Projects</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></nav>
    <p class="eyebrow">Project ${no} / ${esc(p.country)} / ${esc(p.subtitle)}</p>
    <h1>${esc(p.name)}</h1>
    <p class="lead">${esc(p.intro)}</p>
  </div>
</section>

<div class="container">
  <dl class="title-block">
    <div><dt>${esc(p.capacity_label)}</dt><dd class="big">${esc(p.capacity)}</dd></div>
    <div><dt>Founder’s technical scope</dt><dd class="big">${esc(p.voltage)}</dd></div>
    <div><dt>Employer during involvement</dt><dd class="big">${esc(p.employer)}</dd></div>
    <div><dt>Location</dt><dd>${esc(p.location)}</dd></div>
    <div><dt>Discipline</dt><dd>${esc(p.discipline)}</dd></div>
    <div><dt>Profile</dt><dd>${no} of ${pad(projects.length)}<small>${esc(CATEGORIES[p.category])}</small></dd></div>
  </dl>
</div>

<div class="container project-layout">
  <aside class="project-sidebar">
    <p class="eyebrow">In this profile</p>
    <nav aria-label="Project sections">
      <a href="#overview">Project overview</a>
      <a href="#contribution">Project Role &amp; Responsibilities</a>
      <a href="#perspective">Engineering perspective</a>
      <a href="#sources">Sources &amp; notes</a>
    </nav>
    <a class="text-link" href="${root}contact.html?project=${p.slug}">Discuss a similar scope ${arrow}</a>
  </aside>

  <div class="project-story">
    <section id="overview">
      <p class="eyebrow">Public project context</p>
      <h2>Project overview</h2>
      <p class="large-copy">${esc(p.overview)}</p>
      <dl class="fact-list">
${facts}
      </dl>
      <p class="scope-note"><b>Note on figures</b>${esc(p.note)}</p>
    </section>

    <section id="contribution">
      <p class="eyebrow">Personal professional experience</p>
      <h2>Project Role &amp; Responsibilities</h2>
      <div class="role-line"><strong>${esc(p.role)}</strong><span>${esc(p.employer)}</span></div>
${work}
      <div class="tags">${tags}</div>
      <p class="fineprint">Personal scope is based on the founder’s CV and professional updates. Public project sources provide background and do not independently verify individual responsibilities.</p>
    </section>

    <section id="perspective" class="perspective">
      <p class="eyebrow">Engineering perspective</p>
      <h2>What this experience brings</h2>
      <p>${esc(p.perspective)}</p>
      <div class="related-services">${related}</div>
    </section>

    <section id="sources">
      <p class="eyebrow">References</p>
      <h2>Sources &amp; notes</h2>
      <ul class="source-list">
${sources}
      </ul>
      <p class="fineprint">Public sources reviewed ${esc(p.reviewed || SITE.defaultReviewed)}. Project figures and milestones are attributed to the linked publications; announced dates may change. Project names identify professional experience and do not imply endorsement or a commercial relationship with GridWave.</p>
    </section>
  </div>
</div>

<section class="next-project">
  <div class="container">
    <a href="${root}projects.html">← All projects</a>
    <a href="${next.slug}.html"><span class="eyebrow">Next project</span><strong>${esc(next.name)} →</strong></a>
  </div>
</section>`;

  return layout({
    file: `projects/${p.slug}.html`,
    title: `${p.name} — ${p.subtitle}`,
    description: p.intro,
    current: 'projects',
    root,
    body,
  });
}

/* ---------- Build ---------- */

const written = [];
function write(file, content) {
  const target = join(OUT, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
  written.push(file);
}

for (const name of readdirSync(join(SRC, 'pages')).filter((f) => f.endsWith('.html'))) {
  const raw = readFileSync(join(SRC, 'pages', name), 'utf8');
  const match = raw.match(/^<!--meta\s*([\s\S]*?)\s*-->/);
  if (!match) throw new Error(`${name}: missing <!--meta {...} --> header`);
  const meta = JSON.parse(match[1]);
  const root = meta.root ?? '';
  const tokens = {
    root,
    email: SITE.email,
    linkedin: SITE.linkedin,
    projectCount: projects.length,
    projectCountWord: NUMBER_WORDS[projects.length] ?? projects.length,
    projectRegister: register(projects, root),
    featuredRegister: register(SITE.featured.map((slug) => projects.find((p) => p.slug === slug)), root),
  };
  const body = raw.slice(match[0].length).replace(/\{\{(\w+)\}\}/g, (whole, key) => {
    if (!(key in tokens)) throw new Error(`${name}: unknown token ${whole}`);
    return tokens[key];
  });
  write(meta.file, layout({ ...meta, root, body }));
}

projects.forEach((p, i) => write(`projects/${p.slug}.html`, projectPage(p, i)));

const sitemapUrls = written
  .filter((f) => f !== '404.html')
  .sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.split('/').length - b.split('/').length || a.localeCompare(b)))
  .map((f) => `  <url><loc>${SITE.url}/${f === 'index.html' ? '' : f}</loc></url>`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`);

console.log(`Built ${written.length} files:\n` + written.map((f) => `  ${f}`).join('\n'));

buildLocales(OUT, SITE.url, written.filter((file) => file.endsWith('.html')));
