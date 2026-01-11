export interface Document {
  id: string
  title: string
  content: any[] // BlockNote JSON
  parent_id: string | null
  icon?: string
  cover_image?: string
  type: 'doc' | 'database'
  properties: Record<string, any> // e.g. { status: 'Done', priority: 'High' }
  created_at: number
  updated_at: number
  children?: Document[] // For tree structure
}
