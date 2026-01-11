import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { PartialBlock } from '@blocknote/core'

// --- TYPES ---

export type PageStatus = 'Yapılacak' | 'Devam Ediyor' | 'Tamamlandı'
export type PagePriority = 'Düşük' | 'Orta' | 'Yüksek'

export interface Page {
  id: string
  title: string
  icon?: string
  coverImage?: string
  // BlockNote blocks structure
  blocks: PartialBlock[]
  parentId?: string | null
  createdAt: number
  
  // New Properties for Database
  status?: PageStatus
  priority?: PagePriority
  dueDate?: number | null
  assignee?: string
  isFavorite?: boolean
  isArchived?: boolean // For Trash feature
  
  // Database props
  isDatabase?: boolean
  properties?: Record<string, any>
}

interface PageState {
  pages: Record<string, Page>
  sidebarTree: string[]
  activePageId: string | null
  isLoading: boolean
  
  // Actions
  setLoading: (loading: boolean) => void
  setActivePage: (id: string) => void
  
  createPage: (parentId?: string) => string
  updatePageTitle: (id: string, title: string) => void
  updatePageProperty: (id: string, key: keyof Page, value: any) => void
  updatePageContent: (id: string, blocks: PartialBlock[]) => void // New action for BlockNote
  toggleFavorite: (id: string) => void
  convertPageToDatabase: (id: string) => void
  
  // Trash Actions
  moveToTrash: (id: string) => void
  restoreFromTrash: (id: string) => void
  permanentlyDelete: (id: string) => void
  deletePage: (id: string) => void // Deprecated alias for moveToTrash
}

// --- INITIAL MOCK DATA ---
const INITIAL_PAGES: Record<string, Page> = {
  'root-1': {
    id: 'root-1',
    title: 'Notion\'a Hoşgeldiniz',
    icon: '👋',
    createdAt: Date.now(),
    blocks: [
      {
        type: "heading",
        content: "Merhaba Dünya",
      },
      {
        type: "paragraph",
        content: "Bu yeni BlockNote editörüdür. Blokları sürüklemeyi ve '/' komutunu deneyin!",
      },
      {
        type: "checkListItem",
        content: "Sürükle Bırak özelliğini dene",
        props: { checked: true }
      }
    ] as PartialBlock[],
    isArchived: false
  },
  'root-2': {
    id: 'root-2',
    title: 'Proje Yol Haritası',
    icon: '🚀',
    createdAt: Date.now(),
    isDatabase: true,
    blocks: [],
    properties: { },
    status: 'Devam Ediyor',
    priority: 'Yüksek',
    dueDate: Date.now() + 86400000 * 5,
    isArchived: false
  }
}

export const usePageStore = create<PageState>()(
  persist(
    (set, get) => ({
      pages: INITIAL_PAGES,
      sidebarTree: ['root-1', 'root-2'],
      activePageId: 'root-1',
      isLoading: false,

      setLoading: (loading) => set({ isLoading: loading }),
      setActivePage: (id) => set({ activePageId: id }),

      createPage: (parentId) => {
        const id = uuidv4()
        const newPage: Page = {
          id,
          title: 'Adsız',
          createdAt: Date.now(),
          blocks: [],
          status: 'Yapılacak',
          priority: 'Orta',
          isArchived: false,
          parentId: parentId || null
        }

        set(state => {
          const newPages = { ...state.pages, [id]: newPage }
          
          if (parentId && newPages[parentId]) {
             // If parent exists, just add to pages map (Sidebar handles children rendering via parentId)
             return { pages: newPages }
          } else {
            // If root page, add to sidebarTree
            return {
              pages: newPages,
              sidebarTree: [...state.sidebarTree, id]
            }
          }
        })
        return id
      },

      updatePageTitle: (id, title) => {
        set(state => ({
          pages: {
            ...state.pages,
            [id]: { ...state.pages[id], title }
          }
        }))
      },

      updatePageProperty: (id, key, value) => {
        set(state => ({
          pages: {
            ...state.pages,
            [id]: { ...state.pages[id], [key]: value }
          }
        }))
      },

      updatePageContent: (id, blocks) => {
        set(state => ({
          pages: {
            ...state.pages,
            [id]: { ...state.pages[id], blocks }
          }
        }))
      },

      toggleFavorite: (id) => {
        set(state => ({
          pages: {
            ...state.pages,
            [id]: { ...state.pages[id], isFavorite: !state.pages[id].isFavorite }
          }
        }))
      },

      convertPageToDatabase: (id) => {
        set(state => ({
            pages: {
                ...state.pages,
                [id]: { 
                    ...state.pages[id], 
                    isDatabase: true, 
                    blocks: [] 
                }
            }
        }))
      },

      // TRASH SYSTEM
      
      moveToTrash: (id) => {
        set(state => {
            // Recursive function to archive all children as well? 
            // Notion usually archives the parent and children are hidden.
            // Let's just set isArchived = true for the target page.
            return {
                pages: {
                    ...state.pages,
                    [id]: { ...state.pages[id], isArchived: true, isFavorite: false } // Unfavorite when trashed
                }
            }
        })
      },

      restoreFromTrash: (id) => {
         set(state => ({
            pages: {
                ...state.pages,
                [id]: { ...state.pages[id], isArchived: false }
            }
         }))
      },

      permanentlyDelete: (id) => {
        set(state => {
          const { [id]: deleted, ...rest } = state.pages
          return {
            pages: rest,
            sidebarTree: state.sidebarTree.filter(pid => pid !== id)
          }
        })
      },
      
      deletePage: (id) => {
          // Alias for moveToTrash to maintain compatibility
          get().moveToTrash(id)
      }

    }),
    {
      name: 'notion-storage-v6', // Version bump for Trash system
    }
  )
)
