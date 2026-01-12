import { Property, PropertyType, PropertyValue } from './property'

export type { Property, PropertyType, PropertyValue }

export interface Database {
    id: string
    title: string
    icon?: string | null
    cover_url?: string | null
    parent_page_id?: string | null
    created_at: number
    updated_at: number
}

export interface DatabaseView {
    id: string
    database_id: string
    name: string
    type: 'table' | 'board' | 'calendar' // Planned types
    config: any
    order_index: number
}

export interface Page {
    id: string
    parent_id: string | null
    parent_type: 'database' | 'page'

    title: string
    icon?: string | null
    cover_image?: string | null
    content: any[] // BlockNote blocks

    is_archived: boolean
    is_favorite: boolean

    created_at: number
    updated_at: number

    // Dynamic properties for table display
    properties?: Record<string, any>

    // Frontend compatibility
    type?: 'doc' | 'database'
    children?: Page[]
}
