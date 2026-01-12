/**
 * Property System Type Definitions
 * 
 * Defines all property types for the database system, including:
 * - Text, Number, Select, MultiSelect, Date, Checkbox, Status
 * - Type-specific configurations
 * - Property values with discriminated unions for type safety
 */

// ============================================================================
// Base Types
// ============================================================================

export type PropertyType =
    | 'text'
    | 'number'
    | 'select'
    | 'multi_select'
    | 'date'
    | 'checkbox'
    | 'status'

export type PropertyColor =
    | 'gray'
    | 'brown'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'red'

// ============================================================================
// Property Configurations
// ============================================================================

export interface TextPropertyConfig {
    // No special configuration for text properties
}

export interface NumberPropertyConfig {
    format: 'number' | 'percent' | 'dollar'
}

export interface SelectOption {
    id: string
    name: string
    color: PropertyColor
}

export interface SelectPropertyConfig {
    options: SelectOption[]
}

export interface MultiSelectPropertyConfig {
    options: SelectOption[]
}

export interface DatePropertyConfig {
    // No special configuration - values contain start/end/time
}

export interface CheckboxPropertyConfig {
    // No special configuration
}

export interface StatusGroup {
    id: string
    name: string // e.g., "To-do", "In Progress", "Complete"
    options: SelectOption[]
}

export interface StatusPropertyConfig {
    groups: StatusGroup[] // Must have exactly 3 groups
}

// ============================================================================
// Base Property Interface
// ============================================================================

interface BaseProperty {
    id: string
    database_id: string
    name: string
    order_index: number
    visible: boolean
    created_at: number // Unix timestamp in milliseconds
}

// ============================================================================
// Property Type Definitions (Discriminated Union)
// ============================================================================

export interface TextProperty extends BaseProperty {
    type: 'text'
    config: TextPropertyConfig
}

export interface NumberProperty extends BaseProperty {
    type: 'number'
    config: NumberPropertyConfig
}

export interface SelectProperty extends BaseProperty {
    type: 'select'
    config: SelectPropertyConfig
}

export interface MultiSelectProperty extends BaseProperty {
    type: 'multi_select'
    config: MultiSelectPropertyConfig
}

export interface DateProperty extends BaseProperty {
    type: 'date'
    config: DatePropertyConfig
}

export interface CheckboxProperty extends BaseProperty {
    type: 'checkbox'
    config: CheckboxPropertyConfig
}

export interface StatusProperty extends BaseProperty {
    type: 'status'
    config: StatusPropertyConfig
}

// Discriminated union of all property types
export type Property =
    | TextProperty
    | NumberProperty
    | SelectProperty
    | MultiSelectProperty
    | DateProperty
    | CheckboxProperty
    | StatusProperty

// ============================================================================
// Property Value Types
// ============================================================================

export interface TextValue {
    text: string
}

export interface NumberValue {
    number: number | null
}

export type SelectValue = SelectOption | null

export type MultiSelectValue = SelectOption[]

export interface DateValue {
    start: string // ISO 8601 date string
    end?: string // Optional end date for ranges
    includeTime?: boolean
}

export interface CheckboxValue {
    checked: boolean
}

export type StatusValue = SelectOption | null

// ============================================================================
// Property Value Discriminated Union
// ============================================================================

export interface PropertyValueBase {
    id: string
    page_id: string
    property_id: string
}

export interface TextPropertyValue extends PropertyValueBase {
    type: 'text'
    value: TextValue
}

export interface NumberPropertyValue extends PropertyValueBase {
    type: 'number'
    value: NumberValue
}

export interface SelectPropertyValue extends PropertyValueBase {
    type: 'select'
    value: SelectValue
}

export interface MultiSelectPropertyValue extends PropertyValueBase {
    type: 'multi_select'
    value: MultiSelectValue
}

export interface DatePropertyValue extends PropertyValueBase {
    type: 'date'
    value: DateValue
}

export interface CheckboxPropertyValue extends PropertyValueBase {
    type: 'checkbox'
    value: CheckboxValue
}

export interface StatusPropertyValue extends PropertyValueBase {
    type: 'status'
    value: StatusValue
}

export type PropertyValue =
    | TextPropertyValue
    | NumberPropertyValue
    | SelectPropertyValue
    | MultiSelectPropertyValue
    | DatePropertyValue
    | CheckboxPropertyValue
    | StatusPropertyValue

// ============================================================================
// Helper Types for API
// ============================================================================

export interface CreatePropertyInput {
    name: string
    type: PropertyType
    config?: any // Type-specific config
}

export interface UpdatePropertyInput {
    name?: string
    config?: any
    order_index?: number
    visible?: boolean
}

// ============================================================================
// Type Guards
// ============================================================================

export function isTextProperty(property: Property): property is TextProperty {
    return property.type === 'text'
}

export function isNumberProperty(property: Property): property is NumberProperty {
    return property.type === 'number'
}

export function isSelectProperty(property: Property): property is SelectProperty {
    return property.type === 'select'
}

export function isMultiSelectProperty(property: Property): property is MultiSelectProperty {
    return property.type === 'multi_select'
}

export function isDateProperty(property: Property): property is DateProperty {
    return property.type === 'date'
}

export function isCheckboxProperty(property: Property): property is CheckboxProperty {
    return property.type === 'checkbox'
}

export function isStatusProperty(property: Property): property is StatusProperty {
    return property.type === 'status'
}
