# 🎯 NOTION ARAŞTIRMA RAPORU - DETAYLI ANALİZ

> **Hazırlanma Tarihi:** 12 Ocak 2025  
> **Kaynak:** Web araştırması + Notion resmi dokümantasyonu  
> **Amaç:** Electron Notion Clone için complete feature list

---

## 📊 PART 1: PROPERTY TYPES (Tamamı 17 Adet)

### 🔵 TEMEL PROPERTY'LER (Basic - Priority 1)

#### 1. **Title Property**
```typescript
interface TitleProperty {
  id: string
  type: 'title'
  name: string  // Default: "Name" veya "İsim"
  // Her database'de ZORUNLU
  // Silinemiyor, sadece rename edilebilir
}
```
**Kullanım:**
- Her database item'ının ana identifier'ı
- Clickable → sayfa açılır
- Text editing inline mümkün

---

#### 2. **Text Property**
```typescript
interface TextProperty {
  id: string
  type: 'text'
  name: string
  value: string  // Any text
}
```
**Kullanım:**
- Açıklamalar, notlar, kısa bilgiler
- Inline editing
- No formatting (plain text only)

---

#### 3. **Number Property**
```typescript
interface NumberProperty {
  id: string
  type: 'number'
  name: string
  value: number | null
  format: 'number' | 'number_with_commas' | 'percent' | 'dollar' | 'euro' | 'pound' | 'yen' | 'ruble' | 'rupee'
  // Visual formats: number, progress_bar, ring
}
```
**Format Options:**
- Plain: `1234`
- With commas: `1,234`
- Percentage: `50%`
- Currency: `$1,234.00`

**Görsel Render:**
- Number gösterimi
- Progress bar (0-100 için)
- Ring chart

---

#### 4. **Select Property** (Single Select)
```typescript
interface SelectProperty {
  id: string
  type: 'select'
  name: string
  value: SelectOption | null
  options: SelectOption[]
}

interface SelectOption {
  id: string
  name: string
  color: 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red'
}
```
**Davranış:**
- Dropdown menu
- Tek seçim
- Renk ile görsel kategorizasyon
- Yeni option inline olarak eklenebilir (typing + Enter)

**Renk Paleti:**
```css
default: #787774
gray: #9B9A97
brown: #64473A
orange: #D9730D
yellow: #DFAB01
green: #0F7B6C
blue: #0B6E99
purple: #6940A5
pink: #AD1A72
red: #E03E3E
```

---

#### 5. **Multi-Select Property**
```typescript
interface MultiSelectProperty {
  id: string
  type: 'multi_select'
  name: string
  value: SelectOption[]  // Multiple selections
  options: SelectOption[]
}
```
**Select'ten Farkı:**
- Birden fazla option seçilebilir
- Pills yan yana görünür
- Same color system

---

#### 6. **Status Property** ⭐ (Özel - Task Management)
```typescript
interface StatusProperty {
  id: string
  type: 'status'
  name: string  // Usually "Status" or "Durum"
  value: StatusOption | null
  groups: StatusGroup[]
}

interface StatusGroup {
  id: string
  name: 'To-do' | 'In progress' | 'Complete'
  color: 'gray' | 'blue' | 'green'
  option_ids: string[]
}

interface StatusOption {
  id: string
  name: string  // e.g. "Not started", "In review", "Done"
  color: string
  group: 'To-do' | 'In progress' | 'Complete'
}
```
**Özellikler:**
- 3 ana group: To-do, In progress, Complete
- Her group farklı renk
- Checkbox olarak da gösterilebilir:
  - Empty checkbox → To-do
  - Dash through → In progress
  - Checked → Complete

**Örnek Default Options:**
```javascript
const defaultStatusOptions = [
  { name: "Not started", group: "To-do", color: "gray" },
  { name: "In progress", group: "In progress", color: "blue" },
  { name: "Done", group: "Complete", color: "green" }
]
```

---

#### 7. **Date Property**
```typescript
interface DateProperty {
  id: string
  type: 'date'
  name: string
  value: {
    start: string  // ISO 8601: "2024-01-15" or "2024-01-15T14:30:00Z"
    end?: string   // Optional end date for date ranges
    time_zone?: string
  } | null
}
```
**Features:**
- Single date OR date range
- Time optional (defaults to midnight if not set)
- Date picker UI
- Relative dates: "Today", "Tomorrow", "Yesterday"
- Reminder support
- Formats:
  - Full: `January 15, 2024`
  - Relative: `Tomorrow`
  - Custom: `01/15/2024`

---

#### 8. **Checkbox Property**
```typescript
interface CheckboxProperty {
  id: string
  type: 'checkbox'
  name: string
  value: boolean  // true or false
}
```
**Kullanım:**
- To-do lists
- Completion tracking
- Binary states (yes/no, done/not done)

---

### 🟡 İLETİŞİM PROPERTY'LERİ (Contact - Priority 2)

#### 9. **URL Property**
```typescript
interface URLProperty {
  id: string
  type: 'url'
  name: string
  value: string | null  // Valid URL
}
```
**Davranış:**
- Clickable link
- Opens in new tab
- Auto-detects URLs

---

#### 10. **Email Property**
```typescript
interface EmailProperty {
  id: string
  type: 'email'
  name: string
  value: string | null  // Valid email
}
```
**Davranış:**
- Clickable → opens mail client
- Validation (must be valid email format)

---

#### 11. **Phone Property**
```typescript
interface PhoneProperty {
  id: string
  type: 'phone'
  name: string
  value: string | null
}
```
**Davranış:**
- Clickable → initiates phone call (mobile)
- No strict validation

---

### 🟢 ADVANCED PROPERTY'LER (Priority 3)

#### 12. **Person Property**
```typescript
interface PersonProperty {
  id: string
  type: 'person'
  name: string
  value: User[]  // Multiple users can be assigned
}

interface User {
  id: string
  name: string
  avatar_url?: string
  email: string
}
```
**Kullanım:**
- Task assignment
- Ownership tracking
- Collaboration
- Notifications (when tagged)

---

#### 13. **Files & Media Property**
```typescript
interface FilesProperty {
  id: string
  type: 'files'
  name: string
  value: File[]
}

interface File {
  id: string
  name: string
  type: 'file' | 'external'
  url: string
  size?: number
}
```
**Davranış:**
- Multiple files per cell
- Upload or paste link
- Drag to reorder
- Actions: Download, Delete, Full screen, View original

---

#### 14. **Relation Property** 🔗 (Database linking)
```typescript
interface RelationProperty {
  id: string
  type: 'relation'
  name: string
  value: RelatedPage[]
  relation: {
    database_id: string
    synced_property_id?: string  // Bidirectional relation
  }
}

interface RelatedPage {
  id: string
  title: string
}
```
**Kullanım:**
- Link to another database
- Example: Tasks → Projects (many-to-one)
- Bidirectional (optional): Projects can see all linked Tasks

---

#### 15. **Rollup Property** 📊 (Aggregations)
```typescript
interface RollupProperty {
  id: string
  type: 'rollup'
  name: string
  relation_property_id: string  // Which relation to use
  rollup_property_id: string    // Which property from related items
  function: RollupFunction
}

type RollupFunction = 
  | 'count_all'
  | 'count_values'
  | 'count_unique_values'
  | 'count_empty'
  | 'count_not_empty'
  | 'percent_empty'
  | 'percent_not_empty'
  | 'sum'
  | 'average'
  | 'median'
  | 'min'
  | 'max'
  | 'range'
  | 'show_original'
```
**Kullanım:**
- Aggregate data from related database
- Example: Project → Count of completed tasks
- Example: Project → Sum of task hours

---

#### 16. **Formula Property** 🧮
```typescript
interface FormulaProperty {
  id: string
  type: 'formula'
  name: string
  formula: {
    expression: string
  }
}
```
**Supported Functions:**
- Math: `+`, `-`, `*`, `/`, `mod`, `pow`, `sqrt`
- Logical: `if`, `and`, `or`, `not`
- String: `concat`, `length`, `replace`, `contains`, `format`
- Date: `now()`, `dateAdd`, `dateSubtract`, `formatDate`
- Constants: `true`, `false`, `e`, `pi`

**Examples:**
```javascript
// Days until deadline
dateBetween(prop("Due Date"), now(), "days")

// Full name from first/last
concat(prop("First Name"), " ", prop("Last Name"))

// Price with tax
prop("Price") * 1.18

// Status emoji
if(prop("Status") == "Done", "✅", "⏳")
```

---

### 🔴 AUTO-GENERATED PROPERTY'LER (Read-only - Priority 4)

#### 17. **Created Time**
```typescript
interface CreatedTimeProperty {
  id: string
  type: 'created_time'
  name: string
  value: string  // ISO 8601
}
```
**Davranış:**
- Auto-set on creation
- Read-only
- Cannot be edited

---

#### 18. **Created By**
```typescript
interface CreatedByProperty {
  id: string
  type: 'created_by'
  name: string
  value: User
}
```

---

#### 19. **Last Edited Time**
```typescript
interface LastEditedTimeProperty {
  id: string
  type: 'last_edited_time'
  name: string
  value: string  // Auto-updates
}
```

---

#### 20. **Last Edited By**
```typescript
interface LastEditedByProperty {
  id: string
  type: 'last_edited_by'
  name: string
  value: User
}
```

---

## 📋 PART 2: DATABASE VIEWS (6 Types)

### 1️⃣ TABLE VIEW (En yaygın)

**Görünüm:**
```
┌─────────────┬──────────┬─────────┬──────────┐
│ Name        │ Status   │ Owner   │ Due Date │
├─────────────┼──────────┼─────────┼──────────┤
│ Task 1      │ Done ✅  │ Ali     │ Jan 15   │
│ Task 2      │ Doing 🔵 │ Ayşe    │ Jan 20   │
│ Task 3      │ Todo ⚪  │ Mehmet  │ Jan 25   │
└─────────────┴──────────┴─────────┴──────────┘
```

**Özellikler:**
- Rows = Pages
- Columns = Properties
- Inline editing (click cells)
- Column resize
- Column reorder (drag & drop)
- Column hide/show
- Freeze first column
- Row hover actions
- Calculations (sum, average, count) at bottom

**UI Elements:**
- `+ New` button at bottom
- Column headers clickable (sort)
- Right-click column header → menu
- Cell formats vary by property type

---

### 2️⃣ BOARD VIEW (Kanban)

**Görünüm:**
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   TO DO     │  │ IN PROGRESS │  │    DONE     │
├─────────────┤  ├─────────────┤  ├─────────────┤
│ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │
│ │ Task 1  │ │  │ │ Task 2  │ │  │ │ Task 3  │ │
│ │ 📅 Jan15│ │  │ │ 👤 Ali  │ │  │ │ ✅      │ │
│ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │
│             │  │             │  │             │
│ + New       │  │ + New       │  │ + New       │
└─────────────┘  └─────────────┘  └─────────────┘
```

**Özellikler:**
- Columns = Groups (based on Select/Status property)
- Cards = Pages
- Drag & drop between columns
- Sub-grouping (rows + columns)
- Card preview customization
- Collapse columns

**UI Elements:**
- Group by selector (top)
- Card size options (small/medium/large)
- Properties shown on card (customizable)
- Cover image option

---

### 3️⃣ LIST VIEW (Minimalist)

**Görünüm:**
```
📄 Task 1     Status: Done     Due: Jan 15
📄 Task 2     Status: In Progress   Due: Jan 20
📄 Task 3     Status: To Do    Due: Jan 25
```

**Özellikler:**
- Simple, clean layout
- Each item = one line
- Show/hide properties
- Good for docs, notes, articles
- Less visual clutter

---

### 4️⃣ GALLERY VIEW (Visual grid)

**Görünüm:**
```
┌──────┐  ┌──────┐  ┌──────┐
│ 🖼️   │  │ 🖼️   │  │ 🖼️   │
│Task 1│  │Task 2│  │Task 3│
│Owner │  │Owner │  │Owner │
└──────┘  └──────┘  └──────┘
```

**Özellikler:**
- Card grid
- Cover images prominent
- Card size: small/medium/large
- Good for: design systems, mood boards, employee directory
- Image from Files & Media property

---

### 5️⃣ CALENDAR VIEW

**Görünüm:**
```
    January 2025
Mo  Tu  We  Th  Fr  Sa  Su
        1   2   3   4   5
6   7   8   9  10  11  12
13 [14] 15  16  17  18  19
    Task 1

20  21  22  23  24  25  26
    Task 2

27  28  29  30  31
```

**Özellikler:**
- Month/Week/Day views (on mobile)
- Based on Date property
- Drag events to change date
- Event bars for date ranges
- Click day to create event
- Color coding by property

---

### 6️⃣ TIMELINE VIEW (Gantt)

**Görünüm:**
```
Tasks          │ Jan 1 ─────── Jan 15 ─────── Jan 31
───────────────┼─────────────────────────────────────
Task 1         │ ████████████░░░░░░░░░░░░░░░░░░
Task 2         │ ░░░░░░░░░░░░████████████░░░░░
Task 3         │ ░░░░░░░░░░░░░░░░░░░░████████

Scale: [Hours][Days][Weeks][Months][Years]
```

**Özellikler:**
- Horizontal timeline
- Date ranges as bars
- Drag to change dates
- Expand/shrink bars
- Scale selector (hourly to yearly)
- Table sidebar (optional)
- Good for: project planning, roadmaps

---

## 🔍 PART 3: FILTERING SYSTEM

### Filter Operators (Property Type'a göre)

#### Text Properties:
```typescript
type TextFilterOperator = 
  | 'equals'
  | 'does_not_equal'
  | 'contains'
  | 'does_not_contain'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
```

#### Number Properties:
```typescript
type NumberFilterOperator = 
  | 'equals'
  | 'does_not_equal'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal_to'
  | 'less_than_or_equal_to'
  | 'is_empty'
  | 'is_not_empty'
```

#### Date Properties:
```typescript
type DateFilterOperator = 
  | 'is'
  | 'is_before'
  | 'is_after'
  | 'is_on_or_before'
  | 'is_on_or_after'
  | 'is_within'  // Relative: today, tomorrow, past week, next month
  | 'is_empty'
  | 'is_not_empty'
```

#### Select Properties:
```typescript
type SelectFilterOperator = 
  | 'is'
  | 'is_not'
  | 'is_any_of'
  | 'is_none_of'
  | 'is_empty'
  | 'is_not_empty'
```

#### Checkbox:
```typescript
type CheckboxFilterOperator = 'is' | 'is_not'
```

---

### Filter Groups (AND/OR Logic)

**Simple Filter:**
```typescript
{
  property: "Status",
  select: {
    equals: "Done"
  }
}
```

**AND Logic (All must be true):**
```typescript
{
  and: [
    { property: "Status", select: { equals: "Done" } },
    { property: "Priority", select: { equals: "High" } }
  ]
}
```

**OR Logic (Any can be true):**
```typescript
{
  or: [
    { property: "Status", select: { equals: "In Progress" } },
    { property: "Status", select: { equals: "Done" } }
  ]
}
```

**Nested (3 levels deep max):**
```typescript
{
  and: [
    {
      or: [
        { property: "Owner", person: { contains: "Ali" } },
        { property: "Owner", person: { contains: "Ayşe" } }
      ]
    },
    {
      and: [
        { property: "Priority", select: { equals: "High" } },
        { property: "Due Date", date: { is_within: "this_week" } }
      ]
    }
  ]
}
```

**UI Görünümü:**
```
┌─ Filter ──────────────────────────────────────┐
│                                                │
│  Where  ▼                          + Add filter│
│  ┌──────────────────────────────────────────┐ │
│  │ AND ▼                                    │ │
│  │  ┌────────────────────────────────────┐ │ │
│  │  │ Status       is    Done       ✕   │ │ │
│  │  └────────────────────────────────────┘ │ │
│  │  ┌────────────────────────────────────┐ │ │
│  │  │ Priority     is    High       ✕   │ │ │
│  │  └────────────────────────────────────┘ │ │
│  │                                          │ │
│  │  + Add filter to group                  │ │
│  │  + Add filter group                     │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  □ Save for everyone                          │
└────────────────────────────────────────────────┘
```

---

## 📊 PART 4: SORTING SYSTEM

### Sort Rules

**Single Sort:**
```typescript
{
  property: "Due Date",
  direction: "ascending"  // or "descending"
}
```

**Multi-Level Sort:**
```typescript
[
  { property: "Priority", direction: "descending" },  // High first
  { property: "Due Date", direction: "ascending" }    // Then earliest
]
```

**Property-Specific Logic:**

- **Text:** Alphabetical (A-Z or Z-A)
- **Number:** Numerical (0-9 or 9-0)
- **Date:** Chronological (earliest-latest or latest-earliest)
- **Select:** Custom order (drag options in property settings)
- **Checkbox:** Unchecked first or Checked first
- **Person:** Alphabetical by name

**UI Görünümü:**
```
┌─ Sort ────────────────────────────────────────┐
│                                                │
│  ┌────────────────────────────────────────┐   │
│  │ ⋮⋮ Priority      Descending    ✕      │   │
│  └────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────┐   │
│  │ ⋮⋮ Due Date      Ascending     ✕      │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  + Add a sort                                  │
│                                                │
│  □ Save for everyone                          │
└────────────────────────────────────────────────┘
```

---

## 🎨 PART 5: UI/UX PATTERNS

### Property Configuration UI

**Add Property Flow:**
1. Click `+ Add property` button (top right of table)
2. Dropdown appears:
   ```
   ┌─ Add a property ──────────────────┐
   │ 🔍 Search property types...       │
   ├───────────────────────────────────┤
   │ 📝 Text                           │
   │ 🔢 Number                         │
   │ ☑️  Select                         │
   │ ☑️☑️ Multi-select                  │
   │ 📅 Date                           │
   │ ✅ Checkbox                       │
   │ 🔗 URL                            │
   │ 📧 Email                          │
   │ 📞 Phone                          │
   │ 👤 Person                         │
   │ 📎 Files & media                  │
   │ 🔗 Relation                       │
   │ 📊 Rollup                         │
   │ 🧮 Formula                        │
   │ 📈 Status                         │
   └───────────────────────────────────┘
   ```
3. Select type
4. Name the property
5. Configure (for Select: add options with colors)

---

### Column Header Menu

**Right-click column header:**
```
┌─────────────────────────┐
│ ⋮⋮ Drag to reorder     │
├─────────────────────────┤
│ 🔤 Rename              │
│ 🔀 Change type         │
│ 👁️ Hide property        │
│ 📌 Freeze column       │
│ 📏 Resize              │
│ ← Insert left          │
│ Insert right →         │
│ 🗑️ Delete              │
└─────────────────────────┘
```

---

### Cell Editing Patterns

**Text/Number:** Click → inline edit → blur to save

**Select:** Click → dropdown → select option → auto-save

**Multi-select:** Click → dropdown → check multiple → click outside

**Date:** Click → date picker modal:
```
┌─ Select date ─────────────────┐
│  ◀ January 2025 ▶             │
│                                │
│  Mo Tu We Th Fr Sa Su          │
│              1  2  3           │
│   4  5  6  7  8  9 10          │
│  11 12 13 [14] 15 16 17        │
│  18 19 20 21 22 23 24          │
│  25 26 27 28 29 30 31          │
│                                │
│  ☑️ Include time               │
│  ☑️ End date                   │
│  ☑️ Remind                     │
│                                │
│  [Clear]          [Done]       │
└────────────────────────────────┘
```

**Checkbox:** Click → toggle (instant)

**Person:** Click → people picker:
```
┌─ Assign ──────────────────┐
│ 🔍 Search people...       │
├───────────────────────────┤
│ ✓ Ali Yılmaz              │
│   Ayşe Kaya               │
│   Mehmet Demir            │
└───────────────────────────┘
```

---

### Property Visibility Toggle

**Properties menu:**
```
┌─ Properties ──────────────────────┐
│                                    │
│  👁️  Name (Title)                  │
│  👁️  Status                        │
│  👁️  Owner                         │
│  👁️  Due Date                      │
│  👁️‍🗨️ Priority                     │
│  👁️‍🗨️ Tags                         │
│  ─────────────────────────         │
│  + Add a property                  │
│                                    │
│  Wrap cells                        │
│  Show calculations                 │
└────────────────────────────────────┘

👁️ = Visible
👁️‍🗨️ = Hidden
```

---

## 💡 IMPLEMENTATION INSIGHTS

### Database Schema Best Practices:

```sql
-- Properties Table
CREATE TABLE database_properties (
  id TEXT PRIMARY KEY,
  database_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'text', 'number', 'select', etc.
  config TEXT,         -- JSON: { options, format, relation_db, etc. }
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  
  FOREIGN KEY (database_id) REFERENCES pages(id)
);

-- Property Values Table
CREATE TABLE property_values (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  value TEXT,  -- JSON representation of value
  
  FOREIGN KEY (page_id) REFERENCES pages(id),
  FOREIGN KEY (property_id) REFERENCES database_properties(id),
  UNIQUE(page_id, property_id)
);

-- Indexes
CREATE INDEX idx_prop_db ON database_properties(database_id);
CREATE INDEX idx_value_page ON property_values(page_id);
CREATE INDEX idx_value_prop ON property_values(property_id);
```

---

### Value Storage Examples:

```typescript
// Text
{ value: "Hello world" }

// Number
{ value: 1234.56 }

// Select
{ value: { id: "opt_1", name: "Done", color: "green" } }

// Multi-select
{ value: [
  { id: "opt_1", name: "Tag1", color: "blue" },
  { id: "opt_2", name: "Tag2", color: "red" }
]}

// Date
{ value: { start: "2024-01-15", end: null, time: null } }

// Checkbox
{ value: true }

// Person
{ value: [{ id: "user_1", name: "Ali", email: "ali@example.com" }] }

// Relation
{ value: [{ id: "page_1", title: "Related Page" }] }
```

---

## 🔥 PRIORITY IMPLEMENTATION ORDER

### WEEK 1-2: Core Properties
1. Title (built-in)
2. Text
3. Number
4. Select
5. Multi-select
6. Date
7. Checkbox

### WEEK 3: Contact Properties
8. URL
9. Email
10. Phone

### WEEK 4: Status + Person
11. Status (critical for task management)
12. Person

### WEEK 5-6: Advanced
13. Files & Media
14. Relation
15. Rollup

### WEEK 7-8: Formula + Auto
16. Formula
17. Created Time / Created By
18. Last Edited Time / Last Edited By

---

## 📸 VISUAL REFERENCES

**Key Notion UI Screenshots to Study:**

1. **Table View with Properties Panel:**
   - URL: https://www.notion.com/help/database-properties
   - Shows: Property types dropdown, column headers, inline editing

2. **Board View (Kanban):**
   - URL: https://www.notion.com/help/guides/when-to-use-each-type-of-database-view
   - Shows: Grouped columns, card design, drag handles

3. **Filter UI:**
   - URL: https://www.notion.com/help/views-filters-and-sorts
   - Shows: AND/OR logic, nested filters, operator dropdowns

4. **Property Configuration:**
   - URL: https://www.notion.com/help/database-properties
   - Shows: Add property button, type selector, options editor

---

## 🎯 QUICK WIN CHECKLIST

Implement these in order for fastest MVP:

- [ ] **Property System:**
  - [ ] Text property
  - [ ] Select property (with colors)
  - [ ] Date property
  - [ ] Status property

- [ ] **Table View:**
  - [ ] Display properties as columns
  - [ ] Inline cell editing
  - [ ] Column resize
  - [ ] Add/remove columns

- [ ] **Basic Filtering:**
  - [ ] Single filter (Status = Done)
  - [ ] Filter UI component

- [ ] **Basic Sorting:**
  - [ ] Sort by property (asc/desc)
  - [ ] Sort UI component

Bu tamamlandığında **minimal viable Notion database** hazır! 🚀

---

## 📚 ADDITIONAL RESOURCES

- Notion API Docs: https://developers.notion.com/reference/database
- Notion Help Center: https://www.notion.com/help/database-properties
- Property Objects Spec: https://developers.notion.com/reference/property-object
- Filter Syntax: https://developers.notion.com/reference/post-database-query-filter

---

**Hazırlayan:** Claude (Anthropic)  
**Tarih:** 12 Ocak 2025  
**Versiyon:** 1.0
