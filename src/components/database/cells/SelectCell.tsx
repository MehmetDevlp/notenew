import React, { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { SelectProperty, SelectValue, PropertyColor } from '../../../types/property'
import { PropertyPill } from './PropertyPill'
import { DropdownMenu, DropdownOption } from './DropdownMenu'

interface SelectCellProps {
    pageId: string
    property: SelectProperty
    value: SelectValue | null
    onSave: (value: SelectValue) => Promise<void>
    onUpdateProperty?: (updates: { config: any }) => Promise<void>
}

/**
 * SelectCell - Single select dropdown with colored pills
 * 
 * Features:
 * - Click to open dropdown
 * - Search and filter options
 * - Create new options
 * - Colored pill display
 * - Keyboard navigation
 * 
 * @example
 * <SelectCell
 *   pageId="page-123"
 *   property={selectProperty}
 *   value={{ id: '1', name: 'High', color: 'red' }}
 *   onSave={async (val) => {
 *     await window.electronAPI.property.setValue(pageId, propertyId, val)
 *   }}
 *   onUpdateProperty={async (updates) => {
 *     await window.electronAPI.property.update(propertyId, updates)
 *   }}
 * />
 */
export const SelectCell: React.FC<SelectCellProps> = ({
    pageId,
    property,
    value,
    onSave,
    onUpdateProperty
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const cellRef = useRef<HTMLDivElement>(null)

    const options: DropdownOption[] = property.config.options.map(opt => ({
        id: opt.id,
        label: opt.name,
        color: opt.color
    }))

    const handleSelect = async (option: DropdownOption) => {
        setIsSaving(true)
        try {
            const selectedOption = property.config.options.find(o => o.id === option.id)
            if (selectedOption) {
                await onSave(selectedOption)
            }
            setIsOpen(false)
        } catch (error) {
            console.error('Failed to save select:', error)
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
            await onSave(newOption)
            setIsOpen(false)
        } catch (error) {
            console.error('Failed to create option:', error)
        }
    }

    const handleClear = async () => {
        setIsSaving(true)
        try {
            await onSave(null)
        } catch (error) {
            console.error('Failed to clear select:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div ref={cellRef} className="relative px-2 py-1 min-h-[32px] flex items-center">
            {value ? (
                <PropertyPill
                    label={value.name}
                    color={value.color}
                    onClick={() => !isSaving && setIsOpen(true)}
                    onRemove={handleClear}
                />
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    disabled={isSaving}
                    className="text-sm text-[#9B9A97] hover:text-white transition-colors disabled:opacity-50"
                >
                    Empty
                </button>
            )}

            {isOpen && (
                <DropdownMenu
                    options={options}
                    onSelect={handleSelect}
                    onClose={() => setIsOpen(false)}
                    allowCreate={!!onUpdateProperty}
                    onCreate={handleCreate}
                    placeholder="Search or create..."
                />
            )}
        </div>
    )
}
