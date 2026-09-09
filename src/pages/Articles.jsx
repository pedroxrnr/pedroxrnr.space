import useDocumentTitle from '../hooks/useDocumentTitle'

export default function Articles() {
  useDocumentTitle('Articles')

  return (
    <section className="content">
      <h2><span className="prompt">~$</span> Articles</h2>

      <p>This page is under construction.</p>
    </section>
  )
}