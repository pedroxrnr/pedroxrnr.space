import { useI18n } from '../i18n/useI18n'

const MONTHS = {
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  en: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
}

const UPDATE_DATE = new Date(__LAST_UPDATE_ISO__)

function formatUpdateDate(date, lang) {
  const months = MONTHS[lang] ?? MONTHS.pt
  return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export default function Footer() {
  const { lang, t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <p className="footer-copy">&copy; {year} pedroxrnr. {t('footer.copyright')}</p>
      <p className="footer-updated">{t('footer.lastUpdate')}{formatUpdateDate(UPDATE_DATE, lang)}</p>
    </footer>
  )
}
