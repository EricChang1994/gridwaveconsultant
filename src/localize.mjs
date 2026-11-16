// Builds static English and Traditional Chinese pages. No runtime dependencies.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
const translations = JSON.parse(readFileSync(new URL('./zh-TW.json', import.meta.url), 'utf8'));
const decode = (text) => text.replace(/&(?:amp|lt|gt|quot|apos|#39|#\d+|#x[\da-f]+);/gi, (entity) => {
  const named = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&#39;': "'" };
  if (named[entity]) return named[entity];
  return String.fromCodePoint(parseInt(entity.slice(entity[2] === 'x' ? 3 : 2, -1), entity[2] === 'x' ? 16 : 10));
});
const escapeText = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const translate = (raw) => {
  const text = decode(raw).trim();
  const translated = translations[text];
  return translated ? raw.replace(/\S[\s\S]*\S|\S/, escapeText(translated)) : raw;
};
const pageUrl = (origin, file, locale) => `${origin}/${locale === 'zh-TW' ? 'zh-TW/' : ''}${file === 'index.html' ? '' : file}`;

export function buildLocales(out, origin, pages) {
  const missing = new Set();
  for (const file of pages) {
    const alternate = `\n  <link rel="alternate" hreflang="en" href="${pageUrl(origin, file, 'en')}">\n  <link rel="alternate" hreflang="zh-TW" href="${pageUrl(origin, file, 'zh-TW')}">\n  <link rel="alternate" hreflang="x-default" href="${pageUrl(origin, file, 'en')}">`;
    let english = readFileSync(join(out, file), 'utf8').replace(/(<link rel="canonical"[^>]*>)/, `$1${alternate}`);
    english = english.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, open, body, close) => {
      const data = JSON.parse(body);
      data.availableLanguage = ['English', 'Traditional Chinese'];
      data.inLanguage = 'en';
      return open + JSON.stringify(data) + close;
    });
    writeFileSync(join(out, file), english);
    const chineseFile = `zh-TW/${file}`;
    const relativeLink = (value) => {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) return value;
      const target = new URL(value, `https://local.invalid/${file}`);
      let path = target.pathname.slice(1);
      if (!path || path.endsWith('/')) path += 'index.html';
      if (pages.includes(path)) path = `zh-TW/${path}`;
      return posix.relative(posix.dirname(chineseFile), path) + target.search + target.hash;
    };
    const chinese = english.replace(/<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<[^>]+>|[^<]+/gi, (token) => {
      if (token.startsWith('<!--') || /^<style\b/i.test(token)) return token;
      if (/^<script\b/i.test(token)) {
        if (/application\/ld\+json/.test(token)) return token.replace(/>([\s\S]*?)<\/script>/, (_, body) => {
          const data = JSON.parse(body);
          data.url = pageUrl(origin, file, 'zh-TW');
          data.description = translations[data.description] || data.description;
          data.inLanguage = 'zh-TW';
          return `>${JSON.stringify(data)}</script>`;
        });
        return token.replace(/\bsrc="([^"]*)"/g, (_, value) => `src="${relativeLink(value)}"`);
      }
      if (token.startsWith('<')) {
        if (/^<html\b/.test(token)) return token.replace('lang="en"', 'lang="zh-TW"');
        const language = token.match(/data-language="([^"]+)"/)?.[1];
        if (language) {
          token = token.replace(/ aria-current="true"/, '');
          if (language === 'zh-TW') token = token.replace(/>$/, ' aria-current="true">');
        }
        const alternate = /rel="alternate"/.test(token);
        const canonical = /rel="canonical"/.test(token);
        const ogUrl = /property="og:url"/.test(token);
        return token.replace(/\b(href|src|alt|aria-label|placeholder|content|data-search)="([^"]*)"/g, (_, attr, value) => {
          if (attr === 'href' || attr === 'src') {
            if (language) value = posix.relative(posix.dirname(chineseFile), `${language === 'zh-TW' ? 'zh-TW/' : ''}${file}`);
            else if (canonical) value = pageUrl(origin, file, 'zh-TW');
            else if (!alternate) value = relativeLink(value);
          } else if (attr === 'content' && ogUrl) value = pageUrl(origin, file, 'zh-TW');
          else if (attr === 'data-search') {
            const original = decode(value);
            value += ' ' + escapeText(Object.entries(translations).filter(([en, zh]) => en !== zh && en.length > 3 && original.includes(en)).map(([, zh]) => zh).join(' '));
          } else if (attr !== 'content' || /(?:name="description"|property="og:(?:title|description)")/.test(token)) value = translate(value);
          return `${attr}="${value}"`;
        });
      }
      const text = decode(token).trim();
      if (/[A-Za-z]/.test(text) && !(text in translations) && !/^[\d.\s×–/+—-]*(?:MW|GW|kV)?$/.test(text)) missing.add(text);
      return translate(token);
    });
    const target = join(out, chineseFile);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, chinese);
  }
  if (missing.size) throw new Error(`Missing Traditional Chinese translations: ${JSON.stringify([...missing])}`);
  const urls = pages.filter((file) => file !== '404.html').map((file) => ['en', 'zh-TW'].map((locale) => `  <url><loc>${pageUrl(origin, file, locale)}</loc><xhtml:link rel="alternate" hreflang="en" href="${pageUrl(origin, file, 'en')}"/><xhtml:link rel="alternate" hreflang="zh-TW" href="${pageUrl(origin, file, 'zh-TW')}"/></url>`).join('\n')).join('\n');
  writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`);
  console.log(`Built ${pages.length} English + ${pages.length} Traditional Chinese pages.`);
}
