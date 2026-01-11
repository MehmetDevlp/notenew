import { create } from 'zustand'
import { Document } from './types'
import { buildTree } from './lib/treeUtils'

interface AppState {
  documents: Document[]
  documentTree: Document[]
  isLoading: boolean
  loadDocuments: () => Promise<void>
  addDocument: (parentId?: string) => Promise<Document>
  updateDocumentContent: (id: string, content: any[]) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  moveDocument: (id: string, parentId: string | null) => Promise<void>
  renameDocument: (id: string, title: string) => Promise<void>
  updateDocumentMetadata: (id: string, updates: any) => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  documents: [],
  documentTree: [],
  isLoading: false,

  loadDocuments: async () => {
    set({ isLoading: true })
    try {
      const docs = await window.electronAPI.getDocuments()
      set({ 
        documents: docs,
        documentTree: buildTree(docs)
      })
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  addDocument: async (parentId) => {
    const newDoc = await window.electronAPI.createDocument(parentId)
    await get().loadDocuments()
    return newDoc
  },

  updateDocumentContent: async (id, content) => {
    // Optimistic update not needed for content as it's handled in editor
    // Just refresh list if needed (e.g. preview text changed)
    // await window.electronAPI.updateDocumentContent(id, content)
  },

  updateDocumentMetadata: async (id, updates) => {
    await window.electronAPI.updateDocumentMetadata(id, updates)
    // We might want to refresh list if title/icon changed
    if (updates.title || updates.icon || updates.parentId) {
      await get().loadDocuments()
    }
  },

  deleteDocument: async (id) => {
    await window.electronAPI.deleteDocument(id)
    await get().loadDocuments()
  },

  moveDocument: async (id, parentId) => {
    await window.electronAPI.updateDocumentMetadata(id, { parentId })
    await get().loadDocuments()
  },

  renameDocument: async (id, title) => {
    await window.electronAPI.updateDocumentMetadata(id, { title })
    await get().loadDocuments()
  }
}))
