import React, { useEffect, useState } from 'react'
import { TextCell, NumberCell, SelectCell, CheckboxCell, DateCell, StatusCell } from './cells'
import type { Property, TextProperty, NumberProperty, SelectProperty, CheckboxProperty, DateProperty, StatusProperty } from '../../types/property'

export const PropertyCellTest: React.FC = () => {
    const [pageId, setPageId] = useState<string>('')
    const [properties, setProperties] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        // electronAPI'nin yüklenmesini bekle
        const initTest = async () => {
            try {
                // Check if electronAPI exists
                if (!window.electronAPI) {
                    setError('electronAPI not loaded yet, retrying...')
                    setTimeout(initTest, 100) // Retry after 100ms
                    return
                }

                setLoading(true)
                setError('')

                // Test page oluştur
                const page = await window.electronAPI.createPage()
                setPageId(page.id)

                // Property'leri oluştur
                const props = await Promise.all([
                    window.electronAPI.property.add(page.id, 'Task Name', 'text', {}),
                    window.electronAPI.property.add(page.id, 'Score', 'number', { format: 'number' }),
                    window.electronAPI.property.add(page.id, 'Priority', 'select', {
                        options: [
                            { id: 'high', name: 'High', color: 'red' },
                            { id: 'medium', name: 'Medium', color: 'yellow' },
                            { id: 'low', name: 'Low', color: 'green' }
                        ]
                    }),
                    window.electronAPI.property.add(page.id, 'Done', 'checkbox', {}),
                    window.electronAPI.property.add(page.id, 'Due Date', 'date', {}),
                    window.electronAPI.property.add(page.id, 'Status', 'status', {
                        groups: [
                            { id: 'todo', name: 'To-do', options: [{ id: 'not-started', name: 'Not Started', color: 'gray' }] },
                            { id: 'progress', name: 'In Progress', options: [{ id: 'working', name: 'Working', color: 'blue' }] },
                            { id: 'complete', name: 'Complete', options: [{ id: 'done', name: 'Done', color: 'green' }] }
                        ]
                    })
                ])

                setProperties(props)
                setLoading(false)
            } catch (err) {
                console.error('Test init error:', err)
                setError(err instanceof Error ? err.message : 'Unknown error')
                setLoading(false)
            }
        }

        initTest()
    }, [])

    if (error) {
        return (
            <div className="p-12 text-[#E03E3E]">
                <h1 className="text-2xl font-bold mb-4">Error</h1>
                <p>{error}</p>
            </div>
        )
    }

    if (loading || !pageId || properties.length === 0) {
        return <div className="p-12 text-white">Loading test data...</div>
    }

    return (
        <div className="p-12 space-y-8 bg-[#191919] min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-8">Property Cell Components Test</h1>

            <div className="space-y-6">
                {/* Text Cell */}
                <div>
                    <h3 className="text-sm font-medium text-[#9B9A97] mb-2">Text Cell</h3>
                    <TextCell
                        pageId={pageId}
                        property={properties[0] as TextProperty}
                        value={null}
                        onSave={async (val) => {
                            await window.electronAPI.property.setValue(pageId, properties[0].id, val)
                            console.log('Text saved:', val)
                        }}
                    />
                </div>

                {/* Number Cell */}
                <div>
                    <h3 className="text-sm font-medium text-[#9B9A97] mb-2">Number Cell</h3>
                    <NumberCell
                        pageId={pageId}
                        property={properties[1] as NumberProperty}
                        value={null}
                        onSave={async (val) => {
                            await window.electronAPI.property.setValue(pageId, properties[1].id, val)
                            console.log('Number saved:', val)
                        }}
                    />
                </div>

                {/* Select Cell */}
                <div>
                    <h3 className="text-sm font-medium text-[#9B9A97] mb-2">Select Cell</h3>
                    <SelectCell
                        pageId={pageId}
                        property={properties[2] as SelectProperty}
                        value={null}
                        onSave={async (val) => {
                            await window.electronAPI.property.setValue(pageId, properties[2].id, val)
                            console.log('Select saved:', val)
                        }}
                        onUpdateProperty={async (updates) => {
                            await window.electronAPI.property.update(properties[2].id, updates)
                        }}
                    />
                </div>

                {/* Checkbox Cell */}
                <div>
                    <h3 className="text-sm font-medium text-[#9B9A97] mb-2">Checkbox Cell</h3>
                    <CheckboxCell
                        pageId={pageId}
                        property={properties[3] as CheckboxProperty}
                        value={{ checked: false }}
                        onSave={async (val) => {
                            await window.electronAPI.property.setValue(pageId, properties[3].id, val)
                            console.log('Checkbox saved:', val)
                        }}
                    />
                </div>

                {/* Date Cell */}
                <div>
                    <h3 className="text-sm font-medium text-[#9B9A97] mb-2">Date Cell</h3>
                    <DateCell
                        pageId={pageId}
                        property={properties[4] as DateProperty}
                        value={null}
                        onSave={async (val) => {
                            await window.electronAPI.property.setValue(pageId, properties[4].id, val)
                            console.log('Date saved:', val)
                        }}
                    />
                </div>

                {/* Status Cell */}
                <div>
                    <h3 className="text-sm font-medium text-[#9B9A97] mb-2">Status Cell</h3>
                    <StatusCell
                        pageId={pageId}
                        property={properties[5] as StatusProperty}
                        value={null}
                        onSave={async (val) => {
                            await window.electronAPI.property.setValue(pageId, properties[5].id, val)
                            console.log('Status saved:', val)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}