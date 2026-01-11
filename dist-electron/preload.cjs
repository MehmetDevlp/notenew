"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Pages
  getPages: () => electron.ipcRenderer.invoke("db:getPages"),
  getPage: (id) => electron.ipcRenderer.invoke("db:getPage", id),
  createPage: (parentId) => electron.ipcRenderer.invoke("db:createPage", parentId),
  updatePage: (id, updates) => electron.ipcRenderer.invoke("db:updatePage", { id, updates }),
  deletePage: (id) => electron.ipcRenderer.invoke("db:deletePage", id),
  // Database Properties
  getDatabaseProperties: (databaseId) => electron.ipcRenderer.invoke("db:getDatabaseProperties", databaseId),
  createDatabaseProperty: (databaseId, name, type, options) => electron.ipcRenderer.invoke("db:createDatabaseProperty", { databaseId, name, type, options }),
  // Property Values
  getPropertyValues: (pageId) => electron.ipcRenderer.invoke("db:getPropertyValues", pageId),
  setPropertyValue: (pageId, propertyId, value) => electron.ipcRenderer.invoke("db:setPropertyValue", { pageId, propertyId, value })
});
