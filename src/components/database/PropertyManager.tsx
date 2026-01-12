import React from 'react'
import {
    GripVertical,
    Trash2,
    X
} from 'lucide-react'
import { Property } from '../../types/property'

interface PropertyManagerProps {
    isOpen: boolean
    onClose: () => void
    properties: Property[]
    onDelete: (id: string) => void
    onUpdate: (id: string, updates: any) => void
}

export const PropertyManager: React.FC<PropertyManagerProps> = ({
    isOpen,
    onClose,
    properties,
    onDelete
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[400px] bg-[#191919] border border-[#2f2f2f] rounded-lg shadow-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[#2f2f2f]">
                    <h2 className="text-sm font-medium text-white">Properties</h2>
                    <button onClick={onClose} className="text-[#9B9A97] hover:text-white">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-2 max-h-[400px] overflow-y-auto">
                    {properties.map((prop) => (
                        <div
                            key={prop.id}
                            className="flex items-center justify-between p-2 rounded hover:bg-[#2f2f2f] group"
                        >
                            <div className="flex items-center">
                                <GripVertical size={14} className="text-[#9B9A97] mr-2 cursor-grab" />
                                <span className="text-sm text-white">{prop.name}</span>
                                <span className="ml-2 text-xs text-[#9B9A97] border border-[#2f2f2f] px-1 rounded">
                                    {prop.type}
                                </span>
                            </div>

                            <button
                                onClick={() => {
                                    if (confirm(`Delete property "${prop.name}"?`)) {
                                        onDelete(prop.id)
                                    }
                                }}
                                className="text-[#9B9A97] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}

                    {properties.length === 0 && (
                        <div className="text-center text-[#9B9A97] text-sm py-4">
                            No properties yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
