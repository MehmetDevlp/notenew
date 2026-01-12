import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { initDb } from './db'
import { registerDatabaseHandlers } from './database-handlers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Debug logs
console.log('__dirname:', __dirname)
console.log('Files in __dirname:', fs.readdirSync(__dirname))

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
  const preloadPath = path.resolve(__dirname, 'preload.cjs')
  console.log('=== PRELOAD DEBUG ===')
  console.log('Preload path:', preloadPath)
  console.log('Preload exists:', fs.existsSync(preloadPath))

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC || '', 'vite.svg'),
    webPreferences: {
      preload: preloadPath,
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    },
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    backgroundColor: '#191919',
    titleBarStyle: 'hiddenInset',
  })

  // Check preload loading
  win.webContents.on('did-finish-load', () => {
    console.log('=== PAGE LOADED ===')
    win?.webContents.send('main-process-message', (new Date).toLocaleString())

    // Test: check preload
    win?.webContents.executeJavaScript('typeof window.electronAPI').then(result => {
      console.log('electronAPI type in renderer:', result)
      if (result === 'undefined') {
        console.error('❌ PRELOAD FAILED! electronAPI is undefined!')
      } else {
        console.log('✅ PRELOAD SUCCESS! electronAPI loaded')
      }
    })
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(process.env.DIST || '', 'index.html'))
  }
}

app.whenReady().then(() => {
  // Initialize Database
  initDb()

  // Register Handlers
  registerDatabaseHandlers()

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})