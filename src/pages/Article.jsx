import { useParams, useNavigate, useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { getArticle, formatArticleDate } from '../data/articles'
import Terminal from '../components/Terminal'
import { useI18n } from '../i18n/useI18n'
import NotFound from './NotFound'

function PreBlock({ children }) {
  const codeEl = children?.props ?? {}
  const text = Array.isArray(codeEl.children)
    ? codeEl.children.join('')
    : codeEl.children ?? ''
  const lang = /language-([\w-]+)/.exec(codeEl.className ?? '')?.[1]

  return <Terminal title={lang ?? 'code'}>{String(text)}</Terminal>
}

export default function Article() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang, t } = useI18n()

  const article = getArticle(slug, lang)

  useDocumentTitle(article ? article.meta.title : undefined)

  if (!article) return <NotFound />

  const goBack = () => {
    if (location.key === 'default') {
      navigate('/articles')
    } else {
      navigate(-1)
    }
  }

  return (
    <article className="content article-page">
      <h2><span className="prompt">~$</span> {article.meta.title}</h2>

      <p className="article-meta-line">
        <span className="article-date">{formatArticleDate(article.meta.dateObj, lang)}</span>
        <span className="article-sep" aria-hidden="true"> | </span>
        <span className="article-meta-id">#{article.slug}</span>
      </p>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ h1: 'h2', pre: PreBlock }}
      >
        {article.content}
      </ReactMarkdown>

      <button type="button" className="article-back" onClick={goBack}>{t('article.back')}</button>
    </article>
  )
}
