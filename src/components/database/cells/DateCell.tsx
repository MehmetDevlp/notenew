import React, { useState, useRef, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import type { DateProperty, DateValue } from '../../../types/property'

interface DateCellProps {
    pageId: string
    property: DateProperty
    value: DateValue | null
    onSave: (value: DateValue) => Promise<void>
}

/**
 * DateCell - Date picker with formatting
 * 
 * Features:
 * - Click to edit
 * - HTML5 date picker
 * - Formatted display
 * - Optional time support (future enhancement)
 * 
 * @example
 * <DateCell
 *   pageId="page-123"
 *   property={dateProperty}
 *   value={{ start: '2026-01-15', includeTime: false }}
 *   onSave={async (val) => {
 *     await window.electronAPI.property.setValue(pageId, propertyId, val)
 *   }}
 * />
 */
export const DateCell: React.FC<DateCellProps> = ({
    pageId,
    property,
    value,
    onSave
}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [dateValue, setDateValue] = useState(value?.start || '')
    const [isSaving, setIsSaving] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    const formatDate = (dateStr: string): string => {
        if (!dateStr) return 'Empty'

        try {
            const date = new Date(dateStr)
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })
        } catch {
            return dateStr
        }
    }

    const handleSave = async () => {
        if (!dateValue) {
            setIsEditing(false)
            return
        }

        if (dateValue === value?.start) {
            setIsEditing(false)
            return
        }

        setIsSaving(true)
        try {
            await onSave({
                start: dateValue,
                includeTime: value?.includeTime || false
            })
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to save date:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setDateValue(value?.start || '')
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSave()
        } else if (e.key === 'Escape') {
            e.preventDefault()
            handleCancel()
        }
    }

    if (isEditing) {
        return (
            <div className="px-2 py-1">
                <input
                    ref={inputRef}
                    type="date"
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    disabled={isSaving}
                    className="w-full bg-[#2f2f2f] text-sm text-white outline-none px-2 py-1 rounded border border-[#404040] disabled:opacity-50"
                />
            </div>
        )
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 min-h-[32px] flex items-center gap-2 cursor-pointer hover:bg-[#2f2f2f] transition-colors rounded group"
        >
            <Calendar size={14} className="text-[#9B9A97] group-hover:text-white transition-colors" />
            {value?.start ? (
                <span className="text-sm text-white">{formatDate(value.start)}</span>
            ) : (
                <span className="text-sm text-[#9B9A97]">Empty</span>
            )}
        </div>
    )
}
