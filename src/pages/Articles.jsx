import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import MatrixRain from '../components/MatrixRain'
import { articles, allTags } from '../data/articles'

const ITEMS_FIRST_PAGE = 5
const ITEMS_PER_PAGE = 10

export default function Articles() {
  useDocumentTitle('Articles')

  const [searchParams, setSearchParams] = useSearchParams()
  const [tag, setTag] = useState(null)

  const filtered = tag ? articles.filter((a) => a.meta.tags.includes(tag)) : articles

  const requestedPage = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const totalPages = filtered.length <= ITEMS_FIRST_PAGE
    ? 1
    : 1 + Math.ceil((filtered.length - ITEMS_FIRST_PAGE) / ITEMS_PER_PAGE)
  const page = Math.min(requestedPage, totalPages)
  const pageItems =
    page === 1
      ? filtered.slice(0, ITEMS_FIRST_PAGE)
      : filtered.slice(
          ITEMS_FIRST_PAGE + (page - 2) * ITEMS_PER_PAGE,
          ITEMS_FIRST_PAGE + (page - 2) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )

  const goToPage = (n) => {
    const next = {}
    if (n > 1) next.page = String(n)
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const changeTag = (t) => {
    setTag(t)
    setSearchParams({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="content">
      <h2>
        <span className="prompt">~$</span> Articles
      </h2>

      {page === 1 && <MatrixRain />}

      <p>Writeups and notes about cybersecurity, computers, or any other subject.</p>

      {articles.length === 0 ? (
        <p className="articles-empty">No articles yet — check back soon.</p>
      ) : (
        <>
          <div className="article-filters" role="group" aria-label="Filter articles by tag">
            <button
              type="button"
              className={tag === null ? 'filter-chip active' : 'filter-chip'}
              aria-pressed={tag === null}
              onClick={() => changeTag(null)}
            >
              all
            </button>
            {allTags.map((t) => (
              <button
                type="button"
                key={t}
                className={tag === t ? 'filter-chip active' : 'filter-chip'}
                aria-pressed={tag === t}
                onClick={() => changeTag(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="articles-empty">No articles match the "{tag}" tag.</p>
          ) : (
            <>
              <div className="articles-list" key={page}>
                {pageItems.map((article) => (
                  <article className="article-item" key={article.slug}>
                    <div className="article-item-head">
                      <h3>
                        <Link to={`/articles/${article.slug}`}>{article.meta.title}</Link>
                      </h3>
                      <span className="article-date">{article.meta.dateLabel}</span>
                    </div>
                    <p className="article-excerpt">{article.meta.excerpt}</p>
                    <div className="article-item-tags">
                      {article.meta.tags.map((t) => (
                        <button
                          type="button"
                          key={t}
                          className="article-tag"
                          aria-pressed={tag === t}
                          onClick={() => changeTag(tag === t ? null : t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="pagination" aria-label="Pagination">
                  <button
                    type="button"
                    className="filter-chip"
                    disabled={page === 1}
                    onClick={() => goToPage(page - 1)}
                  >
                    prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      type="button"
                      key={num}
                      className={`filter-chip${num === page ? ' active' : ''}`}
                      aria-current={num === page ? 'page' : undefined}
                      onClick={() => goToPage(num)}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="filter-chip"
                    disabled={page === totalPages}
                    onClick={() => goToPage(page + 1)}
                  >
                    next
                  </button>
                </nav>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}
