import { useEffect } from 'react'

export default function useDocumentTitle(title) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title ? `${title} | PEDRØXRNR` : 'PEDRØXRNR'
    return () => {
      document.title = previousTitle
    }
  }, [title])
}