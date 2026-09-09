import useDocumentTitle from '../hooks/useDocumentTitle'

export default function About() {
  useDocumentTitle('About')

  return (
    <section className="content">
      <h2><span className="prompt">~$</span> About</h2>

      <p>This page is under construction.</p>
    </section>
  )
}