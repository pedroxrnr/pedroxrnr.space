import { Link, useSearchParams } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import MatrixRain from '../components/MatrixRain'
import { getArticles, getAllTags, formatArticleDate } from '../data/articles'
import { useI18n } from '../i18n/useI18n'

const ITEMS_FIRST_PAGE = 5
const ITEMS_PER_PAGE = 10

export default function Articles() {
  const { lang, t } = useI18n()
  useDocumentTitle(t('articles.documentTitle'))

  const [searchParams, setSearchParams] = useSearchParams()
  const tag = searchParams.get('tag') || null

  const articles = getArticles(lang)
  const allTags = getAllTags(lang)

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
    if (tag) next.tag = tag
    if (n > 1) next.page = String(n)
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const changeTag = (nextTag) => {
    const next = {}
    if (nextTag) next.tag = nextTag
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="content">
      <h2>
        <span className="prompt">~$</span> {t('articles.heading')}
      </h2>

      {page === 1 && <MatrixRain />}

      <p>{t('articles.intro')}</p>

      {articles.length === 0 ? (
        <p className="articles-empty">{t('articles.empty')}</p>
      ) : (
        <>
          <div className="article-filters" role="group" aria-label={t('articles.filterAria')}>
            <button
              type="button"
              className={tag === null ? 'filter-chip active' : 'filter-chip'}
              aria-pressed={tag === null}
              onClick={() => changeTag(null)}
            >
              {t('articles.all')}
            </button>
            {allTags.map((item) => (
              <button
                type="button"
                key={item}
                className={tag === item ? 'filter-chip active' : 'filter-chip'}
                aria-pressed={tag === item}
                onClick={() => changeTag(tag === item ? null : item)}
              >
                {item}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="articles-empty">{t('articles.noMatch', { tag })}</p>
          ) : (
            <>
              <div className="articles-list" key={page}>
                {pageItems.map((article) => (
                  <article className="article-item" key={article.slug}>
                    <Link className="article-item-main" to={`/articles/${article.slug}`}>
                      <span className="article-item-head">
                        <span className="article-item-title">{article.meta.title}</span>
                        <span className="article-date">
                          {formatArticleDate(article.meta.dateObj, lang)}
                        </span>
                      </span>
                      <span className="article-excerpt">{article.meta.excerpt}</span>
                    </Link>
                    <div className="article-item-tags">
                      {article.meta.tags.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className="article-tag"
                          aria-pressed={tag === item}
                          onClick={() => changeTag(tag === item ? null : item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="pagination" aria-label={t('articles.paginationAria')}>
                  <button
                    type="button"
                    className="filter-chip"
                    disabled={page === 1}
                    onClick={() => goToPage(page - 1)}
                  >
                    {t('articles.prev')}
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
                    {t('articles.next')}
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
