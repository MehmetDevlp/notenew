import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageStore } from '../stores/usePageStore'

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate()
  const { createPage } = usePageStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K -> Search (Mock)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        console.log('Search triggered')
        // Open search modal logic would go here
      }

      // Ctrl + Shift + N -> New Page
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault()
        const id = createPage()
        navigate(`/page/${id}`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, createPage])
}
