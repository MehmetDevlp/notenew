import Database from 'better-sqlite3'
import path from 'node:path'
import { app } from 'electron'
import { v4 as uuidv4 } from 'uuid'

const dbPath = app.isPackaged
  ? path.join(process.resourcesPath, 'mynotion.db')
  : path.join(app.getPath('userData'), 'mynotion-v3.db')

console.log('Database path:', dbPath)

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON') // Enable foreign key constraints

export function initDb() {
  console.log('Initializing database tables...')
  
  // 1. Pages Table
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
  `)

  // Simple migration to add columns if they don't exist
  try {
      const columns = db.prepare('PRAGMA table_info(pages)').all() as any[];
      if (!columns.some(col => col.name === 'is_archived')) {
          db.prepare('ALTER TABLE pages ADD COLUMN is_archived INTEGER DEFAULT 0').run();
      }
      if (!columns.some(col => col.name === 'is_favorite')) {
          db.prepare('ALTER TABLE pages ADD COLUMN is_favorite INTEGER DEFAULT 0').run();
      }
  } catch (e) {
      console.error('Migration failed', e);
  }

  // 2. Database Properties Table (Columns)
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
  `)

  // 3. Property Values Table (Cells)
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
  `)

  console.log('Database initialized successfully.')
}

// Helper to map DB row to Page object
const mapPage = (row: any) => ({
  ...row,
  isDatabase: !!row.is_database,
  isArchived: !!row.is_archived,
  isFavorite: !!row.is_favorite,
  content: JSON.parse(row.content || '[]'),
  createdAt: row.created_at * 1000, // Convert to JS ms
  updatedAt: row.updated_at * 1000
})

export const dbApi = {
  // --- PAGES ---

  getPages: () => {
    const rows = db.prepare(`SELECT * FROM pages ORDER BY created_at ASC`).all()
    return rows.map(mapPage)
  },

  getPage: (id: string) => {
    const row = db.prepare('SELECT * FROM pages WHERE id = ?').get(id)
    if (!row) return null
    return mapPage(row)
  },

  createPage: (parentId: string | null = null) => {
    const id = uuidv4()
    const now = Math.floor(Date.now() / 1000)
    
    db.prepare(`
      INSERT INTO pages (id, title, parent_id, created_at, updated_at)
      VALUES (?, 'Untitled', ?, ?, ?)
    `).run(id, parentId, now, now)
    
    return dbApi.getPage(id)
  },

  updatePage: (id: string, updates: any) => {
    const now = Math.floor(Date.now() / 1000)
    const fields: string[] = []
    const values: any[] = []

    // Map frontend keys to DB columns
    const keyMap: Record<string, string> = {
        title: 'title',
        icon: 'icon',
        coverImage: 'cover_image',
        content: 'content',
        parentId: 'parent_id',
        isDatabase: 'is_database',
        databaseId: 'database_id',
        isArchived: 'is_archived',
        isFavorite: 'is_favorite'
    }

    Object.keys(updates).forEach(key => {
        if (keyMap[key]) {
            fields.push(`${keyMap[key]} = ?`)
            let val = updates[key]
            if (key === 'content') val = JSON.stringify(val)
            if (key === 'isDatabase') val = val ? 1 : 0
            if (key === 'isArchived') val = val ? 1 : 0
            if (key === 'isFavorite') val = val ? 1 : 0
            values.push(val)
        }
    })

    if (fields.length === 0) return

    fields.push('updated_at = ?')
    values.push(now)
    values.push(id)

    db.prepare(`UPDATE pages SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  },

  deletePage: (id: string) => {
    db.prepare('DELETE FROM pages WHERE id = ?').run(id)
  },

  // --- DATABASE PROPERTIES ---

  getDatabaseProperties: (databaseId: string) => {
    const rows = db.prepare('SELECT * FROM database_properties WHERE database_id = ?').all(databaseId) as any[]
    return rows.map(row => ({
        ...row,
        options: row.options ? JSON.parse(row.options) : null
    }))
  },

  createDatabaseProperty: (databaseId: string, name: string, type: string, options: any = null) => {
    const id = uuidv4()
    db.prepare(`
        INSERT INTO database_properties (id, database_id, name, type, options)
        VALUES (?, ?, ?, ?, ?)
    `).run(id, databaseId, name, type, options ? JSON.stringify(options) : null)
    return { id, databaseId, name, type, options }
  },

  // --- PROPERTY VALUES ---

  getPropertyValues: (pageId: string) => {
      const rows = db.prepare(`
        SELECT pv.*, dp.name as property_name, dp.type as property_type
        FROM property_values pv
        JOIN database_properties dp ON pv.property_id = dp.id
        WHERE pv.page_id = ?
      `).all(pageId) as any[]
      
      return rows.map(row => ({
          ...row,
          value: JSON.parse(row.value)
      }))
  },

  setPropertyValue: (pageId: string, propertyId: string, value: any) => {
      const id = uuidv4()
      const jsonValue = JSON.stringify(value)
      
      // Upsert (Insert or Replace)
      db.prepare(`
        INSERT INTO property_values (id, page_id, property_id, value)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(page_id, property_id) DO UPDATE SET value = excluded.value
      `).run(id, pageId, propertyId, jsonValue)
  }
}
