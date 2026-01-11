import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { randomFillSync, randomUUID } from "node:crypto";
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
const rnds8Pool = new Uint8Array(256);
let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
const native = { randomUUID };
function _v4(options, buf, offset) {
  var _a;
  options = options || {};
  const rnds = options.random ?? ((_a = options.rng) == null ? void 0 : _a.call(options)) ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }
  return _v4(options);
}
const dbPath = app.isPackaged ? path.join(process.resourcesPath, "mynotion.db") : path.join(app.getPath("userData"), "mynotion-v3.db");
console.log("Database path:", dbPath);
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
function initDb() {
  console.log("Initializing database tables...");
  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      title TEXT DEFAULT 'Untitled',
      icon TEXT,
      cover_image TEXT, -- Local path
      content TEXT DEFAULT '[]', -- BlockNote JSON
      
      workspace_id TEXT, -- Future proofing
      parent_id TEXT,
      
      is_database INTEGER DEFAULT 0, -- Boolean (0 or 1)
      database_id TEXT, -- If this page is a row in a database
      
      is_archived INTEGER DEFAULT 0, -- Boolean (0 or 1)
      is_favorite INTEGER DEFAULT 0, -- Boolean (0 or 1)
      
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch()),
      
      FOREIGN KEY (parent_id) REFERENCES pages(id) ON DELETE CASCADE,
      FOREIGN KEY (database_id) REFERENCES pages(id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_parent_id ON pages(parent_id);
    CREATE INDEX IF NOT EXISTS idx_database_id ON pages(database_id);
  `);
  try {
    const columns = db.prepare("PRAGMA table_info(pages)").all();
    if (!columns.some((col) => col.name === "is_archived")) {
      db.prepare("ALTER TABLE pages ADD COLUMN is_archived INTEGER DEFAULT 0").run();
    }
    if (!columns.some((col) => col.name === "is_favorite")) {
      db.prepare("ALTER TABLE pages ADD COLUMN is_favorite INTEGER DEFAULT 0").run();
    }
  } catch (e) {
    console.error("Migration failed", e);
  }
  db.exec(`
    CREATE TABLE IF NOT EXISTS database_properties (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL, -- 'text', 'number', 'select', 'date', etc.
      options TEXT, -- JSON for select options
      database_id TEXT NOT NULL,
      
      FOREIGN KEY (database_id) REFERENCES pages(id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_property_db_id ON database_properties(database_id);
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS property_values (
      id TEXT PRIMARY KEY,
      value TEXT, -- JSON value
      page_id TEXT NOT NULL,
      property_id TEXT NOT NULL,
      
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
      FOREIGN KEY (property_id) REFERENCES database_properties(id) ON DELETE CASCADE,
      
      UNIQUE(page_id, property_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_value_page_id ON property_values(page_id);
  `);
  console.log("Database initialized successfully.");
}
const mapPage = (row) => ({
  ...row,
  isDatabase: !!row.is_database,
  isArchived: !!row.is_archived,
  isFavorite: !!row.is_favorite,
  content: JSON.parse(row.content || "[]"),
  createdAt: row.created_at * 1e3,
  // Convert to JS ms
  updatedAt: row.updated_at * 1e3
});
const dbApi = {
  // --- PAGES ---
  getPages: () => {
    const rows = db.prepare(`SELECT * FROM pages ORDER BY created_at ASC`).all();
    return rows.map(mapPage);
  },
  getPage: (id) => {
    const row = db.prepare("SELECT * FROM pages WHERE id = ?").get(id);
    if (!row) return null;
    return mapPage(row);
  },
  createPage: (parentId = null) => {
    const id = v4();
    const now = Math.floor(Date.now() / 1e3);
    db.prepare(`
      INSERT INTO pages (id, title, parent_id, created_at, updated_at)
      VALUES (?, 'Untitled', ?, ?, ?)
    `).run(id, parentId, now, now);
    return dbApi.getPage(id);
  },
  updatePage: (id, updates) => {
    const now = Math.floor(Date.now() / 1e3);
    const fields = [];
    const values = [];
    const keyMap = {
      title: "title",
      icon: "icon",
      coverImage: "cover_image",
      content: "content",
      parentId: "parent_id",
      isDatabase: "is_database",
      databaseId: "database_id",
      isArchived: "is_archived",
      isFavorite: "is_favorite"
    };
    Object.keys(updates).forEach((key) => {
      if (keyMap[key]) {
        fields.push(`${keyMap[key]} = ?`);
        let val = updates[key];
        if (key === "content") val = JSON.stringify(val);
        if (key === "isDatabase") val = val ? 1 : 0;
        if (key === "isArchived") val = val ? 1 : 0;
        if (key === "isFavorite") val = val ? 1 : 0;
        values.push(val);
      }
    });
    if (fields.length === 0) return;
    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);
    db.prepare(`UPDATE pages SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  },
  deletePage: (id) => {
    db.prepare("DELETE FROM pages WHERE id = ?").run(id);
  },
  // --- DATABASE PROPERTIES ---
  getDatabaseProperties: (databaseId) => {
    const rows = db.prepare("SELECT * FROM database_properties WHERE database_id = ?").all(databaseId);
    return rows.map((row) => ({
      ...row,
      options: row.options ? JSON.parse(row.options) : null
    }));
  },
  createDatabaseProperty: (databaseId, name, type, options = null) => {
    const id = v4();
    db.prepare(`
        INSERT INTO database_properties (id, database_id, name, type, options)
        VALUES (?, ?, ?, ?, ?)
    `).run(id, databaseId, name, type, options ? JSON.stringify(options) : null);
    return { id, databaseId, name, type, options };
  },
  // --- PROPERTY VALUES ---
  getPropertyValues: (pageId) => {
    const rows = db.prepare(`
        SELECT pv.*, dp.name as property_name, dp.type as property_type
        FROM property_values pv
        JOIN database_properties dp ON pv.property_id = dp.id
        WHERE pv.page_id = ?
      `).all(pageId);
    return rows.map((row) => ({
      ...row,
      value: JSON.parse(row.value)
    }));
  },
  setPropertyValue: (pageId, propertyId, value) => {
    const id = v4();
    const jsonValue = JSON.stringify(value);
    db.prepare(`
        INSERT INTO property_values (id, page_id, property_id, value)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(page_id, property_id) DO UPDATE SET value = excluded.value
      `).run(id, pageId, propertyId, jsonValue);
  }
};
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
globalThis.__filename = __filename$1;
globalThis.__dirname = __dirname$1;
process.env.DIST = path.join(__dirname$1, "../dist");
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, "../public");
let win;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC || "", "vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.cjs"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    },
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    backgroundColor: "#191919",
    // Dark mode default
    titleBarStyle: "hiddenInset"
    // Mac-like traffic lights
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST || "", "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  initDb();
  ipcMain.handle("db:getPages", () => dbApi.getPages());
  ipcMain.handle("db:getPage", (_, id) => dbApi.getPage(id));
  ipcMain.handle("db:createPage", (_, parentId) => dbApi.createPage(parentId));
  ipcMain.handle("db:updatePage", (_, { id, updates }) => dbApi.updatePage(id, updates));
  ipcMain.handle("db:deletePage", (_, id) => dbApi.deletePage(id));
  ipcMain.handle("db:getDatabaseProperties", (_, databaseId) => dbApi.getDatabaseProperties(databaseId));
  ipcMain.handle("db:createDatabaseProperty", (_, { databaseId, name, type, options }) => dbApi.createDatabaseProperty(databaseId, name, type, options));
  ipcMain.handle("db:getPropertyValues", (_, pageId) => dbApi.getPropertyValues(pageId));
  ipcMain.handle("db:setPropertyValue", (_, { pageId, propertyId, value }) => dbApi.setPropertyValue(pageId, propertyId, value));
  createWindow();
});
