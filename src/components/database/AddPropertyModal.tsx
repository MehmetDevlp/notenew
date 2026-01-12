import React from 'react'
import {
    Type,
    Hash,
    List,
    CheckSquare,
    Calendar,
    Tag,
    CheckCircle2,
    X
} from 'lucide-react'
import { PropertyType } from '../../types/property'

interface AddPropertyModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (name: string, type: PropertyType) => void
}

const PROPERTY_TYPES: { type: PropertyType; label: string; icon: any; description: string }[] = [
    { type: 'text', label: 'Text', icon: Type, description: 'Descriptive text' },
    { type: 'number', label: 'Number', icon: Hash, description: 'Numbers and currencies' },
    { type: 'select', label: 'Select', icon: List, description: 'Select one option' },
    { type: 'multi_select', label: 'Multi-select', icon: Tag, description: 'Select multiple options' },
    { type: 'status', label: 'Status', icon: CheckCircle2, description: 'Track progress' },
    { type: 'date', label: 'Date', icon: Calendar, description: 'Date and time' },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Simple checkbox' },
]

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
    isOpen,
    onClose,
    onAdd
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[600px] bg-[#191919] border border-[#2f2f2f] rounded-lg shadow-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[#2f2f2f]">
                    <h2 className="text-sm font-medium text-white">New Property</h2>
                    <button onClick={onClose} className="text-[#9B9A97] hover:text-white">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-2 grid grid-cols-2 gap-2 h-[400px] overflow-y-auto">
                    {PROPERTY_TYPES.map((item) => (
                        <button
                            key={item.type}
                            onClick={() => onAdd(item.label, item.type)}
                            className="flex items-center p-2 rounded hover:bg-[#2f2f2f] text-left transition-colors group"
                        >
                            <div className="w-8 h-8 flex items-center justify-center rounded border border-[#2f2f2f] bg-[#202020] text-[#9B9A97] group-hover:text-white mr-3">
                                <item.icon size={16} />
                            </div>
                            <div>
                                <div className="text-sm text-white">{item.label}</div>
                                <div className="text-xs text-[#9B9A97]">{item.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
