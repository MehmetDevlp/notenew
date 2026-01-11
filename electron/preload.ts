import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Pages
  getPages: () => ipcRenderer.invoke('db:getPages'),
  getPage: (id: string) => ipcRenderer.invoke('db:getPage', id),
  createPage: (parentId?: string) => ipcRenderer.invoke('db:createPage', parentId),
  updatePage: (id: string, updates: any) => ipcRenderer.invoke('db:updatePage', { id, updates }),
  deletePage: (id: string) => ipcRenderer.invoke('db:deletePage', id),

  // Database Properties
  getDatabaseProperties: (databaseId: string) => ipcRenderer.invoke('db:getDatabaseProperties', databaseId),
  createDatabaseProperty: (databaseId: string, name: string, type: string, options?: any) => 
    ipcRenderer.invoke('db:createDatabaseProperty', { databaseId, name, type, options }),

  // Property Values
  getPropertyValues: (pageId: string) => ipcRenderer.invoke('db:getPropertyValues', pageId),
  setPropertyValue: (pageId: string, propertyId: string, value: any) => 
    ipcRenderer.invoke('db:setPropertyValue', { pageId, propertyId, value }),
})
