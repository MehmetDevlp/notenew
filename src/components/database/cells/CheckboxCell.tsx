import React, { useState } from 'react'
import { Check } from 'lucide-react'
import type { CheckboxProperty, CheckboxValue } from '../../../types/property'

interface CheckboxCellProps {
    pageId: string
    property: CheckboxProperty
    value: CheckboxValue | null
    onSave: (value: CheckboxValue) => Promise<void>
}

/**
 * CheckboxCell - Toggle checkbox component
 * 
 * Features:
 * - Click to toggle
 * - Instant save
 * - Visual feedback
 * - Keyboard accessible
 * 
 * @example
 * <CheckboxCell
 *   pageId="page-123"
 *   property={checkboxProperty}
 *   value={{ checked: true }}
 *   onSave={async (val) => {
 *     await window.electronAPI.property.setValue(pageId, propertyId, val)
 *   }}
 * />
 */
export const CheckboxCell: React.FC<CheckboxCellProps> = ({
    pageId,
    property,
    value,
    onSave
}) => {
    const [isSaving, setIsSaving] = useState(false)
    const isChecked = value?.checked || false

    const handleToggle = async () => {
        if (isSaving) return

        setIsSaving(true)
        try {
            await onSave({ checked: !isChecked })
        } catch (error) {
            console.error('Failed to save checkbox:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
        }
    }

    return (
        <div className="px-2 py-1 min-h-[32px] flex items-center">
            <button
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                disabled={isSaving}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all disabled:opacity-50 ${isChecked
                        ? 'bg-[#2383e2] border-[#2383e2]'
                        : 'bg-transparent border-[#404040] hover:border-[#9B9A97]'
                    }`}
                aria-label={isChecked ? 'Uncheck' : 'Check'}
                aria-checked={isChecked}
                role="checkbox"
            >
                {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
            </button>
        </div>
    )
}
