import React, { useState, useRef, useEffect } from 'react'
import type { TextProperty, TextValue } from '../../../types/property'

interface TextCellProps {
    pageId: string
    property: TextProperty
    value: TextValue | null
    onSave: (value: TextValue) => Promise<void>
}

/**
 * TextCell - Plain text input with auto-save
 * 
 * Features:
 * - Click to edit
 * - Auto-save on blur or Enter
 * - Cancel on Escape
 * - Empty state display
 * 
 * @example
 * <TextCell
 *   pageId="page-123"
 *   property={textProperty}
 *   value={{ text: 'Hello' }}
 *   onSave={async (val) => {
 *     await window.electronAPI.property.setValue(pageId, propertyId, val)
 *   }}
 * />
 */
export const TextCell: React.FC<TextCellProps> = ({
    pageId,
    property,
    value,
    onSave
}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [text, setText] = useState(value?.text || '')
    const [isSaving, setIsSaving] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    const handleSave = async () => {
        if (text === (value?.text || '')) {
            setIsEditing(false)
            return
        }

        setIsSaving(true)
        try {
            await onSave({ text })
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to save text:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setText(value?.text || '')
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
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
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
            {value?.text ? (
                <span className="text-sm text-white">{value.text}</span>
            ) : (
                <span className="text-sm text-[#9B9A97]">Empty</span>
            )}
        </div>
    )
}
