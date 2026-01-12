import React, { useState, useRef, useEffect } from 'react'
import type { NumberProperty, NumberValue } from '../../../types/property'

interface NumberCellProps {
    pageId: string
    property: NumberProperty
    value: NumberValue | null
    onSave: (value: NumberValue) => Promise<void>
}

/**
 * NumberCell - Number input with format support (number, percent, dollar)
 * 
 * Features:
 * - Click to edit
 * - Auto-save on blur or Enter
 * - Format display (plain, %, $)
 * - Null value handling
 * 
 * @example
 * <NumberCell
 *   pageId="page-123"
 *   property={numberProperty}
 *   value={{ number: 95 }}
 *   onSave={async (val) => {
 *     await window.electronAPI.property.setValue(pageId, propertyId, val)
 *   }}
 * />
 */
export const NumberCell: React.FC<NumberCellProps> = ({
    pageId,
    property,
    value,
    onSave
}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [inputValue, setInputValue] = useState(value?.number?.toString() || '')
    const [isSaving, setIsSaving] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const format = property.config.format || 'number'

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    const formatDisplay = (num: number | null): string => {
        if (num === null) return 'Empty'

        switch (format) {
            case 'percent':
                return `${num}%`
            case 'dollar':
                return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            default:
                return num.toLocaleString('en-US')
        }
    }

    const handleSave = async () => {
        const numValue = inputValue.trim() === '' ? null : parseFloat(inputValue)

        if (numValue === value?.number) {
            setIsEditing(false)
            return
        }

        setIsSaving(true)
        try {
            await onSave({ number: numValue })
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to save number:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setInputValue(value?.number?.toString() || '')
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
                    type="number"
                    step="any"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    disabled={isSaving}
                    className="w-full bg-transparent text-sm text-white outline-none disabled:opacity-50"
                    placeholder="Empty"
                />
            </div>
        )
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 min-h-[32px] flex items-center cursor-text hover:bg-[#2f2f2f] transition-colors rounded"
        >
            {value?.number !== null && value?.number !== undefined ? (
                <span className="text-sm text-white">{formatDisplay(value.number)}</span>
            ) : (
                <span className="text-sm text-[#9B9A97]">Empty</span>
            )}
        </div>
    )
}
