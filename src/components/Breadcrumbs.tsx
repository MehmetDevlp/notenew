import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageStore } from '../stores/usePageStore'
import { ChevronRight, FileText, Database } from 'lucide-react'
import { cn } from '../lib/utils'

interface BreadcrumbsProps {
  pageId: string
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ pageId }) => {
  const navigate = useNavigate()
  const { pages } = usePageStore()
  
  // Traverse up to find path
  const path = React.useMemo(() => {
    const result = []
    let currentId: string | null | undefined = pageId
    
    while (currentId && pages[currentId]) {
      result.unshift(pages[currentId])
      currentId = pages[currentId].parentId
    }
    
    return result
  }, [pageId, pages])

  if (path.length === 0) return null

  return (
    <div className="flex items-center gap-1 text-sm text-notion-muted mb-6 select-none overflow-hidden whitespace-nowrap">
      {path.map((page, index) => {
        const isLast = index === path.length - 1
        
        return (
          <React.Fragment key={page.id}>
            {index > 0 && (
              <ChevronRight size={14} className="text-notion-muted/50 shrink-0" />
            )}
            
            <div 
              onClick={() => !isLast && navigate(`/page/${page.id}`)}
              className={cn(
                "flex items-center gap-1.5 px-1 py-0.5 rounded transition-colors cursor-pointer truncate max-w-[150px]",
                isLast 
                  ? "text-notion-text font-medium cursor-default pointer-events-none" 
                  : "hover:bg-notion-panel hover:text-notion-text"
              )}
            >
              <span className="shrink-0 text-xs">
                 {page.icon ? page.icon : (page.isDatabase ? <Database size={12} className="text-blue-400"/> : <FileText size={12} />)}
              </span>
              <span className="truncate">
                {page.title || 'Adsız'}
              </span>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}
