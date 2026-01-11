import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initDb, dbApi } from './db'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Polyfill for native modules that expect CommonJS variables
// @ts-ignore
globalThis.__filename = __filename
// @ts-ignore
globalThis.__dirname = __dirname

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC || '', 'vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    },
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    backgroundColor: '#191919', // Dark mode default
    titleBarStyle: 'hiddenInset', // Mac-like traffic lights
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    // win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(process.env.DIST || '', 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  initDb()

  // --- PAGE HANDLERS ---
  ipcMain.handle('db:getPages', () => dbApi.getPages())
  ipcMain.handle('db:getPage', (_, id) => dbApi.getPage(id))
  ipcMain.handle('db:createPage', (_, parentId) => dbApi.createPage(parentId))
  ipcMain.handle('db:updatePage', (_, { id, updates }) => dbApi.updatePage(id, updates))
  ipcMain.handle('db:deletePage', (_, id) => dbApi.deletePage(id))

  // --- DATABASE HANDLERS ---
  ipcMain.handle('db:getDatabaseProperties', (_, databaseId) => dbApi.getDatabaseProperties(databaseId))
  ipcMain.handle('db:createDatabaseProperty', (_, { databaseId, name, type, options }) => dbApi.createDatabaseProperty(databaseId, name, type, options))
  
  // --- PROPERTY VALUE HANDLERS ---
  ipcMain.handle('db:getPropertyValues', (_, pageId) => dbApi.getPropertyValues(pageId))
  ipcMain.handle('db:setPropertyValue', (_, { pageId, propertyId, value }) => dbApi.setPropertyValue(pageId, propertyId, value))

  createWindow()
})
