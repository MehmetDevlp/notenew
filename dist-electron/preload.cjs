"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // --- DATABASE ---
  createDatabase: (input) => electron.ipcRenderer.invoke("db:create", input),
  getDatabase: (id) => electron.ipcRenderer.invoke("db:get", id),
  // --- PROPERTIES ---
  db: {
    addProperty: (databaseId, name, type, config) => electron.ipcRenderer.invoke("property:add", { databaseId, name, type, config }),
    updateProperty: (id, updates) => electron.ipcRenderer.invoke("property:update", { id, updates }),
    deleteProperty: (id) => electron.ipcRenderer.invoke("property:delete", id),
    getProperties: (databaseId) => electron.ipcRenderer.invoke("property:getAll", databaseId)
  },
  // --- PAGES (ROWS) ---
  page: {
    create: (parentId, parentType = "database") => electron.ipcRenderer.invoke("page:create", { parentId, parentType }),
    get: (id) => electron.ipcRenderer.invoke("page:get", id),
    getMany: (parentId) => electron.ipcRenderer.invoke("page:getMany", parentId),
    update: (id, updates) => electron.ipcRenderer.invoke("page:update", { id, updates }),
    delete: (id) => electron.ipcRenderer.invoke("page:delete", id)
  },
  // --- VALUES ---
  value: {
    set: (pageId, propertyId, value) => electron.ipcRenderer.invoke("value:set", { pageId, propertyId, value }),
    get: (pageId, propertyId) => electron.ipcRenderer.invoke("value:get", { pageId, propertyId }),
    getPageMap: (pageId) => electron.ipcRenderer.invoke("value:getPageMap", pageId)
  },
  // --- LEGACY/COMPATIBILITY API ---
  getDocuments: () => electron.ipcRenderer.invoke("page:getMany", null),
  getDocument: (id) => electron.ipcRenderer.invoke("page:get", id),
  createDocument: (parentId) => electron.ipcRenderer.invoke("page:create", { parentId, parentType: "page" }),
  updateDocumentContent: (id, content) => electron.ipcRenderer.invoke("page:update", { id, updates: { content } }),
  updateDocumentMetadata: (id, updates) => electron.ipcRenderer.invoke("page:update", { id, updates }),
  deleteDocument: (id) => electron.ipcRenderer.invoke("page:delete", id),
  // Legacy Aliases for Tests
  createPage: (parentId) => electron.ipcRenderer.invoke("page:create", { parentId, parentType: "page" }),
  property: {
    add: (databaseId, name, type, config) => electron.ipcRenderer.invoke("property:add", { databaseId, name, type, config }),
    update: (id, updates) => electron.ipcRenderer.invoke("property:update", { id, updates }),
    delete: (id) => electron.ipcRenderer.invoke("property:delete", id),
    setValue: (pageId, propertyId, value) => electron.ipcRenderer.invoke("value:set", { pageId, propertyId, value })
  }
});
