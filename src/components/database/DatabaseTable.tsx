import React, { useMemo, useState, useEffect } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
    ColumnDef
} from '@tanstack/react-table'
import { Property, PropertyType } from '../../types/property'
import { Page } from '../../types/database'
import { TextCell } from './cells/TextCell'
import { NumberCell } from './cells/NumberCell'
import { SelectCell } from './cells/SelectCell'
import { MultiSelectCell } from './cells/MultiSelectCell'
import { StatusCell } from './cells/StatusCell'
import { DateCell } from './cells/DateCell'
import { CheckboxCell } from './cells/CheckboxCell'
import { Plus } from 'lucide-react'

// Helper to get cell component by type
const getCellComponent = (type: PropertyType) => {
    switch (type) {
        case 'text': return TextCell
        case 'number': return NumberCell
        case 'select': return SelectCell
        case 'multi_select': return MultiSelectCell
        case 'status': return StatusCell
        case 'date': return DateCell
        case 'checkbox': return CheckboxCell
        default: return TextCell
    }
}

interface DatabaseTableProps {
    databaseId: string
    properties: Property[]
    data: Page[]
    onRefresh: () => void
    onAddProperty: () => void
}

export const DatabaseTable: React.FC<DatabaseTableProps> = ({
    databaseId,
    properties,
    data,
    onRefresh,
    onAddProperty
}) => {
    // State for property values mapping (pageId -> { propertyId: value })
    const [values, setValues] = useState<Record<string, Record<string, any>>>({})
    const [loading, setLoading] = useState(true)

    // Fetch all values
    useEffect(() => {
        const fetchValues = async () => {
            const map: Record<string, Record<string, any>> = {}
            for (const page of data) {
                const pageValues = await window.electronAPI.value.getPageMap(page.id)
                map[page.id] = pageValues
            }
            setValues(map)
            setLoading(false)
        }
        if (data.length > 0) {
            fetchValues()
        } else {
            setLoading(false)
        }
    }, [data, properties]) // refetch if rows or cols change

    // Create columns
    const columns = useMemo(() => {
        return [
            // Title column (fixed)
            {
                id: 'title',
                header: 'Name',
                accessorKey: 'title',
                size: 200,
                cell: (info: any) => (
                    <div className="px-2 py-1 text-sm font-medium text-white flex items-center h-full">
                        {/* TODO: Icon */}
                        <span className="mr-2">📄</span>
                        {info.getValue()}
                    </div>
                )
            },
            // Dynamic property columns
            ...properties.map(prop => ({
                id: prop.id,
                header: () => (
                    <div className="flex items-center space-x-2 text-xs font-normal text-[#9B9A97]">
                        {/* TODO: Type Icon */}
                        <span>{prop.name}</span>
                    </div>
                ),
                accessorFn: (row: Page) => values[row.id]?.[prop.id],
                cell: (info: any) => {
                    const Cell = getCellComponent(prop.type) as any
                    const value = info.getValue()
                    const row = info.row.original as Page

                    return (
                        <Cell
                            pageId={row.id}
                            property={prop}
                            value={value}
                            onSave={async (val: any) => {
                                // Optimistic update
                                setValues(prev => ({
                                    ...prev,
                                    [row.id]: {
                                        ...prev[row.id],
                                        [prop.id]: val
                                    }
                                }))
                                // Persist
                                await window.electronAPI.value.set(row.id, prop.id, val)
                            }}
                            // Some cells need update capability (like Select creating options)
                            onUpdateProperty={
                                ['select', 'multi_select'].includes(prop.type)
                                    ? async (updates: any) => {
                                        await window.electronAPI.db.updateProperty(prop.id, updates)
                                        onRefresh() // Refresh to get new config options
                                    }
                                    : undefined
                            }
                        />
                    )
                }
            }))
        ]
    }, [properties, values, onRefresh])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    // Add new row handler
    const handleAddRow = async () => {
        await window.electronAPI.page.create(databaseId, 'database')
        onRefresh()
    }

    if (loading) return <div className="p-4 text-[#9B9A97]">Loading...</div>

    return (
        <div className="w-full overflow-x-auto pb-20">
            <div className="min-w-full inline-block align-middle">
                <div className="border-b border-[#2f2f2f] border-r">
                    {table.getHeaderGroups().map(headerGroup => (
                        <div key={headerGroup.id} className="flex">
                            {headerGroup.headers.map(header => (
                                <div
                                    key={header.id}
                                    style={{ width: header.getSize() }}
                                    className="h-8 border-r border-[#2f2f2f] px-2 flex items-center bg-[#191919] hover:bg-[#2f2f2f] transition-colors relative group"
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {/* Resizer handle could go here */}
                                </div>
                            ))}
                            {/* Add Property Button */}
                            <button
                                onClick={onAddProperty}
                                className="h-8 w-8 flex items-center justify-center text-[#9B9A97] hover:bg-[#2f2f2f] hover:text-white transition-colors border-r border-[#2f2f2f]"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div>
                    {table.getRowModel().rows.map(row => (
                        <div key={row.id} className="flex border-b border-[#2f2f2f] group">
                            {row.getVisibleCells().map(cell => (
                                <div
                                    key={cell.id}
                                    style={{ width: cell.column.getSize() }}
                                    className="border-r border-[#2f2f2f] min-h-[32px] relative"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </div>
                            ))}
                            <div className="border-r border-[#2f2f2f] w-8" />
                        </div>
                    ))}

                    {/* New Row Button */}
                    <div
                        onClick={handleAddRow}
                        className="flex items-center h-8 px-2 text-[#9B9A97] hover:bg-[#2f2f2f] cursor-pointer border-b border-[#2f2f2f] border-r"
                    >
                        <Plus size={14} className="mr-2" />
                        <span className="text-sm">New</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
