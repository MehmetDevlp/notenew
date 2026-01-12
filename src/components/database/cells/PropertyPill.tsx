import React from 'react'
import { X } from 'lucide-react'
import type { PropertyColor } from '../../../types/property'

interface PropertyPillProps {
    label: string
    color: PropertyColor
    onRemove?: () => void
    onClick?: () => void
    className?: string
}

// Notion's exact color scheme for property tags
const colorStyles: Record<PropertyColor, { bg: string; text: string }> = {
    gray: { bg: 'rgba(155,154,151,0.2)', text: '#9B9A97' },
    brown: { bg: 'rgba(159,107,83,0.2)', text: '#9F6B53' },
    orange: { bg: 'rgba(217,115,13,0.2)', text: '#D9730D' },
    yellow: { bg: 'rgba(223,171,1,0.2)', text: '#DFAB01' },
    green: { bg: 'rgba(0,135,107,0.2)', text: '#00876B' },
    blue: { bg: 'rgba(11,110,153,0.2)', text: '#0B6E99' },
    purple: { bg: 'rgba(144,101,176,0.2)', text: '#9065B0' },
    pink: { bg: 'rgba(221,0,129,0.2)', text: '#DD0081' },
    red: { bg: 'rgba(224,62,62,0.2)', text: '#E03E3E' },
}

/**
 * PropertyPill - Reusable colored pill component for Select and Status properties
 * 
 * @example
 * // Basic usage
 * <PropertyPill label="In Progress" color="blue" />
 * 
 * // With click handler
 * <PropertyPill label="High Priority" color="red" onClick={() => console.log('clicked')} />
 * 
 * // With remove button (for multi-select)
 * <PropertyPill label="Tag" color="green" onRemove={() => console.log('removed')} />
 */
export const PropertyPill: React.FC<PropertyPillProps> = ({
    label,
    color,
    onRemove,
    onClick,
    className = ''
}) => {
    const styles = colorStyles[color]

    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-opacity ${onClick ? 'cursor-pointer hover:opacity-80' : ''
                } ${className}`}
            style={{
                backgroundColor: styles.bg,
                color: styles.text
            }}
            onClick={onClick}
        >
            <span>{label}</span>
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove()
                    }}
                    className="hover:opacity-70 transition-opacity"
                    aria-label={`Remove ${label}`}
                >
                    <X size={12} />
                </button>
            )}
        </span>
    )
}
