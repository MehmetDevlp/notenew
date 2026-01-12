import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Database, Page } from '../types/database'
import { Property, PropertyType } from '../types/property'
import { DatabaseTable } from '../components/database/DatabaseTable'
import { AddPropertyModal } from '../components/database/AddPropertyModal'
import { PropertyManager } from '../components/database/PropertyManager'
import { Settings, Plus } from 'lucide-react'

export const DatabasePage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [database, setDatabase] = useState<Database | null>(null)
    const [properties, setProperties] = useState<Property[]>([])
    const [pages, setPages] = useState<Page[]>([])
    const [loading, setLoading] = useState(true)

    // Modals
    const [isAddPropOpen, setIsAddPropOpen] = useState(false)
    const [isPropManagerOpen, setIsPropManagerOpen] = useState(false)

    const loadData = useCallback(async () => {
        if (!id) return
        try {
            const [db, props, rows] = await Promise.all([
                window.electronAPI.getDatabase(id),
                window.electronAPI.db.getProperties(id),
                window.electronAPI.page.getMany(id) // Get pages where parent_id = database_id
            ])

            setDatabase(db)
            setProperties(props)
            setPages(rows)
        } catch (error) {
            console.error('Failed to load database:', error)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        loadData()
    }, [loadData])

    const handleAddProperty = async (name: string, type: PropertyType) => {
        if (!id) return
        try {
            // Default config based on type
            let config = {}
            if (type === 'status') {
                config = {
                    groups: [
                        { id: 'todo', name: 'To-do', options: [] },
                        { id: 'progress', name: 'In Progress', options: [] },
                        { id: 'complete', name: 'Complete', options: [] },
                    ]
                }
            }

            await window.electronAPI.db.addProperty(id, name, type, config)
            await loadData()
            setIsAddPropOpen(false)
        } catch (error) {
            console.error('Failed to add property:', error)
        }
    }

    const handleDeleteProperty = async (propId: string) => {
        try {
            await window.electronAPI.db.deleteProperty(propId)
            await loadData()
        } catch (error) {
            console.error('Failed to delete property:', error)
        }
    }

    if (loading) return <div className="p-8 text-[#9B9A97]">Loading database...</div>
    if (!database) return <div className="p-8 text-white">Database not found</div>

    return (
        <div className="flex flex-col h-full bg-[#191919] text-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2f2f2f]">
                <div className="flex items-center space-x-2">
                    <span className="text-xl">{database.icon || '📄'}</span>
                    <h1 className="text-lg font-semibold">{database.title}</h1>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsPropManagerOpen(true)}
                        className="flex items-center space-x-1 px-2 py-1 text-sm text-[#9B9A97] hover:bg-[#2f2f2f] hover:text-white rounded transition-colors"
                    >
                        <Settings size={14} />
                        <span>Properties</span>
                    </button>

                    <button
                        onClick={() => setIsAddPropOpen(true)}
                        className="flex items-center space-x-1 px-2 py-1 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                    >
                        <Plus size={14} />
                        <span>New Property</span>
                    </button>
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-hidden">
                <DatabaseTable
                    databaseId={database.id}
                    properties={properties}
                    data={pages}
                    onRefresh={loadData}
                    onAddProperty={() => setIsAddPropOpen(true)}
                />
            </div>

            {/* Modals */}
            <AddPropertyModal
                isOpen={isAddPropOpen}
                onClose={() => setIsAddPropOpen(false)}
                onAdd={handleAddProperty}
            />

            <PropertyManager
                isOpen={isPropManagerOpen}
                onClose={() => setIsPropManagerOpen(false)}
                properties={properties}
                onDelete={handleDeleteProperty}
                onUpdate={() => { }} // Update handled in cell or future
            />
        </div>
    )
}
