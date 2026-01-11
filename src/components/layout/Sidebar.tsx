import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageStore } from '../../stores/usePageStore'
import { cn } from '../../lib/utils'
import { 
  ChevronRight, 
  ChevronDown,
  FileText, 
  Plus, 
  MoreHorizontal, 
  Search, 
  Settings,
  Database,
  Home,
  Star,
  Trash2,
  RefreshCw,
  X
} from 'lucide-react'

export const Sidebar = () => {
  const navigate = useNavigate()
  const { pages, sidebarTree, activePageId, createPage, setActivePage, moveToTrash, restoreFromTrash, permanentlyDelete, toggleFavorite } = usePageStore()
  
  // Sections toggle state
  const [favoritesOpen, setFavoritesOpen] = useState(true)
  const [privateOpen, setPrivateOpen] = useState(true)
  const [trashOpen, setTrashOpen] = useState(false)

  const handleCreate = (parentId?: string) => {
    const newId = createPage(parentId)
    navigate(`/page/${newId}`)
    setActivePage(newId)
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    // Soft delete (Move to Trash)
    moveToTrash(id)
    if (activePageId === id) {
        navigate('/')
    }
  }

  const handleFavorite = (e: React.MouseEvent, id: string) => {
      e.stopPropagation()
      toggleFavorite(id)
  }

  // Filter out archived pages from main views
  const favorites = Object.values(pages).filter(p => p.isFavorite && !p.isArchived)
  const rootPages = sidebarTree.map(id => pages[id]).filter(p => p && !p.isArchived)
  const trashPages = Object.values(pages).filter(p => p.isArchived)

  const SidebarItem = ({ pageId, level = 0 }: { pageId: string, level?: number }) => {
    const page = pages[pageId]
    if (!page || page.isArchived) return null

    const [isOpen, setIsOpen] = useState(false)
    const children = Object.values(pages).filter(p => p.parentId === pageId && !p.isArchived)
    const hasChildren = children.length > 0

    const handleExpand = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(!isOpen)
    }

    return (
      <div>
        <div 
          onClick={() => {
            navigate(`/page/${page.id}`)
            setActivePage(page.id)
          }}
          className={cn(
            "group flex items-center gap-2 px-3 py-1 min-h-[28px] rounded-sm cursor-pointer text-sm mx-1 transition-colors select-none",
            activePageId === page.id ? "bg-notion-panel text-notion-text font-medium" : "text-notion-muted hover:bg-notion-panel hover:text-notion-text"
          )}
          style={{ paddingLeft: `${level * 12 + 12}px` }}
        >
          <div 
            className={cn("flex items-center justify-center w-4 h-4 shrink-0 rounded transition-colors", hasChildren ? "hover:bg-notion-border text-notion-muted" : "opacity-0 group-hover:opacity-100")}
            onClick={hasChildren ? handleExpand : undefined}
          >
              {hasChildren ? (
                  isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />
              ) : (
                  <div className="w-1 h-1 rounded-full bg-notion-muted/50" />
              )}
          </div>
          
          {page.icon ? (
              <span className="text-sm shrink-0">{page.icon}</span>
          ) : (
              page.isDatabase ? <Database size={14} className="text-blue-400 shrink-0"/> : <FileText size={14} className="shrink-0" />
          )}
          
          <span className="truncate flex-1">{page.title || 'Adsız'}</span>
          
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5">
             <div onClick={(e) => handleDelete(e, page.id)} className="p-1 hover:bg-notion-border rounded text-notion-muted hover:text-red-400" title="Çöp Kutusuna Taşı">
                <Trash2 size={12} />
             </div>
             <div onClick={(e) => handleFavorite(e, page.id)} className={cn("p-1 hover:bg-notion-border rounded text-notion-muted hover:text-yellow-400", page.isFavorite && "text-yellow-400 opacity-100")}>
                <Star size={12} fill={page.isFavorite ? "currentColor" : "none"} />
             </div>
             <div 
                className="p-1 hover:bg-notion-border rounded text-notion-muted"
                onClick={(e) => {
                    e.stopPropagation()
                    handleCreate(page.id)
                    setIsOpen(true)
                }}
             >
                <Plus size={12} />
             </div>
          </div>
        </div>
        
        {isOpen && hasChildren && (
            <div>
                {children.map(child => <SidebarItem key={child.id} pageId={child.id} level={level + 1} />)}
            </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-notion-bg w-full border-r border-notion-border select-none relative">
      {/* Workspace Switcher */}
      <div className="h-12 flex items-center px-3 hover:bg-notion-panel cursor-pointer transition-colors m-1 rounded-md gap-2 group">
        <div className="w-5 h-5 bg-orange-500 rounded text-[10px] flex items-center justify-center text-white font-bold shrink-0">M</div>
        <span className="text-sm font-medium text-notion-text truncate flex-1">Mehmet'in Notion'u</span>
        <div className="w-4 h-4 rounded border border-notion-text/20 flex items-center justify-center text-[10px] text-notion-muted group-hover:border-notion-text/50">
            v1
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-2 mb-4 space-y-0.5">
        <div className="flex items-center gap-3 px-3 py-1 text-notion-muted hover:bg-notion-panel hover:text-notion-text rounded-sm cursor-pointer text-sm transition-colors">
          <Search size={16} />
          <span className="font-medium">Ara</span>
          <span className="ml-auto text-xs opacity-50 border border-notion-border px-1 rounded">Ctrl K</span>
        </div>
        <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-1 text-notion-muted hover:bg-notion-panel hover:text-notion-text rounded-sm cursor-pointer text-sm transition-colors"
        >
          <Home size={16} />
          <span className="font-medium">Ana Sayfa</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-1 text-notion-muted hover:bg-notion-panel hover:text-notion-text rounded-sm cursor-pointer text-sm transition-colors">
          <Settings size={16} />
          <span className="font-medium">Ayarlar</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Favorites Section */}
        {favorites.length > 0 && (
            <div className="mb-4">
                <div 
                    className="flex items-center px-3 py-1 text-xs font-semibold text-notion-muted hover:text-notion-text cursor-pointer mb-0.5 group"
                    onClick={() => setFavoritesOpen(!favoritesOpen)}
                >
                    <span className="flex-1">Favoriler</span>
                </div>
                {favoritesOpen && (
                    <div>
                        {favorites.map(page => (
                            <SidebarItem key={page.id} pageId={page.id} />
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* Private Section */}
        <div>
            <div 
                className="flex items-center px-3 py-1 text-xs font-semibold text-notion-muted hover:text-notion-text cursor-pointer mb-0.5 group"
                onClick={() => setPrivateOpen(!privateOpen)}
            >
                <span className="flex-1">Özel</span>
                <Plus size={12} className="opacity-0 group-hover:opacity-100 hover:bg-notion-border rounded p-0.5 cursor-pointer" onClick={(e) => {
                    e.stopPropagation()
                    handleCreate()
                }}/>
            </div>
            {privateOpen && (
                <div>
                    {rootPages.length === 0 && (
                        <div className="px-4 py-2 text-xs text-notion-muted italic">Sayfa yok</div>
                    )}
                    {rootPages.map(page => <SidebarItem key={page.id} pageId={page.id} />)}
                </div>
            )}
        </div>
        
      </div>

      {/* Trash Button & Popover */}
      <div className="mt-auto">
          <div 
            onClick={() => setTrashOpen(!trashOpen)}
            className={cn(
                "p-3 border-t border-notion-border flex items-center gap-3 text-notion-muted hover:text-notion-text cursor-pointer hover:bg-notion-panel transition-colors",
                trashOpen && "bg-notion-panel text-notion-text"
            )}
          >
            <Trash2 size={16} />
            <span className="text-sm font-medium">Çöp Kutusu</span>
          </div>

          {/* Trash Popover */}
          {trashOpen && (
              <div className="absolute bottom-12 left-2 w-64 bg-notion-panel border border-notion-border rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[300px] z-50">
                  <div className="p-2 border-b border-notion-border flex items-center justify-between bg-notion-bg">
                      <span className="text-xs font-semibold text-notion-muted pl-2">Silinen Sayfalar</span>
                      <div onClick={() => setTrashOpen(false)} className="p-1 hover:bg-notion-border rounded cursor-pointer">
                          <X size={14} />
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-1">
                      {trashPages.length === 0 && (
                          <div className="p-4 text-center text-xs text-notion-muted italic">Çöp kutusu boş</div>
                      )}
                      {trashPages.map(page => (
                          <div key={page.id} className="flex items-center justify-between p-2 hover:bg-notion-border/50 rounded group">
                              <div className="flex items-center gap-2 truncate flex-1">
                                  <span className="text-xs">{page.icon || '📄'}</span>
                                  <span className="text-sm truncate text-notion-text">{page.title || 'Adsız'}</span>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                                  <div 
                                    onClick={() => restoreFromTrash(page.id)}
                                    className="p-1 hover:bg-notion-border rounded text-notion-muted hover:text-green-400 cursor-pointer"
                                    title="Geri Yükle"
                                  >
                                      <RefreshCw size={12} />
                                  </div>
                                  <div 
                                    onClick={() => {
                                        if(confirm('Bu sayfayı kalıcı olarak silmek istediğinize emin misiniz?')) permanentlyDelete(page.id)
                                    }}
                                    className="p-1 hover:bg-notion-border rounded text-notion-muted hover:text-red-400 cursor-pointer"
                                    title="Kalıcı Olarak Sil"
                                  >
                                      <Trash2 size={12} />
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>

      {/* Footer New Page */}
      <div 
        onClick={() => handleCreate()}
        className="p-3 border-t border-notion-border flex items-center gap-3 text-notion-muted hover:text-notion-text cursor-pointer hover:bg-notion-panel transition-colors"
      >
        <Plus size={16} />
        <span className="text-sm font-medium">Yeni Sayfa</span>
      </div>
    </div>
  )
}
