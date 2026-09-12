import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('404 — Not Found')

  const path = typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <section className="content">
      <h2><span className="prompt">~$</span> command not found: {path}</h2>

      <p>
        The page you're looking for doesn't exist.
        Try <code>cd ~</code> and head back <Link to="/">home</Link>.
      </p>
    </section>
  )
}