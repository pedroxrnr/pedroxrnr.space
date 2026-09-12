import { parseFrontmatter } from '../utils/frontmatter'

const MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatArticleDate(dateObj) {
  const d = dateObj
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_PT[d.getMonth()]} ${d.getFullYear()}`
}

function parseArticleDate(date) {
  if (!date) return new Date(0)

  const br = /^(\d{1,2})\s+([a-z]{3})\s+(\d{4})$/i.exec(String(date))
  if (br) {
    const [, day, month, year] = br
    const monthIndex = MONTHS_PT.indexOf(month.toLowerCase())
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

export const articles = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = slugFromPath(path)
    const { meta, content } = parseFrontmatter(raw)

    const missing = ['title', 'date', 'excerpt'].filter((key) => !meta[key])
    if (missing.length > 0) {
      console.warn(`[articles] "${slug}" is missing frontmatter field(s): ${missing.join(', ')}`)
    }

    const articleDate = parseArticleDate(meta.date)

    return {
      slug,
      meta: {
        ...meta,
        tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
        dateObj: articleDate,
        dateLabel: formatArticleDate(articleDate),
        title: meta.title ?? slug,
        excerpt: meta.excerpt ?? '',
      },
      content,
    }
  })
  .sort((a, b) => b.meta.dateObj - a.meta.dateObj)

export const getArticle = (slug) => articles.find((article) => article.slug === slug)

export const allTags = [...new Set(articles.flatMap((article) => article.meta.tags))].sort()