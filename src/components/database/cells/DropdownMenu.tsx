import React, { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'

export interface DropdownOption {
    id: string
    label: string
    color?: string
    group?: string
}

interface DropdownMenuProps {
    options: DropdownOption[]
    onSelect: (option: DropdownOption) => void
    onClose: () => void
    placeholder?: string
    allowCreate?: boolean
    onCreate?: (name: string) => void
    position?: { top: number; left: number }
    multiSelect?: boolean
    selectedIds?: string[]
}

/**
 * DropdownMenu - Reusable dropdown with search and keyboard navigation
 * 
 * Features:
 * - Search filtering
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Optional create new option
 * - Group support for Status properties
 * - Multi-select support
 * 
 * @example
 * <DropdownMenu
 *   options={[
 *     { id: '1', label: 'Option 1', color: 'blue' },
 *     { id: '2', label: 'Option 2', color: 'green' }
 *   ]}
 *   onSelect={(opt) => console.log(opt)}
 *   onClose={() => setOpen(false)}
 *   allowCreate
 *   onCreate={(name) => console.log('Create:', name)}
 * />
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
    options,
    onSelect,
    onClose,
    placeholder = 'Search...',
    allowCreate = false,
    onCreate,
    position,
    multiSelect = false,
    selectedIds = []
}) => {
    const [search, setSearch] = useState('')
    const [focusedIndex, setFocusedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    // Filter options based on search
    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    )

    // Group options if they have group property
    const groupedOptions = filteredOptions.reduce((acc, opt) => {
        const group = opt.group || 'default'
        if (!acc[group]) acc[group] = []
        acc[group].push(opt)
        return acc
    }, {} as Record<string, DropdownOption[]>)

    const hasGroups = Object.keys(groupedOptions).length > 1

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onClose])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose()
            return
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setFocusedIndex(prev => Math.max(prev - 1, 0))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (filteredOptions.length > 0 && focusedIndex < filteredOptions.length) {
                onSelect(filteredOptions[focusedIndex])
                if (!multiSelect) onClose()
            } else if (allowCreate && onCreate && search.trim()) {
                onCreate(search.trim())
                setSearch('')
            }
        }
    }

    return (
        <div
            ref={menuRef}
            className="absolute z-50 bg-[#191919] border border-[#404040] rounded-md shadow-lg min-w-[200px] max-w-[300px]"
            style={position ? { top: position.top, left: position.left } : {}}
        >
            {/* Search Input */}
            <div className="p-2 border-b border-[#404040]">
                <div className="flex items-center gap-2 px-2 py-1.5 bg-[#2f2f2f] rounded">
                    <Search size={14} className="text-[#9B9A97]" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#9B9A97]"
                    />
                </div>
            </div>

            {/* Options List */}
            <div className="max-h-[300px] overflow-y-auto py-1">
                {hasGroups ? (
                    // Grouped options (for Status)
                    Object.entries(groupedOptions).map(([group, opts]) => (
                        <div key={group}>
                            {group !== 'default' && (
                                <div className="px-3 py-1.5 text-xs font-medium text-[#9B9A97] uppercase">
                                    {group}
                                </div>
                            )}
                            {opts.map((opt, idx) => {
                                const globalIndex = filteredOptions.indexOf(opt)
                                const isSelected = selectedIds.includes(opt.id)
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => {
                                            onSelect(opt)
                                            if (!multiSelect) onClose()
                                        }}
                                        className={`w-full px-3 py-1.5 text-left text-sm transition-colors flex items-center gap-2 ${globalIndex === focusedIndex
                                                ? 'bg-[#2383e2] text-white'
                                                : 'text-white hover:bg-[#2f2f2f]'
                                            }`}
                                    >
                                        {multiSelect && (
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                readOnly
                                                className="pointer-events-none"
                                            />
                                        )}
                                        <span>{opt.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    ))
                ) : (
                    // Flat options
                    filteredOptions.map((opt, idx) => {
                        const isSelected = selectedIds.includes(opt.id)
                        return (
                            <button
                                key={opt.id}
                                onClick={() => {
                                    onSelect(opt)
                                    if (!multiSelect) onClose()
                                }}
                                className={`w-full px-3 py-1.5 text-left text-sm transition-colors flex items-center gap-2 ${idx === focusedIndex
                                        ? 'bg-[#2383e2] text-white'
                                        : 'text-white hover:bg-[#2f2f2f]'
                                    }`}
                            >
                                {multiSelect && (
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className="pointer-events-none"
                                    />
                                )}
                                <span>{opt.label}</span>
                            </button>
                        )
                    })
                )}

                {/* No results */}
                {filteredOptions.length === 0 && !allowCreate && (
                    <div className="px-3 py-2 text-sm text-[#9B9A97]">No options found</div>
                )}

                {/* Create new option */}
                {allowCreate && onCreate && search.trim() && (
                    <button
                        onClick={() => {
                            onCreate(search.trim())
                            setSearch('')
                        }}
                        className="w-full px-3 py-1.5 text-left text-sm text-[#2383e2] hover:bg-[#2f2f2f] transition-colors"
                    >
                        Create "{search.trim()}"
                    </button>
                )}
            </div>
        </div>
    )
}
