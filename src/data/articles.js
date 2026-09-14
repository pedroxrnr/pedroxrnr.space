import { parseFrontmatter } from '../utils/frontmatter'

const MONTHS = {
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  en: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
}

export function formatArticleDate(dateObj, lang = 'pt') {
  const months = MONTHS[lang] ?? MONTHS.pt
  const d = dateObj
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function parseArticleDate(date) {
  if (!date) return new Date(0)

  const br = /^(\d{1,2})\s+([a-z]{3})\s+(\d{4})$/i.exec(String(date))
  if (br) {
    const [, day, month, year] = br
    const key = month.toLowerCase()
    const monthIndex = MONTHS.pt.indexOf(key) !== -1 ? MONTHS.pt.indexOf(key) : MONTHS.en.indexOf(key)
    if (monthIndex !== -1) return new Date(Number(year), monthIndex, Number(day))
  }

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date))
  if (iso) {
    const [, year, month, day] = iso
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  const fallback = new Date(String(date))
  if (!Number.isNaN(fallback.getTime())) return fallback

  console.warn(`[articles] unrecognized date format: "${date}"`)
  return new Date(0)
}

const modules = import.meta.glob('../articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const slugFromPath = (path) => path.split('/').pop().replace(/\.md$/, '')

function parseArticleFile(path, raw) {
  const base = slugFromPath(path)
  const langMatch = /\.(pt|en)$/.exec(base)
  const slug = langMatch ? base.slice(0, -langMatch[0].length) : base
  const lang = langMatch ? langMatch[1] : null

  const { meta, content } = parseFrontmatter(raw)

  const missing = ['title', 'date', 'excerpt'].filter((key) => !meta[key])
  if (missing.length > 0) {
    console.warn(`[articles] "${base}" is missing frontmatter field(s): ${missing.join(', ')}`)
  }

  const articleDate = parseArticleDate(meta.date)

  return {
    slug,
    lang,
    meta: {
      ...meta,
      tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
      dateObj: articleDate,
      title: meta.title ?? slug,
      excerpt: meta.excerpt ?? '',
    },
    content,
  }
}

const articlesBySlug = new Map()

for (const [path, raw] of Object.entries(modules)) {
  const article = parseArticleFile(path, raw)
  const entry = articlesBySlug.get(article.slug) ?? {}

  if (article.lang) {
    entry[article.lang] = article
  } else {
    entry.pt = entry.pt ?? article
    entry.en = entry.en ?? article
  }

  articlesBySlug.set(article.slug, entry)
}

const localized = (entry, lang) => entry[lang] ?? entry.en ?? entry.pt

export function getArticles(lang = 'pt') {
  return [...articlesBySlug.values()]
    .map((entry) => localized(entry, lang))
    .filter(Boolean)
    .sort((a, b) => b.meta.dateObj - a.meta.dateObj)
}

export function getArticle(slug, lang = 'pt') {
  const entry = articlesBySlug.get(slug)
  return entry ? localized(entry, lang) : undefined
}

export function getAllTags(lang = 'pt') {
  return [...new Set(getArticles(lang).flatMap((article) => article.meta.tags))].sort()
}
