import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { getArticle } from '../data/articles'
import Terminal from '../components/Terminal'
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
  const article = getArticle(slug)

  useDocumentTitle(article ? article.meta.title : '404 — Article Not Found')

  if (!article) return <NotFound />

  return (
    <article className="content article-page">
      <h2><span className="prompt">~$</span> {article.meta.title}</h2>

      <p className="article-meta-line">
        <span className="article-date">{article.meta.dateLabel}</span>
        <span className="article-sep" aria-hidden="true"> | </span>
        <span className="article-meta-id">#{article.slug}</span>
      </p>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ h1: 'h2', pre: PreBlock }}
      >
        {article.content}
      </ReactMarkdown>

      <Link className="article-back" to="/articles">[ cd .. ]</Link>
    </article>
  )
}