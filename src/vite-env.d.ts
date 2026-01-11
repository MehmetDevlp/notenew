/// <reference types="vite/client" />

interface Window {
  ipcRenderer: {
    invoke(channel: string, ...args: any[]): Promise<any>
    on(channel: string, func: (...args: any[]) => void): void
    off(channel: string, func: (...args: any[]) => void): void
    send(channel: string, ...args: any[]): void
  }
  electronAPI: {
    // Pages
    getPages: () => Promise<any[]>
    getPage: (id: string) => Promise<any>
    createPage: (parentId?: string) => Promise<any>
    updatePage: (id: string, updates: any) => Promise<void>
    deletePage: (id: string) => Promise<void>

    // Database Properties
    getDatabaseProperties: (databaseId: string) => Promise<any[]>
    createDatabaseProperty: (databaseId: string, name: string, type: string, options?: any) => Promise<any>

    // Property Values
    getPropertyValues: (pageId: string) => Promise<any[]>
    setPropertyValue: (pageId: string, propertyId: string, value: any) => Promise<void>
  }
}
