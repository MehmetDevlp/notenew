import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // --- DATABASE ---
  createDatabase: (input: { title: string; parentPageId?: string }) =>
    ipcRenderer.invoke('db:create', input),

  getDatabase: (id: string) =>
    ipcRenderer.invoke('db:get', id),

  // --- PROPERTIES ---
  db: {
    addProperty: (databaseId: string, name: string, type: string, config?: any) =>
      ipcRenderer.invoke('property:add', { databaseId, name, type, config }),

    updateProperty: (id: string, updates: any) =>
      ipcRenderer.invoke('property:update', { id, updates }),

    deleteProperty: (id: string) =>
      ipcRenderer.invoke('property:delete', id),

    getProperties: (databaseId: string) =>
      ipcRenderer.invoke('property:getAll', databaseId),
  },

  // --- PAGES (ROWS) ---
  page: {
    create: (parentId: string, parentType: 'database' | 'page' = 'database') =>
      ipcRenderer.invoke('page:create', { parentId, parentType }),

    get: (id: string) =>
      ipcRenderer.invoke('page:get', id),

    getMany: (parentId: string) =>
      ipcRenderer.invoke('page:getMany', parentId),

    update: (id: string, updates: any) =>
      ipcRenderer.invoke('page:update', { id, updates }),

    delete: (id: string) =>
      ipcRenderer.invoke('page:delete', id),
  },

  // --- VALUES ---
  value: {
    set: (pageId: string, propertyId: string, value: any) =>
      ipcRenderer.invoke('value:set', { pageId, propertyId, value }),

    get: (pageId: string, propertyId: string) =>
      ipcRenderer.invoke('value:get', { pageId, propertyId }),

    getPageMap: (pageId: string) =>
      ipcRenderer.invoke('value:getPageMap', pageId),
  },

  // --- LEGACY/COMPATIBILITY API ---
  getDocuments: () => ipcRenderer.invoke('page:getMany', null),

  getDocument: (id: string) => ipcRenderer.invoke('page:get', id),

  createDocument: (parentId?: string) =>
    ipcRenderer.invoke('page:create', { parentId, parentType: 'page' }),

  updateDocumentContent: (id: string, content: any) =>
    ipcRenderer.invoke('page:update', { id, updates: { content } }),

  updateDocumentMetadata: (id: string, updates: any) =>
    ipcRenderer.invoke('page:update', { id, updates }),

  deleteDocument: (id: string) => ipcRenderer.invoke('page:delete', id),

  // Legacy Aliases for Tests
  createPage: (parentId?: string) =>
    ipcRenderer.invoke('page:create', { parentId, parentType: 'page' }),

  property: {
    add: (databaseId: string, name: string, type: string, config?: any) =>
      ipcRenderer.invoke('property:add', { databaseId, name, type, config }),

    update: (id: string, updates: any) =>
      ipcRenderer.invoke('property:update', { id, updates }),

    delete: (id: string) =>
      ipcRenderer.invoke('property:delete', id),

    setValue: (pageId: string, propertyId: string, value: any) =>
      ipcRenderer.invoke('value:set', { pageId, propertyId, value }),
  }
})