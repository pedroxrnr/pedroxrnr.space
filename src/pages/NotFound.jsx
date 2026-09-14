import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { useI18n } from '../i18n/useI18n'

export default function NotFound() {
  const { t } = useI18n()
  useDocumentTitle(t('notFound.documentTitle'))

  const path = typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <section className="content">
      <h2><span className="prompt">~$</span> {t('notFound.headingPrefix')}{path}</h2>

      <p>
        {t('notFound.beforeCode')}
        <code>cd ~</code>
        {t('notFound.afterCode')}
        <Link to="/">{t('notFound.homeLink')}</Link>
        {t('notFound.end')}
      </p>
    </section>
  )
}
