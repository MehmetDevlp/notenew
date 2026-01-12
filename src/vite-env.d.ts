/// <reference types="vite/client" />

import type { Property, PropertyValue } from './types/property'
import type { Database, Page } from './types/database'
import type { Document } from './types'

declare global {
  interface Window {
    ipcRenderer: {
      invoke(channel: string, ...args: any[]): Promise<any>
      on(channel: string, func: (...args: any[]) => void): void
      off(channel: string, func: (...args: any[]) => void): void
      send(channel: string, ...args: any[]): void
    }
    electronAPI: {
      // --- DATABASE ---
      createDatabase: (input: { title: string; parentPageId?: string }) => Promise<Database>
      getDatabase: (id: string) => Promise<Database | null>

      // --- PROPERTIES ---
      db: {
        addProperty: (databaseId: string, name: string, type: string, config?: any) => Promise<Property>
        updateProperty: (id: string, updates: any) => Promise<void>
        deleteProperty: (id: string) => Promise<void>
        getProperties: (databaseId: string) => Promise<Property[]>
      }

      // --- PAGES (ROWS) ---
      page: {
        create: (parentId: string, parentType?: 'database' | 'page') => Promise<Page>
        get: (id: string) => Promise<Page | null>
        getMany: (parentId: string) => Promise<Page[]>
        update: (id: string, updates: any) => Promise<void>
        delete: (id: string) => Promise<void>
      }

      // --- VALUES ---
      value: {
        set: (pageId: string, propertyId: string, value: any) => Promise<void>
        get: (pageId: string, propertyId: string) => Promise<any>
        getPageMap: (pageId: string) => Promise<Record<string, any>>
      }

      // --- LEGACY/COMPATIBILITY API ---
      getDocuments: () => Promise<Document[]>
      getDocument: (id: string) => Promise<Document | null>
      createDocument: (parentId?: string) => Promise<Document>
      updateDocumentContent: (id: string, content: any) => Promise<void>
      updateDocumentMetadata: (id: string, updates: any) => Promise<void>
      deleteDocument: (id: string) => Promise<void>

      // Legacy Aliases for Tests
      createPage: (parentId?: string) => Promise<Page>
      property: {
        add: (databaseId: string, name: string, type: string, config?: any) => Promise<Property>
        update: (id: string, updates: any) => Promise<void>
        delete: (id: string) => Promise<void>
        setValue: (pageId: string, propertyId: string, value: any) => Promise<void>
      }
    }
  }
}

export { }