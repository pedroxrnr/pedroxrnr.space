import { Link, useLocation } from 'react-router-dom'

export default function Header({ theme, onToggleTheme }) {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Home', num: '01' },
    { to: '/projects', label: 'Projects', num: '02' },
    { to: '/articles', label: 'Articles', num: '03' },
    { to: '/about', label: 'About', num: '04' },
  ]

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
            {links.map(({ to, label, num }) => (
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