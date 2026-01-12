import { ipcMain } from 'electron'
import { dbApi } from './db'

export function registerDatabaseHandlers() {
    // --- DATABASE ---
    ipcMain.handle('db:create', (_, x) => dbApi.createDatabase(x))
    ipcMain.handle('db:get', (_, id) => dbApi.getDatabase(id))

    // --- PROPERTIES ---
    ipcMain.handle('property:add', (_, { databaseId, name, type, config }) =>
        dbApi.addProperty(databaseId, { name, type, config }))

    ipcMain.handle('property:update', (_, { id, updates }) =>
        dbApi.updateProperty(id, updates))

    ipcMain.handle('property:delete', (_, id) =>
        dbApi.deleteProperty(id))

    ipcMain.handle('property:getAll', (_, databaseId) =>
        dbApi.getProperties(databaseId))

    // --- PAGES (ROWS) ---
    ipcMain.handle('page:create', (_, { parentId, parentType }) =>
        dbApi.createPage(parentId, parentType))

    ipcMain.handle('page:get', (_, id) =>
        dbApi.getPage(id))

    ipcMain.handle('page:getMany', (_, parentId) =>
        dbApi.getPages(parentId))

    ipcMain.handle('page:update', (_, { id, updates }) =>
        dbApi.updatePage(id, updates))

    ipcMain.handle('page:delete', (_, id) =>
        dbApi.deletePage(id))

    // --- VALUES ---
    ipcMain.handle('value:set', (_, { pageId, propertyId, value }) =>
        dbApi.setPropertyValue(pageId, propertyId, value))

    ipcMain.handle('value:get', (_, { pageId, propertyId }) =>
        dbApi.getPropertyValue(pageId, propertyId))

    ipcMain.handle('value:getPageMap', (_, pageId) =>
        dbApi.getPageProperties(pageId))
}
