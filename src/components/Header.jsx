import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/articles', label: 'Articles' },
    { to: '/about', label: 'About' },
  ]

  return (
    <header className="header">
      <div className="profile">
        <h1>
          <Link to="/">PEDRØXRNR</Link>
        </h1>
      </div>
      <nav className="nav-links">
        <ul>
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                aria-current={pathname === to ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
