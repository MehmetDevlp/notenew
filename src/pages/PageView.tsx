import React from 'react'
import { useParams } from 'react-router-dom'
import { usePageStore } from '@/stores/usePageStore'
import { NotionEditor } from '@/components/editor/NotionEditor'
import { TableView } from '@/components/database/TableView'
import { TemplateSelector } from '@/components/editor/TemplateSelector'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export const PageView = () => {
  const { id } = useParams()
  const { pages, updatePageTitle, updatePageContent, convertPageToDatabase, toggleFavorite } = usePageStore()
  
  if (!id) return null
  const page = pages[id]
  
  if (!page) {
    return <div className="p-12 text-notion-muted">Sayfa bulunamadı</div>
  }

  const renderContent = () => {
    if (page.isDatabase) {
      return <TableView pageId={id} />
    }

    if (page.blocks.length === 0) {
      return (
        <TemplateSelector 
          onSelect={(type) => {
            if (type === 'database') {
              convertPageToDatabase(id)
            } else {
              // Initialize with an empty paragraph for BlockNote
              updatePageContent(id, [{ type: "paragraph", content: "" }])
            }
          }} 
        />
      )
    }

    return <NotionEditor pageId={id} />
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Sticky Breadcrumbs Header */}
      <div className="sticky top-0 z-50 bg-notion-bg/95 backdrop-blur-sm px-4 py-2 border-b border-transparent transition-all flex items-center justify-between">
          <Breadcrumbs pageId={id} />
          
          <div className="flex items-center gap-2">
              <button 
                  onClick={() => toggleFavorite(id)}
                  className="p-1 hover:bg-notion-panel rounded text-notion-muted hover:text-notion-text transition-colors"
                  title={page.isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              >
                  <Star 
                      size={18} 
                      fill={page.isFavorite ? "#EAB308" : "none"} 
                      className={cn(page.isFavorite ? "text-yellow-500" : "text-notion-muted")}
                  />
              </button>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Cover Image Placeholder */}
        <div className="h-32 group relative cursor-pointer opacity-10 hover:bg-notion-panel transition-colors">
           {/* Could add change cover button here */}
        </div>

        <div className="max-w-4xl mx-auto px-12 py-8 pb-32">
          {/* Icon & Title */}
          <div className="mb-8 group">
             <div className="text-6xl mb-4 hover:bg-notion-panel w-fit rounded p-2 cursor-pointer">{page.icon || '📄'}</div>
             
             <input 
               value={page.title}
               onChange={(e) => updatePageTitle(id, e.target.value)}
               placeholder="Adsız"
               className="text-4xl font-bold bg-transparent border-none outline-none w-full text-notion-text placeholder:text-notion-muted/20"
             />
          </div>

          {/* Content Switcher */}
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
