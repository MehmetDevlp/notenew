import React, { useState, useRef } from 'react'
import type { StatusProperty, StatusValue } from '../../../types/property'
import { PropertyPill } from './PropertyPill'
import { DropdownMenu, DropdownOption } from './DropdownMenu'

interface StatusCellProps {
    pageId: string
    property: StatusProperty
    value: StatusValue | null
    onSave: (value: StatusValue) => Promise<void>
}

/**
 * StatusCell - Status dropdown with grouped options
 * 
 * Features:
 * - Click to open dropdown
 * - 3 groups: To-do, In Progress, Complete
 * - Colored pill display
 * - Group headers in dropdown
 * - Keyboard navigation
 * 
 * @example
 * <StatusCell
 *   pageId="page-123"
 *   property={statusProperty}
 *   value={{ id: 'in-progress', name: 'Working', color: 'yellow' }}
 *   onSave={async (val) => {
 *     await window.electronAPI.property.setValue(pageId, propertyId, val)
 *   }}
 * />
 */
export const StatusCell: React.FC<StatusCellProps> = ({
    pageId,
    property,
    value,
    onSave
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const cellRef = useRef<HTMLDivElement>(null)

    // Flatten all options from all groups
    const options: DropdownOption[] = property.config.groups.flatMap(group =>
        group.options.map(opt => ({
            id: opt.id,
            label: opt.name,
            color: opt.color,
            group: group.name
        }))
    )

    const handleSelect = async (option: DropdownOption) => {
        setIsSaving(true)
        try {
            // Find the actual option from the groups
            let selectedOption = null
            for (const group of property.config.groups) {
                const found = group.options.find(o => o.id === option.id)
                if (found) {
                    selectedOption = found
                    break
                }
            }

            if (selectedOption) {
                await onSave(selectedOption)
            }
            setIsOpen(false)
        } catch (error) {
            console.error('Failed to save status:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleClear = async () => {
        setIsSaving(true)
        try {
            await onSave(null)
        } catch (error) {
            console.error('Failed to clear status:', error)
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
                    Not started
                </button>
            )}

            {isOpen && (
                <DropdownMenu
                    options={options}
                    onSelect={handleSelect}
                    onClose={() => setIsOpen(false)}
                    placeholder="Search status..."
                />
            )}
        </div>
    )
}
