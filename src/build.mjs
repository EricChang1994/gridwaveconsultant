// Personal site generator — no dependencies.
//
//   node src/build.mjs
//
// Reads src/pages/*.html (page bodies) and src/projects.json (project data),
// wraps them in the shared header/footer and writes finished static HTML to
// the repository root, which is what GitHub Pages serves.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = dirname(fileURLToPath(import.meta.url));
const OUT = join(SRC, '..');

const SITE = {
  // Public address of the site, without a trailing slash, e.g. 'https://ericchang.dev'
  // or 'https://<user>.github.io/<repo>'. Leave empty until it is known: canonical
  // links, social-preview URLs and sitemap.xml are only written when this is set.
  url: '',
  name: 'Eric Chang, PE, PMP',
  fullName: 'Wen Jui (Eric) Chang',
  role: 'HV & Power Infrastructure Engineer',
  email: 'ericchangpe@gmail.com',
  linkedin: 'https://www.linkedin.com/in/wen-jui-eric-chang-pe-pmp-022a58127',
  year: 2026,
  defaultReviewed: '12 October 2026',
  featured: ['east-anglia-one-north', 'fengmiao', 'greater-changhua-1-2a'],
};

const FOCUS = {
  'owners-engineering': 'Requirements & technical review',
  'package-management': 'HV package engineering',
  'commissioning': 'Commissioning & energization',
  'interface-advisory': 'Interface coordination',
};
const CATEGORIES = { offshore: 'Offshore wind', grid: 'Grid integration', operations: 'Operations' };
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const arrow = '<span class="arr" aria-hidden="true">→</span>';

const projects = JSON.parse(readFileSync(join(SRC, 'projects.json'), 'utf8'));

/* ---------- Shared chrome ---------- */

const brand = (root) => `<a class="brand" href="${root}index.html" aria-label="Eric Chang — home">
        <svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="6" fill="#0b2434"/><path d="M10 18h16v6H16v5h9v6h-9v5h10v6H10z" fill="#62d2cd"/><path d="M54 23a13 13 0 1 0 0 18" fill="none" stroke="#62d2cd" stroke-width="6"/></svg>
        <span class="brand-text"><b>Eric Chang</b><small>PE · PMP® · HV Engineer</small></span>
      </a>`;

function layout({ file, title, fullTitle, ogTitle, description, current = '', root = '', body, noindex = false, cta = true }) {
  const pageTitle = fullTitle || `${title} | ${SITE.name}`;
  const og = ogTitle || pageTitle;
  const canonical = SITE.url ? `${SITE.url}/${file === 'index.html' ? '' : file}` : '';
  const navLink = (key, href, label) =>
    `<a href="${root}${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;
  const jsonLd = file === 'index.html' ? `
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.fullName,
    alternateName: 'Eric Chang',
    jobTitle: SITE.role,
    honorificSuffix: 'PE, PMP',
    ...(SITE.url ? { url: SITE.url, image: `${SITE.url}/assets/eric-chang.webp` } : {}),
    sameAs: [SITE.linkedin],
  })}</script>` : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(description)}">${noindex ? '\n  <meta name="robots" content="noindex">' : ''}
  <meta name="author" content="${SITE.fullName}">
  <meta name="theme-color" content="#0b2434">${canonical ? `\n  <link rel="canonical" href="${canonical}">` : ''}
  <meta property="og:type" content="${file === 'index.html' ? 'profile' : 'website'}">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:title" content="${esc(og)}">
  <meta property="og:description" content="${esc(description)}">${canonical ? `\n  <meta property="og:url" content="${canonical}">\n  <meta property="og:image" content="${SITE.url}/assets/offshore-substation-yard.webp">\n  <meta name="twitter:card" content="summary_large_image">` : ''}
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
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu <i aria-hidden="true"></i></button>
      <nav id="primary-nav" aria-label="Main navigation">
        ${navLink('focus', 'focus.html', 'Focus areas')}
        ${navLink('expertise', 'expertise.html', 'Expertise')}
        ${navLink('projects', 'projects.html', 'Experience')}
        ${navLink('about', 'about.html', 'About')}
        <a class="nav-cta" href="${root}contact.html"${current === 'contact' ? ' aria-current="page"' : ''}>Get in touch <span aria-hidden="true">→</span></a>
      </nav>
    </div>
  </header>

  <main id="main">
${body.trim()}
${cta ? `
<section class="cta-band">
  <div class="container cta-inner">
    <div>
      <p class="eyebrow">Get in touch</p>
      <h2>Working on an HV scope? I’m happy to compare notes.</h2>
    </div>
    <a class="button light" href="${root}contact.html">Contact me ${arrow}</a>
  </div>
</section>` : ''}
  </main>

  <footer>
    <div class="container footer-grid">
      <div>
        ${brand(root)}
        <p>High-voltage engineering,<br>from concept to connection.</p>
      </div>
      <div>
        <p class="eyebrow">Explore</p>
        <a href="${root}focus.html">Focus areas</a>
        <a href="${root}expertise.html">Technical expertise</a>
        <a href="${root}projects.html">Project experience</a>
        <a href="${root}about.html">About me</a>
      </div>
      <div>
        <p class="eyebrow">Connect</p>
        <a href="mailto:${SITE.email}">${SITE.email}</a>
        <a href="${SITE.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        <a href="${root}contact.html">Contact</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${SITE.year} ${SITE.fullName}</span>
      <span>Personal site · views are my own</span>
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
  return `<div class="register-head" aria-hidden="true"><span>No.</span><span>Project</span><span>My scope</span><span>Location</span><span>Scale / period</span><span></span></div>
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
    .map((s) => `<a href="${root}focus.html#${s}">${esc(FOCUS[s])} →</a>`).join('');
  const sources = p.sources
    .map(([org, label, url]) => `          <li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(org)} ↗</strong><span>${esc(label)}</span></a></li>`).join('\n');

  const body = `
<section class="project-heading gridded">
  <div class="container">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${root}index.html">Home</a><span aria-hidden="true">/</span><a href="${root}projects.html">Experience</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></nav>
    <p class="eyebrow">Project ${no} / ${esc(p.country)} / ${esc(p.subtitle)}</p>
    <h1>${esc(p.name)}</h1>
    <p class="lead">${esc(p.intro)}</p>
  </div>
</section>

<div class="container">
  <dl class="title-block">
    <div><dt>${esc(p.capacity_label)}</dt><dd class="big">${esc(p.capacity)}</dd></div>
    <div><dt>My technical scope</dt><dd class="big">${esc(p.voltage)}</dd></div>
    <div><dt>Employer</dt><dd class="big">${esc(p.employer)}</dd></div>
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
      <a href="#contribution">My contribution</a>
      <a href="#perspective">Engineering perspective</a>
      <a href="#sources">Sources &amp; notes</a>
    </nav>
    <a class="text-link" href="${root}contact.html?project=${p.slug}">Ask about this work ${arrow}</a>
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
      <p class="eyebrow">My role</p>
      <h2>My contribution</h2>
      <div class="role-line"><strong>${esc(p.role)}</strong><span>${esc(p.employer)}</span></div>
${work}
      <div class="tags">${tags}</div>
      <p class="fineprint">This describes my own scope while employed at ${esc(p.employer)}. Public project sources provide background and do not independently verify individual responsibilities.</p>
    </section>

    <section id="perspective" class="perspective">
      <p class="eyebrow">Engineering perspective</p>
      <h2>What I took from it</h2>
      <p>${esc(p.perspective)}</p>
      <div class="related-services">${related}</div>
    </section>

    <section id="sources">
      <p class="eyebrow">References</p>
      <h2>Sources &amp; notes</h2>
      <ul class="source-list">
${sources}
      </ul>
      <p class="fineprint">Public sources reviewed ${esc(p.reviewed || SITE.defaultReviewed)}. Project figures and milestones are attributed to the linked publications; announced dates may change. Project and company names identify my professional experience and do not imply endorsement by, or that I speak for, those organisations.</p>
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
  // 404.html is served for any missing path, at any depth, so once the public
  // address is known its links are written from the site's base path instead.
  const root = meta.file === '404.html' && SITE.url ? new URL(`${SITE.url}/`).pathname : (meta.root ?? '');
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

const pages = written.filter((f) => f !== '404.html');
if (SITE.url) {
  const urls = pages
    .sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.split('/').length - b.split('/').length || a.localeCompare(b)))
    .map((f) => `  <url><loc>${SITE.url}/${f === 'index.html' ? '' : f}</loc></url>`);
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`);
} else {
  write('robots.txt', 'User-agent: *\nAllow: /\n');
  console.log('Note: SITE.url is empty — canonical links and sitemap.xml were skipped.');
}

console.log(`Built ${written.length} files:\n` + written.map((f) => `  ${f}`).join('\n'));
