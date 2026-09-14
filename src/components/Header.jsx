import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../nav'
import { useI18n } from '../i18n/useI18n'

export default function Header({ theme, onToggleTheme }) {
  const { pathname } = useLocation()
  const { lang, toggleLang, t } = useI18n()

  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  return (
    <header className="header">
      <div className="profile">
        <h1>
          <Link to="/">PEDRØXRNR</Link>
        </h1>
      </div>
      <div className="nav-group">
        <nav className="nav-links" aria-label={t('header.mainNav')}>
          <ul>
            {NAV_LINKS.map(({ to, key, num }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={isActive(to) ? 'active' : undefined}
                  aria-current={isActive(to) ? 'page' : undefined}
                >
                  <span className="link-num">{num}./</span>{t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <span className="separator">│</span>
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-pressed={theme === 'light'}
          aria-label={theme === 'dark' ? t('header.themeToLight') : t('header.themeToDark')}
        >
          [{theme === 'dark' ? 'DARK' : 'LIGHT'}]
        </button>
        <button
          className="theme-toggle lang-toggle"
          type="button"
          onClick={toggleLang}
          aria-pressed={lang === 'en'}
          aria-label={lang === 'pt' ? t('header.langToEn') : t('header.langToPt')}
        >
          [{lang === 'pt' ? 'PT-BR' : 'EN'}]
        </button>
      </div>
      <hr />
    </header>
  )
}
