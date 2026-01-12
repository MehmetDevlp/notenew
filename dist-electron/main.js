import { app, ipcMain, BrowserWindow } from "electron";
import path from "node:path";
import fs from "node:fs";
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
let db;
function createBackup(pathStr) {
  if (!fs.existsSync(pathStr)) return "";
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const backupPath = pathStr.replace(".db", `-backup-${timestamp}.db`);
  fs.copyFileSync(pathStr, backupPath);
  console.log(`✓ Backup created: ${backupPath}`);
  return backupPath;
}
function initDb() {
  console.log("Initializing database...");
  if (fs.existsSync(dbPath)) {
    try {
      createBackup(dbPath);
    } catch (e) {
      console.error("Failed to create backup:", e);
    }
  }
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  try {
    const initTransaction = db.transaction(() => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS databases (
          id TEXT PRIMARY KEY,
          title TEXT DEFAULT 'Untitled',
          icon TEXT,
          cover_url TEXT,
          parent_page_id TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
      `);
      db.exec(`
        CREATE TABLE IF NOT EXISTS database_properties (
          id TEXT PRIMARY KEY,
          database_id TEXT NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL, -- 'text', 'number', 'select', 'multi_select', 'date', 'checkbox', 'status'
          config TEXT,        -- JSON (options, etc.)
          order_index INTEGER NOT NULL,
          visible INTEGER DEFAULT 1,
          created_at INTEGER NOT NULL,
          FOREIGN KEY (database_id) REFERENCES databases(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_property_db_id ON database_properties(database_id);
      `);
      db.exec(`
        CREATE TABLE IF NOT EXISTS pages (
          id TEXT PRIMARY KEY,
          parent_id TEXT,          -- Can be database_id OR page_id
          parent_type TEXT CHECK(parent_type IN ('database', 'page')),
          
          title TEXT DEFAULT 'Untitled',
          icon TEXT,
          cover_image TEXT,
          content TEXT DEFAULT '[]', -- JSON blocks
          
          is_archived INTEGER DEFAULT 0,
          is_favorite INTEGER DEFAULT 0,
          
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_page_parent ON pages(parent_id);
      `);
      db.exec(`
        CREATE TABLE IF NOT EXISTS page_properties (
          id TEXT PRIMARY KEY,
          page_id TEXT NOT NULL,
          property_id TEXT NOT NULL,
          value TEXT, -- JSON value
          
          FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
          FOREIGN KEY (property_id) REFERENCES database_properties(id) ON DELETE CASCADE,
          UNIQUE(page_id, property_id)
        );
        CREATE INDEX IF NOT EXISTS idx_prop_val_page ON page_properties(page_id);
      `);
      db.exec(`
        CREATE TABLE IF NOT EXISTS database_views (
          id TEXT PRIMARY KEY,
          database_id TEXT NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL, -- 'table', 'board', etc.
          config TEXT,        -- JSON: filters, sorts
          order_index INTEGER NOT NULL,
          
          FOREIGN KEY (database_id) REFERENCES databases(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_view_db ON database_views(database_id);
      `);
    });
    initTransaction();
    console.log("✓ Database schema initialized");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}
const now = () => Math.floor(Date.now() / 1e3);
const dbApi = {
  // --- DATABASE METADATA ---
  createDatabase: (input) => {
    const id = v4();
    const ts = now();
    db.prepare(`
      INSERT INTO databases (id, title, parent_page_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, input.title, input.parentPageId || null, ts, ts);
    return db.prepare("SELECT * FROM databases WHERE id = ?").get(id);
  },
  getDatabase: (id) => {
    return db.prepare("SELECT * FROM databases WHERE id = ?").get(id);
  },
  // --- PROPERTIES ---
  addProperty: (databaseId, input) => {
    const id = v4();
    const ts = now();
    const max = db.prepare("SELECT MAX(order_index) as m FROM database_properties WHERE database_id = ?").get(databaseId);
    const order = ((max == null ? void 0 : max.m) || 0) + 1;
    db.prepare(`
      INSERT INTO database_properties (id, database_id, name, type, config, order_index, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, databaseId, input.name, input.type, JSON.stringify(input.config || {}), order, ts);
    return db.prepare("SELECT * FROM database_properties WHERE id = ?").get(id);
  },
  updateProperty: (id, updates) => {
    const sets = [];
    const values = [];
    if (updates.name !== void 0) {
      sets.push("name = ?");
      values.push(updates.name);
    }
    if (updates.config !== void 0) {
      sets.push("config = ?");
      values.push(JSON.stringify(updates.config));
    }
    if (updates.visible !== void 0) {
      sets.push("visible = ?");
      values.push(updates.visible ? 1 : 0);
    }
    if (sets.length === 0) return;
    values.push(id);
    db.prepare(`UPDATE database_properties SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  },
  deleteProperty: (id) => {
    db.prepare("DELETE FROM database_properties WHERE id = ?").run(id);
  },
  getProperties: (databaseId) => {
    const rows = db.prepare("SELECT * FROM database_properties WHERE database_id = ? ORDER BY order_index ASC").all(databaseId);
    return rows.map((r) => ({
      ...r,
      config: r.config ? JSON.parse(r.config) : {},
      visible: !!r.visible
    }));
  },
  // --- PAGES (ROWS) ---
  createPage: (parentId, parentType = "database") => {
    const id = v4();
    const ts = now();
    db.prepare(`
      INSERT INTO pages (id, parent_id, parent_type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, parentId, parentType, ts, ts);
    return db.prepare("SELECT * FROM pages WHERE id = ?").get(id);
  },
  getPage: (id) => {
    const row = db.prepare("SELECT * FROM pages WHERE id = ?").get(id);
    if (!row) return null;
    return {
      ...row,
      content: row.content ? JSON.parse(row.content) : [],
      isArchived: !!row.is_archived,
      isFavorite: !!row.is_favorite,
      type: "doc"
    };
  },
  getPages: (parentId) => {
    const rows = db.prepare("SELECT * FROM pages WHERE parent_id = ? ORDER BY created_at DESC").all(parentId);
    return rows.map((r) => ({
      ...r,
      content: r.content ? JSON.parse(r.content) : [],
      isArchived: !!r.is_archived,
      isFavorite: !!r.is_favorite,
      type: "doc"
    }));
  },
  updatePage: (id, updates) => {
    const sets = [];
    const values = [];
    const map = {
      title: "title",
      icon: "icon",
      coverImage: "cover_image",
      isArchived: "is_archived",
      isFavorite: "is_favorite"
    };
    Object.keys(updates).forEach((key) => {
      if (map[key]) {
        let val = updates[key];
        if (typeof val === "boolean") val = val ? 1 : 0;
        sets.push(`${map[key]} = ?`);
        values.push(val);
      }
    });
    if (updates.content) {
      sets.push("content = ?");
      values.push(JSON.stringify(updates.content));
    }
    if (sets.length > 0) {
      sets.push("updated_at = ?");
      values.push(now());
      values.push(id);
      db.prepare(`UPDATE pages SET ${sets.join(", ")} WHERE id = ?`).run(...values);
    }
  },
  deletePage: (id) => {
    db.prepare("DELETE FROM pages WHERE id = ?").run(id);
  },
  // --- CELL VALUES ---
  setPropertyValue: (pageId, propertyId, value) => {
    const id = v4();
    db.prepare(`
      INSERT INTO page_properties (id, page_id, property_id, value)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(page_id, property_id) DO UPDATE SET value = excluded.value
    `).run(id, pageId, propertyId, JSON.stringify(value));
  },
  getPropertyValue: (pageId, propertyId) => {
    const row = db.prepare("SELECT value FROM page_properties WHERE page_id = ? AND property_id = ?").get(pageId, propertyId);
    return row ? JSON.parse(row.value) : null;
  },
  // Get all values for a page (for table view)
  getPageProperties: (pageId) => {
    const rows = db.prepare(`
      SELECT pp.property_id, pp.value 
      FROM page_properties pp
      WHERE pp.page_id = ?
    `).all(pageId);
    return rows.reduce((acc, row) => {
      acc[row.property_id] = JSON.parse(row.value);
      return acc;
    }, {});
  }
};
function registerDatabaseHandlers() {
  ipcMain.handle("db:create", (_, x) => dbApi.createDatabase(x));
  ipcMain.handle("db:get", (_, id) => dbApi.getDatabase(id));
  ipcMain.handle("property:add", (_, { databaseId, name, type, config }) => dbApi.addProperty(databaseId, { name, type, config }));
  ipcMain.handle("property:update", (_, { id, updates }) => dbApi.updateProperty(id, updates));
  ipcMain.handle("property:delete", (_, id) => dbApi.deleteProperty(id));
  ipcMain.handle("property:getAll", (_, databaseId) => dbApi.getProperties(databaseId));
  ipcMain.handle("page:create", (_, { parentId, parentType }) => dbApi.createPage(parentId, parentType));
  ipcMain.handle("page:get", (_, id) => dbApi.getPage(id));
  ipcMain.handle("page:getMany", (_, parentId) => dbApi.getPages(parentId));
  ipcMain.handle("page:update", (_, { id, updates }) => dbApi.updatePage(id, updates));
  ipcMain.handle("page:delete", (_, id) => dbApi.deletePage(id));
  ipcMain.handle("value:set", (_, { pageId, propertyId, value }) => dbApi.setPropertyValue(pageId, propertyId, value));
  ipcMain.handle("value:get", (_, { pageId, propertyId }) => dbApi.getPropertyValue(pageId, propertyId));
  ipcMain.handle("value:getPageMap", (_, pageId) => dbApi.getPageProperties(pageId));
}
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
console.log("__dirname:", __dirname$1);
console.log("Files in __dirname:", fs.readdirSync(__dirname$1));
globalThis.__filename = __filename$1;
globalThis.__dirname = __dirname$1;
process.env.DIST = path.join(__dirname$1, "../dist");
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, "../public");
let win;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  const preloadPath = path.resolve(__dirname$1, "preload.cjs");
  console.log("=== PRELOAD DEBUG ===");
  console.log("Preload path:", preloadPath);
  console.log("Preload exists:", fs.existsSync(preloadPath));
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC || "", "vite.svg"),
    webPreferences: {
      preload: preloadPath,
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    },
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    backgroundColor: "#191919",
    titleBarStyle: "hiddenInset"
  });
  win.webContents.on("did-finish-load", () => {
    console.log("=== PAGE LOADED ===");
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    win == null ? void 0 : win.webContents.executeJavaScript("typeof window.electronAPI").then((result) => {
      console.log("electronAPI type in renderer:", result);
      if (result === "undefined") {
        console.error("❌ PRELOAD FAILED! electronAPI is undefined!");
      } else {
        console.log("✅ PRELOAD SUCCESS! electronAPI loaded");
      }
    });
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(process.env.DIST || "", "index.html"));
  }
}
app.whenReady().then(() => {
  initDb();
  registerDatabaseHandlers();
  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
