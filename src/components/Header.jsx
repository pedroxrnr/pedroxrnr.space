import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../nav'

export default function Header({ theme, onToggleTheme }) {
  const { pathname } = useLocation()

  return (
    <header className="header">
      <div className="profile">
        <h1>
          <Link to="/">PEDRØXRNR</Link>
        </h1>
      </div>
      <div className="nav-group">
        <nav className="nav-links" aria-label="Main">
          <ul>
            {NAV_LINKS.map(({ to, label, num }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={pathname === to ? 'active' : undefined}
                  aria-current={pathname === to ? 'page' : undefined}
                >
                  <span className="link-num">{num}./</span>{label}
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
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          [{theme === 'dark' ? 'DARK' : 'LIGHT'}]
        </button>
      </div>
      <hr />
    </header>
  )
}