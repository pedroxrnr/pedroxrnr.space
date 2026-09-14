import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { en } from './en'
import { pt } from './pt'

export const LanguageContext = createContext(null)

const DICTIONARIES = { pt, en }
const DEFAULT_LANG = 'pt'

function getInitialLang() {
  try {
    const stored = localStorage.getItem('lang')
    if (stored === 'pt' || stored === 'en') return stored
  } catch {
    // localStorage unavailable (private mode, etc.)
  }
  return DEFAULT_LANG
}

function resolve(dict, path) {
  return path
    .split('.')
    .reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), dict)
}

function interpolate(template, vars) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, key) => (vars[key] ?? `{${key}}`))
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  const toggleLang = useCallback(() => {
    setLang((current) => (current === 'pt' ? 'en' : 'pt'))
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    try {
      localStorage.setItem('lang', lang)
    } catch {
      // localStorage unavailable (private mode, etc.)
    }
  }, [lang])

  const t = useCallback(
    (path, vars) => {
      const value = resolve(DICTIONARIES[lang], path)
      const fallback = resolve(DICTIONARIES.en, path)
      const template =
        typeof value === 'string' ? value : typeof fallback === 'string' ? fallback : path
      return interpolate(template, vars)
    },
    [lang]
  )

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, toggleLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
