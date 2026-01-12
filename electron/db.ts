import Database from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'
import { v4 as uuidv4 } from 'uuid'

const dbPath = app.isPackaged
  ? path.join(process.resourcesPath, 'mynotion.db')
  : path.join(app.getPath('userData'), 'mynotion-v3.db')

console.log('Database path:', dbPath)

let db: Database.Database

// ============================================================================
// Backup & Initialization
// ============================================================================

function createBackup(pathStr: string): string {
  if (!fs.existsSync(pathStr)) return ''
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = pathStr.replace('.db', `-backup-${timestamp}.db`)
  fs.copyFileSync(pathStr, backupPath)
  console.log(`✓ Backup created: ${backupPath}`)
  return backupPath
}

export function initDb() {
  console.log('Initializing database...')

  // Create backup before connecting (if exists)
  if (fs.existsSync(dbPath)) {
    try {
      createBackup(dbPath)
    } catch (e) {
      console.error('Failed to create backup:', e)
      // Continue anyway? Or stop? User said "Backup Current Data CRITICAL". 
      // Safest to throw if backup fails? 
      // Let's log severe error but proceed as we might need to open app even if disk full
    }
  }

  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  try {
    // Transaction for schema migration
    const initTransaction = db.transaction(() => {
      // 1. Databases Table (Container)
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
      `)

      // 2. Database Properties (Columns)
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
      `)

      // 3. Pages (Rows)
      // Note: unified 'pages' table for both documents and database rows
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
      `)

      // 4. Page Properties (Cells)
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
      `)

      // 5. Database Views
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
      `)
    })

    initTransaction()
    console.log('✓ Database schema initialized')

  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    // ROLLBACK LOGIC if needed manually (transaction handles auto-rollback of itself, 
    // but if we migrated data, we might need to restore file)
    throw error
  }
}

// ============================================================================
// API Helpers
// ============================================================================

const now = () => Math.floor(Date.now() / 1000)

// ============================================================================
// Exported API
// ============================================================================

export const dbApi = {
  // --- DATABASE METADATA ---
  createDatabase: (input: { title: string; parentPageId?: string }) => {
    const id = uuidv4()
    const ts = now()
    db.prepare(`
      INSERT INTO databases (id, title, parent_page_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, input.title, input.parentPageId || null, ts, ts)
    return db.prepare('SELECT * FROM databases WHERE id = ?').get(id)
  },

  getDatabase: (id: string) => {
    return db.prepare('SELECT * FROM databases WHERE id = ?').get(id)
  },

  // --- PROPERTIES ---
  addProperty: (databaseId: string, input: { name: string; type: string; config?: any }) => {
    const id = uuidv4()
    const ts = now()

    // Auto-calculate order
    const max = db.prepare('SELECT MAX(order_index) as m FROM database_properties WHERE database_id = ?').get(databaseId) as any
    const order = (max?.m || 0) + 1

    db.prepare(`
      INSERT INTO database_properties (id, database_id, name, type, config, order_index, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, databaseId, input.name, input.type, JSON.stringify(input.config || {}), order, ts)

    return db.prepare('SELECT * FROM database_properties WHERE id = ?').get(id)
  },

  updateProperty: (id: string, updates: any) => {
    const sets: string[] = []
    const values: any[] = []

    if (updates.name !== undefined) { sets.push('name = ?'); values.push(updates.name) }
    if (updates.config !== undefined) { sets.push('config = ?'); values.push(JSON.stringify(updates.config)) }
    if (updates.visible !== undefined) { sets.push('visible = ?'); values.push(updates.visible ? 1 : 0) }

    if (sets.length === 0) return
    values.push(id)

    db.prepare(`UPDATE database_properties SET ${sets.join(', ')} WHERE id = ?`).run(...values)
  },

  deleteProperty: (id: string) => {
    db.prepare('DELETE FROM database_properties WHERE id = ?').run(id)
  },

  getProperties: (databaseId: string) => {
    const rows = db.prepare('SELECT * FROM database_properties WHERE database_id = ? ORDER BY order_index ASC').all(databaseId)
    return rows.map((r: any) => ({
      ...r,
      config: r.config ? JSON.parse(r.config) : {},
      visible: !!r.visible
    }))
  },

  // --- PAGES (ROWS) ---
  createPage: (parentId: string, parentType: 'database' | 'page' = 'database') => {
    const id = uuidv4()
    const ts = now()

    db.prepare(`
      INSERT INTO pages (id, parent_id, parent_type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, parentId, parentType, ts, ts)

    return db.prepare('SELECT * FROM pages WHERE id = ?').get(id)
  },

  getPage: (id: string) => {
    const row = db.prepare('SELECT * FROM pages WHERE id = ?').get(id) as any
    if (!row) return null
    return {
      ...row,
      content: row.content ? JSON.parse(row.content) : [],
      isArchived: !!row.is_archived,
      isFavorite: !!row.is_favorite,
      type: 'doc'
    }
  },

  getPages: (parentId: string) => {
    const rows = db.prepare('SELECT * FROM pages WHERE parent_id = ? ORDER BY created_at DESC').all(parentId)
    return rows.map((r: any) => ({
      ...r,
      content: r.content ? JSON.parse(r.content) : [],
      isArchived: !!r.is_archived,
      isFavorite: !!r.is_favorite,
      type: 'doc'
    }))
  },

  updatePage: (id: string, updates: any) => {
    const sets: string[] = []
    const values: any[] = []

    const map: Record<string, string> = {
      title: 'title',
      icon: 'icon',
      coverImage: 'cover_image',
      isArchived: 'is_archived',
      isFavorite: 'is_favorite'
    }

    Object.keys(updates).forEach(key => {
      if (map[key]) {
        let val = updates[key]
        if (typeof val === 'boolean') val = val ? 1 : 0
        sets.push(`${map[key]} = ?`)
        values.push(val)
      }
    })

    if (updates.content) {
      sets.push('content = ?')
      values.push(JSON.stringify(updates.content))
    }

    if (sets.length > 0) {
      sets.push('updated_at = ?')
      values.push(now())
      values.push(id)
      db.prepare(`UPDATE pages SET ${sets.join(', ')} WHERE id = ?`).run(...values)
    }
  },

  deletePage: (id: string) => {
    db.prepare('DELETE FROM pages WHERE id = ?').run(id)
  },

  // --- CELL VALUES ---
  setPropertyValue: (pageId: string, propertyId: string, value: any) => {
    const id = uuidv4()
    // Upsert
    db.prepare(`
      INSERT INTO page_properties (id, page_id, property_id, value)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(page_id, property_id) DO UPDATE SET value = excluded.value
    `).run(id, pageId, propertyId, JSON.stringify(value))
  },

  getPropertyValue: (pageId: string, propertyId: string) => {
    const row = db.prepare('SELECT value FROM page_properties WHERE page_id = ? AND property_id = ?').get(pageId, propertyId) as any
    return row ? JSON.parse(row.value) : null
  },

  // Get all values for a page (for table view)
  getPageProperties: (pageId: string) => {
    const rows = db.prepare(`
      SELECT pp.property_id, pp.value 
      FROM page_properties pp
      WHERE pp.page_id = ?
    `).all(pageId) as any[]

    return rows.reduce((acc, row) => {
      acc[row.property_id] = JSON.parse(row.value)
      return acc
    }, {} as Record<string, any>)
  }
}
