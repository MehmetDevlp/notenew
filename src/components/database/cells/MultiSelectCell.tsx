import React, { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Plus } from 'lucide-react'
import type { MultiSelectProperty, MultiSelectValue, PropertyColor } from '../../../types/property'
import { PropertyPill } from './PropertyPill'
import { DropdownMenu, DropdownOption } from './DropdownMenu'

interface MultiSelectCellProps {
    pageId: string
    property: MultiSelectProperty
    value: MultiSelectValue | null
    onSave: (value: MultiSelectValue) => Promise<void>
    onUpdateProperty?: (updates: { config: any }) => Promise<void>
}

/**
 * MultiSelectCell - Multi-select dropdown with colored pills
 * 
 * Features:
 * - Click to open dropdown
 * - Multiple selection with checkboxes
 * - Create new options
 * - Multiple colored pills display
 * - Remove individual pills
 * 
 * @example
 * <MultiSelectCell
 *   pageId="page-123"
 *   property={multiSelectProperty}
 *   value={[
 *     { id: '1', name: 'Frontend', color: 'blue' },
 *     { id: '2', name: 'Backend', color: 'green' }
 *   ]}
 *   onSave={async (val) => {
 *     await window.electronAPI.property.setValue(pageId, propertyId, val)
 *   }}
 * />
 */
export const MultiSelectCell: React.FC<MultiSelectCellProps> = ({
    pageId,
    property,
    value,
    onSave,
    onUpdateProperty
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const cellRef = useRef<HTMLDivElement>(null)

    const selectedValues = value || []

    const options: DropdownOption[] = property.config.options.map(opt => ({
        id: opt.id,
        label: opt.name,
        color: opt.color
    }))

    const handleSelect = async (option: DropdownOption) => {
        const selectedOption = property.config.options.find(o => o.id === option.id)
        if (!selectedOption) return

        setIsSaving(true)
        try {
            // Toggle selection
            const isSelected = selectedValues.some(v => v.id === option.id)
            const newValue = isSelected
                ? selectedValues.filter(v => v.id !== option.id)
                : [...selectedValues, selectedOption]

            await onSave(newValue)
        } catch (error) {
            console.error('Failed to save multi-select:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleRemove = async (optionId: string) => {
        setIsSaving(true)
        try {
            const newValue = selectedValues.filter(v => v.id !== optionId)
            await onSave(newValue)
        } catch (error) {
            console.error('Failed to remove option:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCreate = async (name: string) => {
        if (!onUpdateProperty) return

        const colors: PropertyColor[] = ['gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red']
        const newOption = {
            id: uuidv4(),
            name,
            color: colors[property.config.options.length % colors.length]
        }

        try {
            const updatedOptions = [...property.config.options, newOption]
            await onUpdateProperty({ config: { options: updatedOptions } })

            // Auto-select the newly created option
            const newValue = [...selectedValues, newOption]
            await onSave(newValue)
        } catch (error) {
            console.error('Failed to create option:', error)
        }
    }

    return (
        <div ref={cellRef} className="relative px-2 py-1 min-h-[32px]">
            <div className="flex flex-wrap gap-1 items-center">
                {selectedValues.length > 0 ? (
                    selectedValues.map(val => (
                        <PropertyPill
                            key={val.id}
                            label={val.name}
                            color={val.color}
                            onRemove={() => handleRemove(val.id)}
                        />
                    ))
                ) : (
                    <span className="text-sm text-[#9B9A97]">Empty</span>
                )}

                <button
                    onClick={() => setIsOpen(true)}
                    disabled={isSaving}
                    className="p-1 hover:bg-[#2f2f2f] rounded transition-colors disabled:opacity-50"
                    aria-label="Add option"
                >
                    <Plus size={14} className="text-[#9B9A97]" />
                </button>
            </div>

            {isOpen && (
                <DropdownMenu
                    options={options}
                    onSelect={handleSelect}
                    onClose={() => setIsOpen(false)}
                    allowCreate={!!onUpdateProperty}
                    onCreate={handleCreate}
                    placeholder="Search or create..."
                    multiSelect
                    selectedIds={selectedValues.map(v => v.id)}
                />
            )}
        </div>
    )
}
